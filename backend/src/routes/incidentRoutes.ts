import { Router } from 'express';
import { getIncidents, getIncidentById, updateIncidentStatus } from '../controllers/incidentController';
import { authenticate } from '../middleware/auth';

const router = Router();

router.use(authenticate);

router.get('/', getIncidents);
router.get('/:id', getIncidentById);
router.patch('/:id/status', updateIncidentStatus);

export default router;
