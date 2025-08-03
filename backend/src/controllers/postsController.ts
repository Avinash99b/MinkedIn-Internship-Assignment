import { Request, Response } from 'express';
import pool from '../config/db';

export async function createPost(req: Request, res: Response) {
    const { post_data, field, visibility } = req.body;
    try {
        const result = await pool.query(
            `INSERT INTO posts (user_id, post_data, field, visibility) 
       VALUES ($1, $2, $3, $4) RETURNING *`,
            [req.user!.uid, post_data, field, visibility]
        );
        res.status(201).json(result.rows[0]);
    } catch {
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
