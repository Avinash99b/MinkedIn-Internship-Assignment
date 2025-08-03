import { Router } from 'express';
import { getMe, getUserById } from '../controllers/usersController';
import { verifyToken } from '../middleware/auth';

const router = Router();

router.get('/me', verifyToken, getMe);
router.get('/:uid', getUserById);

export default router;
