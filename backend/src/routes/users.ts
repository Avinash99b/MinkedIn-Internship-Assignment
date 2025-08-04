import { Router } from 'express';
import {
    getMe,
    getUserById,
    incrementProfileViews,
    updateMyBio
} from '../controllers/usersController';
import { verifyToken } from '../middleware/auth';

const router = Router();

// Get current user's full profile
router.get('/me', verifyToken, getMe);

// Get another user's full profile
router.get('/:uid', getUserById);

// Increment profile view count for a user
router.post('/:uid/view', verifyToken, incrementProfileViews);

// Update current user's bio
router.patch('/me/bio', verifyToken, updateMyBio);

export default router;
