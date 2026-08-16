import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { Incident } from '../models/Incident';
import { Website } from '../models/Website';
import { getIO } from '../socket/socketHandler';

export async function getIncidents(req: AuthRequest, res: Response): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const { websiteId, status, severity } = req.query;

    const websites = await Website.find({ createdBy: req.user.id });
    const userWebsiteIds = websites.map((w) => w._id);

    const filter: any = { websiteId: { $in: userWebsiteIds } };
    if (websiteId) filter.websiteId = websiteId;
    if (status) filter.status = status;
    if (severity) filter.severity = severity;

    const incidents = await Incident.find(filter)
      .populate('websiteId', 'name url')
      .sort({ createdAt: -1 });

    res.json({ incidents });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Error fetching incidents' });
  }
}

export async function getIncidentById(req: AuthRequest, res: Response): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const { id } = req.params;
    const incident = await Incident.findById(id).populate('websiteId', 'name url');

    if (!incident) {
      res.status(404).json({ error: 'Incident not found' });
      return;
    }

    res.json({ incident });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Error fetching incident details' });
  }
}

export async function updateIncidentStatus(req: AuthRequest, res: Response): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const { id } = req.params;
    const { status, message } = req.body;

    const incident = await Incident.findById(id);
    if (!incident) {
      res.status(404).json({ error: 'Incident not found' });
      return;
    }

    incident.status = status;
    if (status === 'resolved') {
      incident.resolvedAt = new Date();
    }

    incident.timeline.push({
      timestamp: new Date(),
      status,
      message: message || `Status updated manually to ${status}`,
    });

    await incident.save();

    const io = getIO();
    if (io) {
      io.emit('incident:updated', incident);
    }

    res.json({ incident });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Error updating incident' });
  }
}
