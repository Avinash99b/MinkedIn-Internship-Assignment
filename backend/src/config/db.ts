import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const isProd = process.env.NODE_ENV === 'production';

const pool = new Pool({
    min: 3,
    connectionString: process.env.DATABASE_URL,
    ssl: isProd ? { rejectUnauthorized: false } : false
});

pool.on('connect', () => {
    console.log('✅ Connected to PostgreSQL');
});

export default pool;
