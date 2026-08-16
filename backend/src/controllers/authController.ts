import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { User } from '../models/User';
import { Settings } from '../models/Settings';
import { env } from '../config/env';
import { AuthRequest } from '../middleware/auth';

export const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

function generateTokens(user: { id: string; email: string; role: string }) {
  const accessToken = jwt.sign({ id: user.id, email: user.email, role: user.role }, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN as any,
  });

  const refreshToken = jwt.sign({ id: user.id }, env.REFRESH_SECRET, {
    expiresIn: env.REFRESH_EXPIRES_IN as any,
  });

  return { accessToken, refreshToken };
}

export async function register(req: Request, res: Response): Promise<void> {
  try {
    const { name, email, password } = req.body;

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      res.status(400).json({ error: 'User with this email already exists' });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      refreshTokens: [],
    });

    // Create default settings for user
    await Settings.create({ userId: user._id });

    const tokens = generateTokens({ id: user._id.toString(), email: user.email, role: user.role });

    user.refreshTokens.push(tokens.refreshToken);
    await user.save();

    res.status(201).json({
      message: 'User registered successfully',
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
      tokens,
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Server error during registration' });
  }
}

export async function login(req: Request, res: Response): Promise<void> {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      res.status(401).json({ error: 'Invalid email or password' });
      return;
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      res.status(401).json({ error: 'Invalid email or password' });
      return;
    }

    const tokens = generateTokens({ id: user._id.toString(), email: user.email, role: user.role });

    // Store refresh token
    user.refreshTokens.push(tokens.refreshToken);
    // Keep max 5 refresh tokens
    if (user.refreshTokens.length > 5) user.refreshTokens.shift();
    await user.save();

    res.json({
      message: 'Login successful',
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
      tokens,
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Server error during login' });
  }
}

export async function refreshToken(req: Request, res: Response): Promise<void> {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      res.status(400).json({ error: 'Refresh token is required' });
      return;
    }

    const decoded = jwt.verify(refreshToken, env.REFRESH_SECRET) as { id: string };
    const user = await User.findById(decoded.id);

    if (!user || !user.refreshTokens.includes(refreshToken)) {
      res.status(403).json({ error: 'Invalid refresh token' });
      return;
    }

    const newTokens = generateTokens({ id: user._id.toString(), email: user.email, role: user.role });

    // Rotate refresh token
    user.refreshTokens = user.refreshTokens.filter((t) => t !== refreshToken);
    user.refreshTokens.push(newTokens.refreshToken);
    await user.save();

    res.json({ tokens: newTokens });
  } catch (err) {
    res.status(403).json({ error: 'Expired or invalid refresh token' });
  }
}

export async function logout(req: AuthRequest, res: Response): Promise<void> {
  try {
    const { refreshToken } = req.body;
    if (req.user && refreshToken) {
      await User.findByIdAndUpdate(req.user.id, { $pull: { refreshTokens: refreshToken } });
    }
    res.json({ message: 'Logged out successfully' });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Logout failed' });
  }
}

export async function getProfile(req: AuthRequest, res: Response): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Not authenticated' });
      return;
    }
    const user = await User.findById(req.user.id).select('-password -refreshTokens');
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }
    res.json({ user });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Error fetching profile' });
  }
}
