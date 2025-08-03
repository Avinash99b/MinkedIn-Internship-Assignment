import { Router } from 'express';
import { createPost, getPublicPosts } from '../controllers/postsController';
import { verifyToken } from '../middleware/auth';

const router = Router();

router.post('/', verifyToken, createPost);
router.get('/public', verifyToken, getPublicPosts);

export default router;
