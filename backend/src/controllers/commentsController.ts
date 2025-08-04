import { Request, Response } from 'express';
import pool from '../config/db';
import {CommentSchema} from "../validators/commentsSchema";
import {sanitizeMarkdownText} from "../validators/html-validator";

export async function addComment(req: Request, res: Response) {
    const parseResult = CommentSchema.safeParse(req.body);
    if (!parseResult.success) {
        return res.status(400).json({ error: parseResult.error.flatten() });
    }
    const { post_id, comment_text } = parseResult.data;
    const safeText = sanitizeMarkdownText(comment_text);

    try {
        const comment = await pool.query(
            `INSERT INTO comments (post_id, user_id, comment_text)
       VALUES ($1, $2, $3) RETURNING *`,
            [post_id, req.user!.uid, safeText]
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
