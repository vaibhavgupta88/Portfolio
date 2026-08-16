import express from 'express';
import http from 'http';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import { env } from './config/env';
import { connectDB } from './config/db';
import { initSocketServer } from './socket/socketHandler';
import { startCronScheduler } from './jobs/cronScheduler';

import authRoutes from './routes/authRoutes';
import websiteRoutes from './routes/websiteRoutes';
import monitoringRoutes from './routes/monitoringRoutes';
import incidentRoutes from './routes/incidentRoutes';
import notificationRoutes from './routes/notificationRoutes';
import userRoutes from './routes/userRoutes';
import exportRoutes from './routes/exportRoutes';

async function bootstrap() {
  const app = express();
  const server = http.createServer(app);

  // Connect Database
  await connectDB();

  // Initialize Socket.IO
  initSocketServer(server);

  // Middleware
  app.use(cors({ origin: '*', credentials: true }));
  app.use(express.json());

  // Basic Rate Limiting
  const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 500,
    message: { error: 'Too many requests, please try again later.' },
  });
  app.use('/api', apiLimiter);

  // Health check endpoint
  app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString(), service: 'Internet Resilience Map API' });
  });

  // Mount API Routes
  app.use('/api/auth', authRoutes);
  app.use('/api/websites', websiteRoutes);
  app.use('/api/monitoring', monitoringRoutes);
  app.use('/api/incidents', incidentRoutes);
  app.use('/api/notifications', notificationRoutes);
  app.use('/api/users', userRoutes);
  app.use('/api/export', exportRoutes);

  // Global Error Handler
  app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error('[Global Error]', err);
    res.status(err.status || 500).json({ error: err.message || 'Internal Server Error' });
  });

  // Start Cron Job Scheduler
  startCronScheduler();

  // Start Server
  const PORT = parseInt(env.PORT, 10);
  server.listen(PORT, () => {
    console.log(`=======================================================`);
    console.log(`🚀 Internet Resilience Map Server running on port ${PORT}`);
    console.log(`📡 Environment: ${env.NODE_ENV}`);
    console.log(`=======================================================`);
  });
}

bootstrap().catch((err) => {
  console.error('Failed to launch server:', err);
  process.exit(1);
});
