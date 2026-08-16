import { Incident, IncidentStatus, IncidentType } from '../models/Incident';
import { IWebsite } from '../models/Website';
import { createNotification } from './notificationService';
import { getIO } from '../socket/socketHandler';

export async function processWebsiteCheckResult(params: {
  website: IWebsite;
  status: 'up' | 'down' | 'degraded';
  statusCode?: number;
  responseTimeMs: number;
  errorMessage?: string;
  sslDaysRemaining?: number;
  dnsResolved: boolean;
}) {
  const { website, status, statusCode, responseTimeMs, errorMessage, sslDaysRemaining, dnsResolved } = params;

  // 1. Check for open active incidents for this website
  const activeIncident = await Incident.findOne({
    websiteId: website._id,
    status: { $in: ['investigating', 'identified', 'monitoring'] },
  }).sort({ createdAt: -1 });

  // 2. If website is down or degraded, evaluate if we need to create an incident
  if (status === 'down' || status === 'degraded') {
    let incidentType: IncidentType = 'downtime';
    let cause = errorMessage || `Website failed check with status ${statusCode || 'timeout'}`;

    if (!dnsResolved) {
      incidentType = 'dns_failure';
      cause = 'DNS lookup failed to resolve target hostname';
    } else if (sslDaysRemaining !== undefined && sslDaysRemaining <= 0) {
      incidentType = 'ssl_expiry';
      cause = 'SSL certificate has expired';
    } else if (status === 'degraded') {
      incidentType = 'high_latency';
      cause = `Response time (${responseTimeMs}ms) exceeded maximum threshold (${website.responseTimeThresholdMs}ms)`;
    }

    if (!activeIncident) {
      // Create new incident
      const newIncident = await Incident.create({
        websiteId: website._id,
        title: `${website.name} - ${incidentType.replace('_', ' ').toUpperCase()}`,
        type: incidentType,
        severity: status === 'down' ? 'critical' : 'warning',
        status: 'investigating',
        cause,
        startedAt: new Date(),
        timeline: [
          {
            timestamp: new Date(),
            status: 'investigating',
            message: `Automated detection triggered: ${cause}`,
          },
        ],
      });

      // Send alert notification
      await createNotification({
        userId: website.createdBy.toString(),
        websiteId: website._id.toString(),
        incidentId: newIncident._id.toString(),
        title: `🚨 Outage Alert: ${website.name}`,
        message: cause,
        type: status === 'down' ? 'down' : 'degraded',
      });

      const io = getIO();
      if (io) {
        io.emit('incident:created', newIncident);
      }
    }
  } else if (status === 'up' && activeIncident) {
    // 3. Website recovered! Resolve active incident
    activeIncident.status = 'resolved';
    activeIncident.resolvedAt = new Date();
    activeIncident.timeline.push({
      timestamp: new Date(),
      status: 'resolved',
      message: `System restored. Endpoint returned status ${statusCode} in ${responseTimeMs}ms.`,
    });
    await activeIncident.save();

    // Send recovery notification
    await createNotification({
      userId: website.createdBy.toString(),
      websiteId: website._id.toString(),
      incidentId: activeIncident._id.toString(),
      title: `✅ Recovered: ${website.name}`,
      message: `${website.name} is back online with normal performance (${responseTimeMs}ms).`,
      type: 'recovered',
    });

    const io = getIO();
    if (io) {
      io.emit('incident:resolved', activeIncident);
    }
  }

  // 4. SSL Expiry warning check (if <= 14 days)
  if (sslDaysRemaining !== undefined && sslDaysRemaining > 0 && sslDaysRemaining <= 14) {
    await createNotification({
      userId: website.createdBy.toString(),
      websiteId: website._id.toString(),
      title: `⚠️ SSL Expiring Soon: ${website.name}`,
      message: `SSL certificate expires in ${sslDaysRemaining} days.`,
      type: 'ssl_expiring',
    });
  }
}
