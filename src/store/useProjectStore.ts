import { create } from 'zustand';
import type { Project } from '../types';
import { db } from '../lib/db';
import { v4 as uuidv4 } from 'uuid';

interface ProjectState {
    projects: Project[];
    isLoading: boolean;
    error: string | null;
    fetchProjects: () => Promise<void>;
    addProject: (project: Omit<Project, 'id' | 'order'>) => Promise<void>;
}

export const useProjectStore = create<ProjectState>((set) => ({
    projects: [],
    isLoading: false,
    error: null,

    fetchProjects: async () => {
        set({ isLoading: true });
        try {
            const projects = await db.projects.orderBy('order').toArray();
            set({ projects, isLoading: false });
        } catch (error) {
            set({ error: 'Failed to fetch projects', isLoading: false });
        }
    },

    addProject: async (projectData) => {
        const newProject: Project = {
            ...projectData,
            id: uuidv4(),
            order: 0, // TODO: Implement order logic
        };

        try {
            await db.projects.add(newProject);
            set((state) => ({ projects: [...state.projects, newProject] }));
        } catch (error) {
            set({ error: 'Failed to add project' });
        }
    },
}));
