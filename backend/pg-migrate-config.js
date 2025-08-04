require('dotenv').config();
const isProd = process.env.NODE_ENV === 'production';

module.exports = {
    dir: isProd ? 'build/migrations' : 'src/migrations', // use compiled migrations in prod
    direction: 'up',
    databaseUrl: process.env.DATABASE_URL,
    migrationsTable: 'pgmigrations',
};
