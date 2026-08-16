import { Response } from 'express';
import { z } from 'zod';
import { Website } from '../models/Website';
import { MonitoringCheck } from '../models/MonitoringCheck';
import { Incident } from '../models/Incident';
import { AuthRequest } from '../middleware/auth';
import { performCheckForWebsite } from '../services/monitoringEngine';

export const createWebsiteSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  url: z.string().url('Must be a valid HTTP or HTTPS URL'),
  checkIntervalSeconds: z.number().min(30).default(60),
  responseTimeThresholdMs: z.number().min(100).default(1500),
  expectedStatusCode: z.number().default(200),
  tags: z.array(z.string()).default([]),
  regions: z.array(z.string()).default(['us-east', 'us-west', 'eu-west', 'ap-south']),
});

export const updateWebsiteSchema = createWebsiteSchema.partial();

export async function createWebsite(req: AuthRequest, res: Response): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const payload = req.body;
    let formattedUrl = payload.url.trim();
    if (!formattedUrl.startsWith('http://') && !formattedUrl.startsWith('https://')) {
      formattedUrl = `https://${formattedUrl}`;
    }

    const website = await Website.create({
      ...payload,
      url: formattedUrl,
      createdBy: req.user.id,
      lastCheckStatus: 'unknown',
    });

    // Run initial check asynchronously
    performCheckForWebsite(website).catch((err) => {
      console.error(`[WebsiteController] Initial check error for ${website.url}:`, err);
    });

    res.status(201).json({ website });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Error creating website' });
  }
}

export async function getWebsites(req: AuthRequest, res: Response): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const { search, status, tag } = req.query;
    const filter: any = { createdBy: req.user.id };

    if (search) {
      filter.$or = [
        { name: { $regex: String(search), $options: 'i' } },
        { url: { $regex: String(search), $options: 'i' } },
      ];
    }

    if (status) {
      if (status === 'paused') {
        filter.isPaused = true;
      } else {
        filter.lastCheckStatus = status;
        filter.isPaused = false;
      }
    }

    if (tag) {
      filter.tags = String(tag);
    }

    const websites = await Website.find(filter).sort({ createdAt: -1 });
    res.json({ websites });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Error fetching websites' });
  }
}

export async function getWebsiteById(req: AuthRequest, res: Response): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const { id } = req.params;
    const website = await Website.findOne({ _id: id, createdBy: req.user.id });

    if (!website) {
      res.status(404).json({ error: 'Website not found' });
      return;
    }

    const latestChecks = await MonitoringCheck.find({ websiteId: website._id })
      .sort({ timestamp: -1 })
      .limit(50);

    const recentIncidents = await Incident.find({ websiteId: website._id })
      .sort({ createdAt: -1 })
      .limit(10);

    res.json({ website, checks: latestChecks, incidents: recentIncidents });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Error fetching website details' });
  }
}

export async function updateWebsite(req: AuthRequest, res: Response): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const { id } = req.params;
    const website = await Website.findOneAndUpdate(
      { _id: id, createdBy: req.user.id },
      { $set: req.body },
      { new: true }
    );

    if (!website) {
      res.status(404).json({ error: 'Website not found' });
      return;
    }

    res.json({ website });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Error updating website' });
  }
}

export async function deleteWebsite(req: AuthRequest, res: Response): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const { id } = req.params;
    const website = await Website.findOneAndDelete({ _id: id, createdBy: req.user.id });

    if (!website) {
      res.status(404).json({ error: 'Website not found' });
      return;
    }

    // Cascade delete monitoring checks and incidents
    await MonitoringCheck.deleteMany({ websiteId: id });
    await Incident.deleteMany({ websiteId: id });

    res.json({ message: 'Website deleted successfully' });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Error deleting website' });
  }
}

export async function togglePauseWebsite(req: AuthRequest, res: Response): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const { id } = req.params;
    const website = await Website.findOne({ _id: id, createdBy: req.user.id });

    if (!website) {
      res.status(404).json({ error: 'Website not found' });
      return;
    }

    website.isPaused = !website.isPaused;
    await website.save();

    res.json({ website, message: website.isPaused ? 'Monitoring paused' : 'Monitoring resumed' });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Error toggling monitoring status' });
  }
}

export async function triggerManualCheck(req: AuthRequest, res: Response): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const { id } = req.params;
    const website = await Website.findOne({ _id: id, createdBy: req.user.id });

    if (!website) {
      res.status(404).json({ error: 'Website not found' });
      return;
    }

    const check = await performCheckForWebsite(website, 'us-east');
    res.json({ message: 'Check performed successfully', check });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Error triggering check' });
  }
}
