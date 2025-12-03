import { useEffect } from 'react';
import { db } from '../lib/db';
import type { Project } from '../types';

export const useSeedData = () => {
    useEffect(() => {
        const seed = async () => {
            const inboxExists = await db.projects.get('inbox');
            if (!inboxExists) {
                const inbox: Project = {
                    id: 'inbox',
                    name: 'Inbox',
                    color: '#3b82f6', // Blue
                    viewType: 'list',
                    isFavorite: false,
                    isShared: false,
                    order: 0,
                };
                await db.projects.add(inbox);
            }
        };
        seed();
    }, []);
};
