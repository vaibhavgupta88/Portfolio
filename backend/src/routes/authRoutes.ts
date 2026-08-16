import { Router } from 'express';
import { register, login, refreshToken, logout, getProfile, registerSchema, loginSchema } from '../controllers/authController';
import { validateBody } from '../middleware/validate';
import { authenticate } from '../middleware/auth';

const router = Router();

router.post('/register', validateBody(registerSchema), register);
router.post('/login', validateBody(loginSchema), login);
router.post('/refresh', refreshToken);
router.post('/logout', authenticate, logout);
router.get('/profile', authenticate, getProfile);

export default router;
