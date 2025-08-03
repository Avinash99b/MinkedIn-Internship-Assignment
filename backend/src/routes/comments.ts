import { Router } from 'express';
import { addComment } from '../controllers/commentsController';
import { verifyToken } from '../middleware/auth';

const router = Router();

router.post('/', verifyToken, addComment);

export default router;
