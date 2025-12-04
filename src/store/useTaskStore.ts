import { create } from 'zustand';

import { v4 as uuidv4 } from 'uuid';
import { db } from '../lib/db';
import type { Task } from '../types';
import { calculateNextDueDate } from '../lib/recurrence';

interface TaskState {
    tasks: Task[];
    isLoading: boolean;
    error: string | null;
    fetchTasks: () => Promise<void>;
    addTask: (task: Omit<Task, 'id' | 'createdAt' | 'isCompleted' | 'order'>) => Promise<void>;
    toggleTask: (id: string) => Promise<void>;
    deleteTask: (id: string) => Promise<void>;
    reorderTasks: (activeId: string, overId: string) => Promise<void>;
    updateTask: (id: string, updates: Partial<Task>) => Promise<void>;
}

export const useTaskStore = create<TaskState>((set, get) => ({
    tasks: [],
    isLoading: false,
    error: null,

    fetchTasks: async () => {
        set({ isLoading: true });
        try {
            const tasks = await db.tasks.toArray();
            set({ tasks, isLoading: false });
        } catch {
            set({ error: 'Failed to fetch tasks', isLoading: false });
        }
    },

    addTask: async (taskData) => {
        const newTask: Task = {
            ...taskData,
            id: uuidv4(),
            createdAt: new Date().toISOString(),
            isCompleted: false,
            order: 0, // TODO: Implement proper ordering logic
            labels: taskData.labels || [],
        };

        try {
            await db.tasks.add(newTask);
            set((state) => ({ tasks: [...state.tasks, newTask] }));
        } catch {
            set({ error: 'Failed to add task' });
        }
    },

    toggleTask: async (id) => {
        const state = get();
        const task = state.tasks.find((t) => t.id === id);
        if (!task) return;

        const newIsCompleted = !task.isCompleted;
        const now = new Date().toISOString();

        // Optimistic update for the clicked task
        let updatedTasks = state.tasks.map((t) =>
            t.id === id
                ? { ...t, isCompleted: newIsCompleted, completedAt: newIsCompleted ? now : undefined }
                : t
        );

        try {
            // Handle Recurrence
            if (newIsCompleted && task.isRecurring && task.recurringPattern && task.dueDate) {
                const nextDueDate = calculateNextDueDate(task.dueDate, task.recurringPattern);

                const nextTask: Task = {
                    ...task,
                    id: uuidv4(),
                    isCompleted: false,
                    completedAt: undefined,
                    dueDate: nextDueDate,
                    createdAt: now,
                    // Ensure we don't copy over subtasks' parentId if we were to duplicate subtasks (which we aren't yet)
                    // But for the main task, we keep it clean.
                };

                updatedTasks = [...updatedTasks, nextTask];

                // Persist next task
                await db.tasks.add(nextTask);
            }

            set({ tasks: updatedTasks });

            await db.tasks.update(id, {
                isCompleted: newIsCompleted,
                completedAt: newIsCompleted ? now : undefined,
            });
        } catch {
            set({ error: 'Failed to toggle task' });
            // Revert UI if persistence fails
            await get().fetchTasks();
        }
    },

    deleteTask: async (id) => {
        try {
            // Optimistically update UI
            set((state) => ({
                tasks: state.tasks.filter((t) => t.id !== id),
            }));
            await db.tasks.delete(id);
        } catch {
            set({ error: 'Failed to delete task' });
            // Revert UI if deletion fails (optional, but good practice)
            // await get().fetchTasks();
        }
    },

    reorderTasks: async (activeId, overId) => {
        const state = get();
        const oldIndex = state.tasks.findIndex((t) => t.id === activeId);
        const newIndex = state.tasks.findIndex((t) => t.id === overId);

        if (oldIndex === -1 || newIndex === -1) return;

        const newTasks = [...state.tasks];
        const [movedTask] = newTasks.splice(oldIndex, 1);
        newTasks.splice(newIndex, 0, movedTask);

        // Update order field for all affected tasks (naive implementation)
        // In a real app, we'd use a more efficient ranking system (e.g., Lexorank)
        const updates = newTasks.map((t, index) => ({ ...t, order: index }));

        set({ tasks: updates });

        // Persist changes
        try {
            await db.transaction('rw', db.tasks, async () => {
                await Promise.all(updates.map(t => db.tasks.update(t.id, { order: t.order })));
            });
        } catch {
            set({ error: 'Failed to reorder tasks' });
            // Revert UI if persistence fails
            await get().fetchTasks();
        }
    },

    updateTask: async (id, updates) => {
        try {
            await db.tasks.update(id, updates);
            set((state) => ({
                tasks: state.tasks.map((t) => (t.id === id ? { ...t, ...updates } : t)),
            }));
        } catch {
            set({ error: 'Failed to update task' });
        }
    },
}));
