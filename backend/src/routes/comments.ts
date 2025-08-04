// routes/comments.routes.ts
import { Router } from 'express';
import { addComment, getCommentsForPost } from '../controllers/commentsController';
import { verifyToken } from '../middleware/auth';

const router = Router();

// Add a comment to a post
router.post('/', verifyToken, addComment);

// Get comments for a specific post
router.get('/posts/:post_id/comments', getCommentsForPost);

export default router;
