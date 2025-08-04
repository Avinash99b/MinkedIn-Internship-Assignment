import { Request, Response } from 'express';
import pool from '../config/db';

/**
 * GET /users/me
 * Returns the current user's full profile
 */
export async function getMe(req: Request, res: Response) {
    try {
        const { uid } = req.user!;
        const result = await pool.query(
            `SELECT uid, name, email, bio, desired_field, profile_views, created_at, updated_at
             FROM users
             WHERE uid = $1`,
            [uid]
        );
        if (!result.rows.length) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error('getMe error:', err);
        res.status(500).json({ error: 'Server error' });
    }
}

/**
 * GET /users/{uid}
 * Returns a user's full profile
 */
export async function getUserById(req: Request, res: Response) {
    try {
        const { uid } = req.params;
        const result = await pool.query(
            `SELECT uid, name, email, bio, desired_field, profile_views, created_at, updated_at
             FROM users
             WHERE uid = $1`,
            [uid]
        );
        if (!result.rows.length) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error('getUserById error:', err);
        res.status(500).json({ error: 'Server error' });
    }
}

/**
 * POST /users/{uid}/view
 * Increments profile view count for the given user
 */
export async function incrementProfileViews(req: Request, res: Response) {
    try {
        const { uid } = req.params;
        const viewerUid = req.user!.uid;

        if (uid === viewerUid) {
            return res.status(400).json({ error: 'Cannot increment your own profile views' });
        }

        const result = await pool.query(
            `UPDATE users
             SET profile_views = profile_views + 1
             WHERE uid = $1
             RETURNING profile_views`,
            [uid]
        );

        if (!result.rows.length) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json({ profile_views: result.rows[0].profile_views });
    } catch (err) {
        console.error('incrementProfileViews error:', err);
        res.status(500).json({ error: 'Server error' });
    }
}

/**
 * PATCH /users/me/bio
 * Updates the authenticated user's bio
 */
export async function updateMyBio(req: Request, res: Response) {
    try {
        const { bio } = req.body;
        const { uid } = req.user!;

        if (typeof bio !== 'string' || !bio.trim()) {
            return res.status(400).json({ error: 'Bio must be a non-empty string' });
        }

        const result = await pool.query(
            `UPDATE users
             SET bio = $1
             WHERE uid = $2
             RETURNING uid, name, email, bio, desired_field, profile_views, created_at, updated_at`,
            [bio.trim(), uid]
        );

        if (!result.rows.length) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json(result.rows[0]);
    } catch (err) {
        console.error('updateMyBio error:', err);
        res.status(500).json({ error: 'Server error' });
    }
}
