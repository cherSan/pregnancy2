// src/database/schemas/user.ts
import db from '../index';

export const initUserTable = async (): Promise<void> => {
    try {
        await db.execAsync(`
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                dob INTEGER NOT NULL,
                bloodGroup TEXT,
                createdAt INTEGER DEFAULT (strftime('%s', 'now') * 1000),
                updatedAt INTEGER DEFAULT (strftime('%s', 'now') * 1000),
                deletedAt INTEGER
            );
        `);
        console.log('✅ Users table ready');
    } catch (error) {
        console.log('❌ Error creating users table:', error);
    }
};