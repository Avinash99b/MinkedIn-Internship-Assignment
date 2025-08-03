import pool from '../config/db';

export async function seedTestUser() {
    await pool.query(`
    INSERT INTO users (uid, name, email, desired_field)
    VALUES ('test-user', 'Test User', 'test@example.com', 'software')
    ON CONFLICT (uid) DO NOTHING
  `);
}

afterAll(async () => {
    await pool.end();
});
