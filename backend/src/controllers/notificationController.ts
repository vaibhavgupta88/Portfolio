import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { Notification } from '../models/Notification';

export async function getNotifications(req: AuthRequest, res: Response): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const notifications = await Notification.find({ userId: req.user.id })
      .populate('websiteId', 'name url')
      .sort({ timestamp: -1 })
      .limit(50);

    const unreadCount = await Notification.countDocuments({ userId: req.user.id, read: false });

    res.json({ notifications, unreadCount });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Error fetching notifications' });
  }
}

export async function markAsRead(req: AuthRequest, res: Response): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const { id } = req.params;
    if (id === 'all') {
      await Notification.updateMany({ userId: req.user.id, read: false }, { $set: { read: true } });
    } else {
      await Notification.findOneAndUpdate({ _id: id, userId: req.user.id }, { $set: { read: true } });
    }

    res.json({ message: 'Notification(s) marked as read' });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Error marking notifications as read' });
  }
}

export async function clearNotifications(req: AuthRequest, res: Response): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    await Notification.deleteMany({ userId: req.user.id });
    res.json({ message: 'Notifications cleared' });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Error clearing notifications' });
  }
}
