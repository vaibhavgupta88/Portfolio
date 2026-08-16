import { Router } from 'express';
import { getDashboardStats, getHistoricalMetrics } from '../controllers/monitoringController';
import { authenticate } from '../middleware/auth';

const router = Router();

router.use(authenticate);

router.get('/dashboard-stats', getDashboardStats);
router.get('/metrics', getHistoricalMetrics);

export default router;
