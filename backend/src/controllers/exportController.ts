import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { Website } from '../models/Website';
import { Incident } from '../models/Incident';
import { MonitoringCheck } from '../models/MonitoringCheck';

export async function exportReportData(req: AuthRequest, res: Response): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const userId = req.user.id;
    const websites = await Website.find({ createdBy: userId }).lean();
    const websiteIds = websites.map((w) => w._id);

    const incidents = await Incident.find({ websiteId: { $in: websiteIds } })
      .sort({ createdAt: -1 })
      .lean();

    const recentChecks = await MonitoringCheck.find({ websiteId: { $in: websiteIds } })
      .sort({ timestamp: -1 })
      .limit(100)
      .lean();

    const report = {
      generatedAt: new Date().toISOString(),
      user: req.user.email,
      summary: {
        totalMonitoredWebsites: websites.length,
        onlineWebsites: websites.filter((w) => w.lastCheckStatus === 'up').length,
        offlineWebsites: websites.filter((w) => w.lastCheckStatus === 'down').length,
        degradedWebsites: websites.filter((w) => w.lastCheckStatus === 'degraded').length,
        avgUptimePercentage:
          websites.length > 0
            ? (websites.reduce((acc, w) => acc + w.uptimePercentage, 0) / websites.length).toFixed(2)
            : '100',
        totalIncidentsRecorded: incidents.length,
      },
      websites: websites.map((w) => ({
        id: w._id,
        name: w.name,
        url: w.url,
        status: w.lastCheckStatus,
        uptimePercentage: w.uptimePercentage,
        lastLatencyMs: w.lastResponseTimeMs,
        sslDaysRemaining: w.sslDaysRemaining,
        cdnProvider: w.cdnProvider,
      })),
      recentIncidents: incidents.slice(0, 15),
      recentChecks: recentChecks.slice(0, 30),
    };

    res.json(report);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Error exporting report data' });
  }
}
