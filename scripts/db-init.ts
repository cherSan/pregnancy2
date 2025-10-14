import { initAllTables } from '@/database/schemas/init';

const initializeDatabase = async () => {
    try {
        console.log('🔄 Starting database initialization...');
        await initAllTables();
        console.log('✅ Database initialized successfully!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Database initialization failed:', error);
        process.exit(1);
    }
};

initializeDatabase();