import { Pool } from 'pg';
import dotenv from 'dotenv';
dotenv.config();

const isProd = process.env.NODE_ENV === 'production';

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: isProd
        ? { rejectUnauthorized: false } // hosted DBs need SSL
        : false // local DB doesn’t
});

pool.on('connect', () => {
    console.log('✅ Connected to PostgreSQL');
});

export default pool;
