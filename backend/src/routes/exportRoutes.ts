import { Router } from 'express';
import { exportReportData } from '../controllers/exportController';
import { authenticate } from '../middleware/auth';

const router = Router();

router.use(authenticate);

router.get('/report', exportReportData);

export default router;
