import { create } from 'zustand';
import type { Label } from '../types';
import { db } from '../lib/db';
import { v4 as uuidv4 } from 'uuid';

interface LabelState {
    labels: Label[];
    isLoading: boolean;
    error: string | null;
    fetchLabels: () => Promise<void>;
    addLabel: (name: string, color: string) => Promise<void>;
    updateLabel: (id: string, updates: Partial<Label>) => Promise<void>;
    deleteLabel: (id: string) => Promise<void>;
}

export const useLabelStore = create<LabelState>((set) => ({
    labels: [],
    isLoading: false,
    error: null,

    fetchLabels: async () => {
        set({ isLoading: true });
        try {
            const labels = await db.labels.toArray();
            set({ labels, isLoading: false });
        } catch {
            set({ error: 'Failed to fetch labels', isLoading: false });
        }
    },

    addLabel: async (name, color) => {
        const newLabel: Label = {
            id: uuidv4(),
            name,
            color,
            isFavorite: false,
        };

        try {
            await db.labels.add(newLabel);
            set((state) => ({ labels: [...state.labels, newLabel] }));
        } catch {
            set({ error: 'Failed to add label' });
        }
    },

    updateLabel: async (id, updates) => {
        try {
            await db.labels.update(id, updates);
            set((state) => ({
                labels: state.labels.map((l) => (l.id === id ? { ...l, ...updates } : l)),
            }));
        } catch {
            set({ error: 'Failed to update label' });
        }
    },

    deleteLabel: async (id) => {
        try {
            await db.labels.delete(id);
            set((state) => ({
                labels: state.labels.filter((l) => l.id !== id),
            }));
        } catch {
            set({ error: 'Failed to delete label' });
        }
    },
}));

