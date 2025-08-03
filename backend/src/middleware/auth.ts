import { Request, Response, NextFunction } from 'express';
import admin from '../config/firebase';

export async function verifyToken(req: Request, res: Response, next: NextFunction) {
    if (process.env.NODE_ENV === 'test') {
        req.user = { uid: 'test-user', email: 'test@example.com' };
        return next();
    }

    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decodedToken = await admin.auth().verifyIdToken(token);
        req.user = decodedToken;
        next();
    } catch {
        return res.status(401).json({ error: 'Invalid token' });
    }
}
