import { create } from 'zustand';
import { database } from '@/database';
import { SQLiteDatabase } from "expo-sqlite";

interface DatabaseState {
    isInitialized: boolean;
    error: string | null;
    dataBase: SQLiteDatabase | null;
    initialize: () => Promise<void>;
}

export const useDatabaseStore = create<DatabaseState>((set, get) => ({
    isInitialized: false,
    error: null,
    dataBase: null,

    initialize: async () => {
        try {
            set({ error: null });
            const dataBase = await database.init();
            set({ dataBase });
            set({ isInitialized: true });
        } catch (err) {
            set({
                error: err instanceof Error ? err.message : 'Unknown error',
                isInitialized: false
            });
        }
    },
}));

export const useDB = () => useDatabaseStore(state => state.dataBase)