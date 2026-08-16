import { Router } from 'express';
import { getNotifications, markAsRead, clearNotifications } from '../controllers/notificationController';
import { authenticate } from '../middleware/auth';

const router = Router();

router.use(authenticate);

router.get('/', getNotifications);
router.patch('/read/:id', markAsRead);
router.delete('/', clearNotifications);

export default router;
