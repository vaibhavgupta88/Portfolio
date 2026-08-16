import { Router } from 'express';
import { getSettings, updateSettings, updateProfile } from '../controllers/userController';
import { authenticate } from '../middleware/auth';

const router = Router();

router.use(authenticate);

router.get('/settings', getSettings);
router.put('/settings', updateSettings);
router.put('/profile', updateProfile);

export default router;
