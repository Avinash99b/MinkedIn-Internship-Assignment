import { Request, Response } from 'express';
import pool from '../config/db';

export async function getMe(req: Request, res: Response) {
    try {
        const { uid } = req.user!;
        const result = await pool.query('SELECT * FROM users WHERE uid = $1', [uid]);
        res.json(result.rows[0]);
    } catch {
        res.status(500).json({ error: 'Server error' });
    }
}

export async function getUserById(req: Request, res: Response) {
    try {
        const { uid } = req.params;
        const result = await pool.query('SELECT * FROM users WHERE uid = $1', [uid]);
        if (!result.rows.length) return res.status(404).json({ error: 'User not found' });
        res.json(result.rows[0]);
    } catch {
        res.status(500).json({ error: 'Server error' });
    }
}
