import { Router } from 'express';
import {
  createWebsite,
  getWebsites,
  getWebsiteById,
  updateWebsite,
  deleteWebsite,
  togglePauseWebsite,
  triggerManualCheck,
  createWebsiteSchema,
  updateWebsiteSchema,
} from '../controllers/websiteController';
import { authenticate } from '../middleware/auth';
import { validateBody } from '../middleware/validate';

const router = Router();

router.use(authenticate);

router.get('/', getWebsites);
router.post('/', validateBody(createWebsiteSchema), createWebsite);
router.get('/:id', getWebsiteById);
router.put('/:id', validateBody(updateWebsiteSchema), updateWebsite);
router.delete('/:id', deleteWebsite);
router.patch('/:id/toggle-pause', togglePauseWebsite);
router.post('/:id/check-now', triggerManualCheck);

export default router;
