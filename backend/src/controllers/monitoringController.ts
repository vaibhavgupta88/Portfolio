import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { Website } from '../models/Website';
import { MonitoringCheck } from '../models/MonitoringCheck';
import { Incident } from '../models/Incident';

export async function getDashboardStats(req: AuthRequest, res: Response): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const userId = req.user.id;
    const websites = await Website.find({ createdBy: userId });

    const total = websites.length;
    const online = websites.filter((w) => w.lastCheckStatus === 'up' && !w.isPaused).length;
    const offline = websites.filter((w) => w.lastCheckStatus === 'down' && !w.isPaused).length;
    const degraded = websites.filter((w) => w.lastCheckStatus === 'degraded' && !w.isPaused).length;
    const paused = websites.filter((w) => w.isPaused).length;

    // Overall Uptime Percentage
    const avgUptime = total > 0
      ? Number((websites.reduce((acc, w) => acc + w.uptimePercentage, 0) / total).toFixed(2))
      : 100;

    // Average Response Time
    const activeWebsites = websites.filter((w) => !w.isPaused && w.lastResponseTimeMs);
    const avgResponseTime = activeWebsites.length > 0
      ? Math.round(activeWebsites.reduce((acc, w) => acc + (w.lastResponseTimeMs || 0), 0) / activeWebsites.length)
      : 0;

    // Active Incidents
    const websiteIds = websites.map((w) => w._id);
    const activeIncidentsCount = await Incident.countDocuments({
      websiteId: { $in: websiteIds },
      status: { $in: ['investigating', 'identified', 'monitoring'] },
    });

    // SSL Certificates expiring within 14 days
    const sslExpiringSoon = websites.filter(
      (w) => w.sslDaysRemaining !== undefined && w.sslDaysRemaining > 0 && w.sslDaysRemaining <= 14
    ).length;

    // Regional node status simulation data
    const regions = [
      { id: 'us-east', name: 'US East (N. Virginia)', lat: 38.0339, lng: -78.5079, code: 'US-E' },
      { id: 'us-west', name: 'US West (Oregon)', lat: 43.8041, lng: -120.5542, code: 'US-W' },
      { id: 'eu-west', name: 'EU West (Frankfurt)', lat: 50.1109, lng: 8.6821, code: 'EU-C' },
      { id: 'ap-south', name: 'AP South (Mumbai)', lat: 19.076, lng: 72.8777, code: 'AP-S' },
      { id: 'ap-east', name: 'AP East (Tokyo)', lat: 35.6762, lng: 139.6503, code: 'AP-E' },
      { id: 'sa-east', name: 'SA East (São Paulo)', lat: -23.5505, lng: -46.6333, code: 'SA-E' },
      { id: 'au-east', name: 'AU East (Sydney)', lat: -33.8688, lng: 151.2093, code: 'AU-E' },
    ].map((r) => {
      let status = 'healthy';
      if (offline > 0) status = 'degraded';
      if (offline > total / 2) status = 'down';
      return {
        ...r,
        status,
        latencyMs: Math.round(avgResponseTime + (Math.random() * 30 - 15)),
        totalMonitored: total,
      };
    });

    res.json({
      stats: {
        total,
        online,
        offline,
        degraded,
        paused,
        avgUptime,
        avgResponseTime,
        activeIncidentsCount,
        sslExpiringSoon,
      },
      regions,
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Error fetching dashboard stats' });
  }
}

export async function getHistoricalMetrics(req: AuthRequest, res: Response): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const { websiteId, hours = '24' } = req.query;
    const since = new Date(Date.now() - parseInt(String(hours), 10) * 60 * 60 * 1000);

    const filter: any = { timestamp: { $gte: since } };
    if (websiteId) {
      filter.websiteId = websiteId;
    } else {
      const websites = await Website.find({ createdBy: req.user.id });
      filter.websiteId = { $in: websites.map((w) => w._id) };
    }

    const checks = await MonitoringCheck.find(filter)
      .sort({ timestamp: 1 })
      .limit(300);

    res.json({ checks });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Error fetching metrics' });
  }
}
