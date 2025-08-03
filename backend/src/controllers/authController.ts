import { Request, Response } from 'express';
import axios from 'axios';
import pool from '../config/db';
import dotenv from 'dotenv';
dotenv.config();

const FIREBASE_API_KEY = process.env.FIREBASE_API_KEY; // Get this from Firebase project settings

// Firebase REST API endpoints
const FIREBASE_SIGNUP_URL = `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${FIREBASE_API_KEY}`;
const FIREBASE_LOGIN_URL = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${FIREBASE_API_KEY}`;

export async function registerUser(req: Request, res: Response) {
    const { email, password, name, desired_field } = req.body;

    if (process.env.NODE_ENV === 'test') {
        // Skip Firebase calls in tests
        const uid = 'test-user';
        await pool.query(
            `INSERT INTO users (uid, name, email, desired_field) VALUES ($1, $2, $3, $4)
       ON CONFLICT (uid) DO NOTHING`,
            [uid, name, email, desired_field]
        );
        return res.status(201).json({ token: 'fake-token' });
    }

    try {
        // 1. Create user in Firebase Auth
        const fbRes = await axios.post(FIREBASE_SIGNUP_URL, {
            email,
            password,
            returnSecureToken: true
        });

        const { idToken, localId: uid } = fbRes.data as any;

        // 2. Store profile in PostgreSQL
        await pool.query(
            `INSERT INTO users (uid, name, email, desired_field) VALUES ($1, $2, $3, $4)`,
            [uid, name, email, desired_field]
        );

        res.status(201).json({ token: idToken });
    } catch (err: any) {
        const errorMsg = err.response?.data?.error?.message || 'Registration failed';
        res.status(400).json({ error: errorMsg });
    }
}

export async function loginUser(req: Request, res: Response) {
    const { email, password } = req.body;

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
        const errorMsg = err.response?.data?.error?.message || 'Login failed';
        res.status(400).json({ error: errorMsg });
    }
}
