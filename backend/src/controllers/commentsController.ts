import { Request, Response } from 'express';
import pool from '../config/db';

export async function addComment(req: Request, res: Response) {
    const { post_id, comment_text } = req.body;
    try {
        const comment = await pool.query(
            `INSERT INTO comments (post_id, user_id, comment_text)
       VALUES ($1, $2, $3) RETURNING *`,
            [post_id, req.user!.uid, comment_text]
        );
        await pool.query(
            `UPDATE posts SET comments_count = comments_count + 1 WHERE id = $1`,
            [post_id]
        );
        res.status(201).json(comment.rows[0]);
    } catch {
        res.status(500).json({ error: 'Server error' });
    }
}
