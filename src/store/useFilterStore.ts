import { create } from 'zustand';
import type { Filter } from '../types';
import { db } from '../lib/db';
import { v4 as uuidv4 } from 'uuid';

interface FilterState {
    filters: Filter[];
    isLoading: boolean;
    error: string | null;
    fetchFilters: () => Promise<void>;
    addFilter: (name: string, query: string, color: string) => Promise<void>;
    updateFilter: (id: string, updates: Partial<Filter>) => Promise<void>;
    deleteFilter: (id: string) => Promise<void>;
}

export const useFilterStore = create<FilterState>((set) => ({
    filters: [],
    isLoading: false,
    error: null,

    fetchFilters: async () => {
        set({ isLoading: true });
        try {
            const filters = await db.filters.toArray();
            set({ filters, isLoading: false });
        } catch {
            set({ error: 'Failed to fetch filters', isLoading: false });
        }
    },

    addFilter: async (name, query, color) => {
        const newFilter: Filter = {
            id: uuidv4(),
            name,
            query,
            color,
            isFavorite: false,
        };

        try {
            await db.filters.add(newFilter);
            set((state) => ({ filters: [...state.filters, newFilter] }));
        } catch {
            set({ error: 'Failed to add filter' });
        }
    },

    updateFilter: async (id, updates) => {
        try {
            await db.filters.update(id, updates);
            set((state) => ({
                filters: state.filters.map((f) => (f.id === id ? { ...f, ...updates } : f)),
            }));
        } catch {
            set({ error: 'Failed to update filter' });
        }
    },

    deleteFilter: async (id) => {
        try {
            await db.filters.delete(id);
            set((state) => ({
                filters: state.filters.filter((f) => f.id !== id),
            }));
        } catch {
            set({ error: 'Failed to delete filter' });
        }
    },
}));

