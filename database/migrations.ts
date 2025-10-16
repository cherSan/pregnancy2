import * as SQLite from 'expo-sqlite';
import { File } from 'expo-file-system';
import { Asset } from 'expo-asset';

const sqlAssets = [
    Asset.fromModule(require('@/database/migrations/000-schema.sql')),
    Asset.fromModule(require('@/database/migrations/001-migration1.sql')),
    Asset.fromModule(require('@/database/migrations/002-migration2.sql')),
];

export async function runMigrations(db: SQLite.SQLiteDatabase): Promise<void> {
    try {
        console.log('📦 Начинаем выполнение миграций...');
        await Promise.all(sqlAssets.map(asset => asset.downloadAsync()));
        for (const asset of sqlAssets) {
            console.log(`🔧 Выполняем ${asset.name}...`);
            await executeSqlFile(db, asset.localUri!);
        }
        console.log('🎉 Все миграции выполнены успешно!');
    } catch (error) {
        console.error('💥 Ошибка выполнения миграций:', error);
        throw error;
    }
}

async function executeSqlFile(db: SQLite.SQLiteDatabase, fileUri: string): Promise<void> {
    try {
        const file = new File(fileUri);
        const sqlContent = await file.text()
        if (sqlContent) db.execSync(sqlContent);
    } catch (error) {
        console.error('❌ Ошибка выполнения SQL файла:', error);
        throw error;
    }
}