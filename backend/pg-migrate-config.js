require('dotenv').config();

const isProd = process.env.NODE_ENV === 'production';

module.exports = {
    migrationFolder: isProd ? 'dist/migrations' : 'src/migrations',
    dir: isProd ? 'dist/migrations' : 'src/migrations',
    direction: 'up',
    databaseUrl: isProd
        ? {
            connectionString: process.env.DATABASE_URL,
            ssl: { rejectUnauthorized: false }
        }
        : process.env.DATABASE_URL,
    migrationsTable: 'pgmigrations'
};
