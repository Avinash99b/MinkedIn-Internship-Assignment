import { MigrationBuilder } from 'node-pg-migrate/dist/bundle';

export async function up(pgm: MigrationBuilder): Promise<void> {
    // Users table
    pgm.createTable('users', {
        uid: { type: 'text', primaryKey: true },
        name: { type: 'text', notNull: true },
        email: { type: 'text', notNull: true, unique: true },
        bio: { type: 'text', default: '' },
        desired_field: { type: 'text', notNull: true }
    });

    // Posts table
    pgm.createTable('posts', {
        id: 'id',
        user_id: { type: 'text', notNull: true, references: 'users', onDelete: 'CASCADE' },
        post_data: { type: 'jsonb', notNull: true },
        field: { type: 'text', notNull: true },
        visibility: { type: 'text', notNull: true, check: "visibility IN ('public', 'private')" },
        created_at: { type: 'timestamp', notNull: true, default: pgm.func('now()') },
        updated_at: { type: 'timestamp', notNull: true, default: pgm.func('now()') },
        likes_count: { type: 'integer', notNull: true, default: 0 },
        comments_count: { type: 'integer', notNull: true, default: 0 }
    });

    // Comments table
    pgm.createTable('comments', {
        id: 'id',
        post_id: { type: 'integer', notNull: true, references: 'posts', onDelete: 'CASCADE' },
        user_id: { type: 'text', notNull: true, references: 'users', onDelete: 'CASCADE' },
        comment_text: { type: 'text', notNull: true },
        created_at: { type: 'timestamp', notNull: true, default: pgm.func('now()') },
        updated_at: { type: 'timestamp', notNull: true, default: pgm.func('now()') }
    });
}

export async function down(pgm: MigrationBuilder): Promise<void> {
    pgm.dropTable('comments');
    pgm.dropTable('posts');
    pgm.dropTable('users');
}
