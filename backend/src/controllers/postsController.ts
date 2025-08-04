// controllers/postsController.ts
import { Request, Response } from 'express';
import pool from '../config/db';
import { PostSchema } from "../validators/postSchema";

// Get single post by ID
export async function getPostById(req: Request, res: Response) {
    try {
        const postId = parseInt(req.params.post_id, 10);
        const result = await pool.query(
            `SELECT id, user_id, post_data, field, visibility, created_at, updated_at, likes_count, comments_count
             FROM posts WHERE id = $1`,
            [postId]
        );
        if (!result.rows.length) {
            return res.status(404).json({ error: 'Post not found' });
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error('Get post error:', err);
        res.status(500).json({ error: 'Server error' });
    }
}

// Create post
export async function createPost(req: Request, res: Response) {
    const parseResult = PostSchema.safeParse(req.body);
    if (!parseResult.success) {
        return res.status(400).json({ error: parseResult.error.flatten() });
    }
    const { post_data, field, visibility } = parseResult.data;

    try {
        const result = await pool.query(
            `INSERT INTO posts (user_id, post_data, field, visibility)
             VALUES ($1, $2, $3, $4)
             RETURNING id, user_id, post_data, field, visibility, created_at, updated_at, likes_count, comments_count`,
            [req.user!.uid, post_data, field, visibility]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error('Create post error:', err);
        res.status(500).json({ error: 'Server error' });
    }
}

// Get current user's posts
export async function getMyPosts(req: Request, res: Response) {
    try {
        const { uid } = req.user!;
        const result = await pool.query(
            `SELECT id, user_id, post_data, field, visibility, created_at, updated_at, likes_count, comments_count
             FROM posts WHERE user_id = $1 ORDER BY created_at DESC`,
            [uid]
        );
        res.json(result.rows);
    } catch (err) {
        console.error('Get my posts error:', err);
        res.status(500).json({ error: 'Server error' });
    }
}

// Get public posts feed
export async function getPublicPosts(req: Request, res: Response) {
    try {

        const result = await pool.query(
            `SELECT id, user_id, post_data, field, visibility, created_at, updated_at, likes_count, comments_count
             FROM posts
             WHERE visibility = 'public'
             ORDER BY created_at DESC
            LIMIT 100`,
            []
        );
        res.json(result.rows);
    } catch (err) {
        console.error('Get public posts error:', err);
        res.status(500).json({ error: 'Server error' });
    }
}

// Update post
export async function updatePost(req: Request, res: Response) {
    const postId = parseInt(req.params.post_id, 10);
    const { post_data, field, visibility } = req.body;

    try {
        const result = await pool.query(
            `UPDATE posts
             SET post_data = COALESCE($1, post_data),
                 field = COALESCE($2, field),
                 visibility = COALESCE($3, visibility),
                 updated_at = NOW()
             WHERE id = $4 AND user_id = $5
             RETURNING id, user_id, post_data, field, visibility, created_at, updated_at, likes_count, comments_count`,
            [post_data, field, visibility, postId, req.user!.uid]
        );

        if (!result.rows.length) {
            return res.status(404).json({ error: 'Post not found or not owned by user' });
        }

        res.json(result.rows[0]);
    } catch (err) {
        console.error('Update post error:', err);
        res.status(500).json({ error: 'Server error' });
    }
}

// Delete post
export async function deletePost(req: Request, res: Response) {
    const postId = parseInt(req.params.post_id, 10);
    try {
        const result = await pool.query(
            `DELETE FROM posts WHERE id = $1 AND user_id = $2 RETURNING id`,
            [postId, req.user!.uid]
        );

        if (!result.rows.length) {
            return res.status(404).json({ error: 'Post not found or not owned by user' });
        }

        res.status(204).send();
    } catch (err) {
        console.error('Delete post error:', err);
        res.status(500).json({ error: 'Server error' });
    }
}
