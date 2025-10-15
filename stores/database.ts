import { create } from 'zustand';
import { database } from '@/database';

interface DatabaseState {
    isInitialized: boolean;
    error: string | null;
    initialize: () => Promise<void>;
}

export const useDatabaseStore = create<DatabaseState>((set, get) => ({
    isInitialized: false,
    error: null,

    initialize: async () => {
        try {
            set({ error: null });
            await database.init();
            set({ isInitialized: true });
        } catch (err) {
            set({
                error: err instanceof Error ? err.message : 'Unknown error',
                isInitialized: false
            });
        }
    },
}));