import * as SQLite from 'expo-sqlite';

const schemaSql = require('./schema.sql');
const migration1Sql = require('./migration1.sql');
const migration2Sql = require('./migration2.sql');

export async function runMigrations(db: SQLite.SQLiteDatabase): Promise<void> {
    try {
        console.log('📦 Начинаем выполнение миграций...');

        // Выполняем основной schema.sql
        console.log('🔧 Выполняем основную схему...');
        await executeSqlFile(db, schemaSql);

        // Выполняем миграции по порядку
        console.log('🔧 Выполняем миграцию 1...');
        await executeSqlFile(db, migration1Sql);

        console.log('🔧 Выполняем миграцию 2...');
        await executeSqlFile(db, migration2Sql);

        console.log('🎉 Все миграции выполнены успешно!');
    } catch (error) {
        console.error('💥 Ошибка выполнения миграций:', error);
        throw error;
    }
}

async function executeSqlFile(db: SQLite.SQLiteDatabase, sqlContent: string): Promise<void> {
    // Разделяем SQL на отдельные команды
    const commands = sqlContent
        .split(';')
        .map(cmd => cmd.trim())
        .filter(cmd => cmd.length > 0 && !cmd.startsWith('--'));

    // Выполняем каждую команду последовательно
    for (const command of commands) {
        try {
            await db.execAsync(command + ';');
        } catch (error) {
            console.error(`❌ Ошибка выполнения команды: ${command.substring(0, 100)}...`);
            console.error('Полная ошибка:', error);
            throw error;
        }
    }
}