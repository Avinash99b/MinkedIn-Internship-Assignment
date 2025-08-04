// routes/posts.routes.ts
import { Router } from 'express';
import {
    createPost,
    getPostById,
    getPublicPosts,
    getMyPosts,
    updatePost,
    deletePost
} from '../controllers/postsController';
import { verifyToken } from '../middleware/auth';
import { getCommentsForPost } from "../controllers/commentsController";

const router = Router();

router.post('/', verifyToken, createPost);
router.get('/', verifyToken, getMyPosts);
router.get('/public', getPublicPosts);
router.get('/:post_id', verifyToken, getPostById);
router.put('/:post_id', verifyToken, updatePost);
router.delete('/:post_id', verifyToken, deletePost);
router.get('/:post_id/comments', verifyToken, getCommentsForPost);

export default router;
