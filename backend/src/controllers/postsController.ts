import { Request, Response } from 'express';
import pool from '../config/db';
import {PostSchema} from "../validators/postSchema";

export async function getPostById(req: Request, res: Response) {
    try {
        const postId = parseInt(req.params.post_id, 10);
        const result = await pool.query(`SELECT * FROM posts WHERE id = $1`, [postId]);
        if (!result.rows.length) {
            return res.status(404).json({ error: 'Post not found' });
        }
        res.json(result.rows[0]);
    } catch(err) {
        console.error('Register error:', err);
        res.status(500).json({ error: 'Server error' });
    }
}


export async function createPost(req: Request, res: Response) {
    const parseResult = PostSchema.safeParse(req.body);
    if (!parseResult.success) {
        return res.status(400).json({ error: parseResult.error.flatten() });
    }

    const { post_data, field, visibility } = parseResult.data;

    try {
        const result = await pool.query(
            `INSERT INTO posts (user_id, post_data, field, visibility) 
       VALUES ($1, $2, $3, $4) RETURNING *`,
            [req.user!.uid, post_data, field, visibility]
        );
        res.status(201).json(result.rows[0]);
    } catch(err) {
        console.error('Register error:', err);
        res.status(500).json({ error: 'Server error' });
    }
}

export async function getPublicPosts(req: Request, res: Response) {
    try {
        const { uid } = req.user!;
        const user = await pool.query('SELECT desired_field FROM users WHERE uid = $1', [uid]);
        const desiredField = user.rows[0]?.desired_field;

        const result = await pool.query(
            `SELECT * FROM posts 
       WHERE visibility = 'public' 
       ORDER BY (field = $1) DESC, created_at DESC`,
            [desiredField]
        );
        res.json(result.rows);
    } catch {
        res.status(500).json({ error: 'Server error' });
    }
}
