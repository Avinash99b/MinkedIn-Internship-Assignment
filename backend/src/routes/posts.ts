import { Router } from 'express';
import {createPost, getPostById, getPublicPosts} from '../controllers/postsController';
import { verifyToken } from '../middleware/auth';
import {getCommentsForPost} from "../controllers/commentsController";

const router = Router();

router.post('/', verifyToken, createPost);
router.get('/public', verifyToken, getPublicPosts);
router.get('/:post_id', verifyToken, getPostById);
router.get('/:post_id/comments', verifyToken, getCommentsForPost);

export default router;
