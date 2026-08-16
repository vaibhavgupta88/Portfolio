import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { Settings } from '../models/Settings';
import { User } from '../models/User';

export async function getSettings(req: AuthRequest, res: Response): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    let settings = await Settings.findOne({ userId: req.user.id });
    if (!settings) {
      settings = await Settings.create({ userId: req.user.id });
    }

    res.json({ settings });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Error fetching user settings' });
  }
}

export async function updateSettings(req: AuthRequest, res: Response): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const settings = await Settings.findOneAndUpdate(
      { userId: req.user.id },
      { $set: req.body },
      { new: true, upsert: true }
    );

    res.json({ settings, message: 'Settings updated successfully' });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Error updating user settings' });
  }
}

export async function updateProfile(req: AuthRequest, res: Response): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const { name, email } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $set: { name, email: email?.toLowerCase() } },
      { new: true }
    ).select('-password -refreshTokens');

    res.json({ user, message: 'Profile updated successfully' });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Error updating profile' });
  }
}
