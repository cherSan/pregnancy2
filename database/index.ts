import * as SQLite from 'expo-sqlite';
import { runMigrations } from './migrations';

class Database {
    private db: SQLite.SQLiteDatabase | null = null;
    private isInitialized = false;

    async init(): Promise<void> {
        if (this.isInitialized) return;
        try {
            this.db = await SQLite.openDatabaseAsync('maternity.db');
            const needsMigration = await this.checkNeedsMigration();
            if (needsMigration) {
                console.log('🚀 Выполняем миграции базы данных...');
                await runMigrations(this.db);
                await this.markMigrationComplete();
                console.log('✅ Миграции завершены');
            } else {
                console.log('✅ База данных уже инициализирована');
            }

            this.isInitialized = true;
        } catch (error) {
            console.error('❌ Ошибка инициализации БД:', error);
            throw error;
        }
    }

    private async checkNeedsMigration(): Promise<boolean> {
        try {
            const result = await this.db?.getFirstAsync<{ count: number }>(
                "SELECT COUNT(*) as count FROM sqlite_master WHERE type='table' AND name='migrations'"
            );
            return !result || result.count === 0;
        } catch {
            return true;
        }
    }

    private async markMigrationComplete(): Promise<void> {
        await this.db?.execAsync(`
          CREATE TABLE IF NOT EXISTS migrations (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            applied_at INTEGER DEFAULT (strftime('%s', 'now') * 1000)
          );
          
          INSERT INTO migrations (name) VALUES ('initial_setup');
        `);
    }

    async executeSql(sql: string, params: any[] = []): Promise<SQLite.SQLiteRunResult> {
        if (!this.db) throw new Error('Database not initialized');
        return await this.db.runAsync(sql, params);
    }

    async query<T = any>(sql: string, params: any[] = []): Promise<T[]> {
        if (!this.db) throw new Error('Database not initialized');
        const result = await this.db.getAllAsync(sql, params);
        return result as T[];
    }

    async getFirst<T = any>(sql: string, params: any[] = []): Promise<T | null> {
        const result = await this.query<T>(sql, params);
        return result[0] || null;
    }
}

export const database = new Database();