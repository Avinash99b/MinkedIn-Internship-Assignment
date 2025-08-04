import { MigrationBuilder } from 'node-pg-migrate/dist/bundle';

export async function up(pgm: MigrationBuilder): Promise<void> {
    // Create trigger function to auto-update updated_at
    pgm.createFunction(
        'set_updated_at',
        [],
        {
            returns: 'trigger',
            language: 'plpgsql',
            replace: true
        },
        `
        BEGIN
            NEW.updated_at = NOW();
            RETURN NEW;
        END;
        `
    );

    // Users table
    pgm.createTable('users', {
        uid: { type: 'text', primaryKey: true },
        name: { type: 'text', notNull: true },
        email: { type: 'text', notNull: true, unique: true },
        bio: { type: 'text', default: '' },
        desired_field: { type: 'text', notNull: true },
        profile_views: { type: 'integer', notNull: true, default: 0 },
        created_at: { type: 'timestamp', notNull: true, default: pgm.func('now()') },
        updated_at: { type: 'timestamp', notNull: true, default: pgm.func('now()') }
    });

    pgm.createTrigger('users', 'set_updated_at', {
        when: 'BEFORE',
        operation: ['UPDATE'],
        function: 'set_updated_at',
        level: 'ROW'
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

    pgm.createTrigger('posts', 'set_updated_at', {
        when: 'BEFORE',
        operation: ['UPDATE'],
        function: 'set_updated_at',
        level: 'ROW'
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

    pgm.createTrigger('comments', 'set_updated_at', {
        when: 'BEFORE',
        operation: ['UPDATE'],
        function: 'set_updated_at',
        level: 'ROW'
    });
}

export async function down(pgm: MigrationBuilder): Promise<void> {
    pgm.dropTrigger('comments', 'set_updated_at');
    pgm.dropTrigger('posts', 'set_updated_at');
    pgm.dropTrigger('users', 'set_updated_at');
    pgm.dropFunction('set_updated_at', []); // ✅ must include argument list
    pgm.dropTable('comments');
    pgm.dropTable('posts');
    pgm.dropTable('users');
}
