import { Request, Response } from 'express';
import axios from 'axios';
import pool from '../config/db';
import dotenv from 'dotenv';
import { z } from 'zod';
import sanitizeHtml from 'sanitize-html';

dotenv.config();

const FIREBASE_API_KEY = process.env.FIREBASE_API_KEY; // Firebase API key from project settings

// Firebase REST API endpoints
const FIREBASE_SIGNUP_URL = `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${FIREBASE_API_KEY}`;
const FIREBASE_LOGIN_URL = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${FIREBASE_API_KEY}`;

/**
 * Zod Schemas for Validation
 */
const RegisterSchema = z.object({
    email: z.string().email().max(255),
    password: z.string().min(6).max(128),
    name: z.string().min(1).max(100),
    desired_field: z.string().min(1).max(100)
});

const LoginSchema = z.object({
    email: z.string().email().max(255),
    password: z.string().min(6).max(128)
});

/**
 * Utility: Sanitize plain text input
 */
function sanitizeInput(input: string): string {
    return sanitizeHtml(input, {
        allowedTags: [],
        allowedAttributes: {}
    }).trim();
}

/**
 * Register a new user
 */
export async function registerUser(req: Request, res: Response) {
    // Validate request body
    const parseResult = RegisterSchema.safeParse(req.body);
    if (!parseResult.success) {
        return res.status(400).json({ error: parseResult.error.flatten() });
    }

    const { email, password, name, desired_field } = parseResult.data;

    // Sanitize string fields
    const cleanName = sanitizeInput(name);
    const cleanField = sanitizeInput(desired_field);

    if (process.env.NODE_ENV === 'test') {
        // Skip Firebase in test mode
        const uid = 'test-user';
        await pool.query(
            `INSERT INTO users (uid, name, email, desired_field) VALUES ($1, $2, $3, $4)
             ON CONFLICT (uid) DO NOTHING`,
            [uid, cleanName, email, cleanField]
        );
        return res.status(201).json({ token: 'fake-token' });
    }

    try {
        // Create user in Firebase Auth
        const fbRes = await axios.post(FIREBASE_SIGNUP_URL, {
            email,
            password,
            returnSecureToken: true
        });

        const { idToken, localId: uid } = fbRes.data as any;

        // Store profile in PostgreSQL
        await pool.query(
            `INSERT INTO users (uid, name, email, desired_field) VALUES ($1, $2, $3, $4)`,
            [uid, cleanName, email, cleanField]
        );

        res.status(201).json({ token: idToken });
    } catch (err: any) {
        const errorMsg = err.response?.data?.error?.message || 'Registration failed';
        console.error('Register error:', err);
        res.status(400).json({ error: errorMsg });
    }
}

/**
 * Login an existing user
 */
export async function loginUser(req: Request, res: Response) {
    // Validate request body
    const parseResult = LoginSchema.safeParse(req.body);
    if (!parseResult.success) {
        return res.status(400).json({ error: parseResult.error.flatten() });
    }

    const { email, password } = parseResult.data;

    if (process.env.NODE_ENV === 'test') {
        return res.status(200).json({ token: 'fake-token' });
    }

    try {
        // Sign in user with Firebase REST API
        const fbRes = await axios.post(FIREBASE_LOGIN_URL, {
            email,
            password,
            returnSecureToken: true
        });

        const { idToken } = fbRes.data as any;

        res.status(200).json({ token: idToken });
    } catch (err: any) {
        console.error('Register error:', err);
        const errorMsg = err.response?.data?.error?.message || 'Login failed';
        res.status(400).json({ error: errorMsg });
    }
}
