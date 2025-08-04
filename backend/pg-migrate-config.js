require('dotenv').config();
const path = require('path');

const isProd = process.env.NODE_ENV === 'production';

module.exports = {
    migrationFolder: isProd ? 'dist/migrations' : 'src/migrations',
    dir: isProd ? 'dist/migrations' : 'src/migrations',
    direction: 'up',
    databaseUrl: process.env.DATABASE_URL,
    migrationsTable: 'pgmigrations'
};
