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

export async function getCommentsForPost(req: Request, res: Response) {
    try {
        const postId = parseInt(req.params.post_id, 10);
        const result = await pool.query(
            `SELECT * FROM comments WHERE post_id = $1 ORDER BY created_at ASC`,
            [postId]
        );

        // Always return 200, even if empty
        return res.status(200).json(result.rows);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Server error' });
    }
}
