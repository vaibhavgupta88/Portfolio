import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(__dirname, '../../.env') });

export const env = {
  PORT: process.env.PORT || '5000',
  NODE_ENV: process.env.NODE_ENV || 'development',
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/internet_resilience',
  JWT_SECRET: process.env.JWT_SECRET || 'internet_resilience_super_secret_jwt_key_2026',
  REFRESH_SECRET: process.env.REFRESH_SECRET || 'internet_resilience_super_secret_refresh_key_2026',
  JWT_EXPIRES_IN: '15m',
  REFRESH_EXPIRES_IN: '7d',
  CLIENT_ORIGIN: process.env.CLIENT_ORIGIN || 'http://localhost:5173',
};
