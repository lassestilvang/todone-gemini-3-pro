import Dexie, { type Table } from 'dexie';
import type { Task, Project, Section, Label, Filter } from '../types';

export class TodoneDB extends Dexie {
    tasks!: Table<Task>;
    projects!: Table<Project>;
    sections!: Table<Section>;
    labels!: Table<Label>;
    filters!: Table<Filter>;

    constructor() {
        super('TodoneDB');

        this.version(1).stores({
            tasks: 'id, projectId, sectionId, priority, isCompleted, dueDate, [projectId+isCompleted]',
            projects: 'id, isFavorite, parentId',
            sections: 'id, projectId',
            labels: 'id, isFavorite',
            filters: 'id, isFavorite'
        });
    }
}

export const db = new TodoneDB();
