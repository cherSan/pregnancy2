import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabaseSync('pregnancy.db');

export default db;