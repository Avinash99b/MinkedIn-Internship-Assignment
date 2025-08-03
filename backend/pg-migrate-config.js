require('dotenv').config();

module.exports = {
    migrationFolder: 'src/migrations',
    direction: 'up',
    databaseUrl: process.env.DATABASE_URL,
    dir: 'src/migrations',
    migrationsTable: 'pgmigrations',
};
