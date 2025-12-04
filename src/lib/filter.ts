import type { Task, Label, Project } from '../types';
import { isToday, isTomorrow, isPast, parseISO } from 'date-fns';

export const filterTasks = (tasks: Task[], query: string, labels: Label[], projects: Project[]): Task[] => {
    if (!query.trim()) return tasks;

    const terms = query.toLowerCase().split(' ');

    return tasks.filter(task => {
        return terms.every(term => {
            // Priority
            if (term === 'p1') return task.priority === 1;
            if (term === 'p2') return task.priority === 2;
            if (term === 'p3') return task.priority === 3;
            if (term === 'p4') return task.priority === 4;

            // Date
            if (term === 'today') return task.dueDate && isToday(parseISO(task.dueDate));
            if (term === 'tomorrow') return task.dueDate && isTomorrow(parseISO(task.dueDate));
            if (term === 'overdue') return task.dueDate && isPast(parseISO(task.dueDate)) && !isToday(parseISO(task.dueDate));
            if (term === 'no date') return !task.dueDate;

            // Labels (@label)
            if (term.startsWith('@')) {
                const labelName = term.slice(1);
                const label = labels.find(l => l.name.toLowerCase() === labelName);
                return label && task.labels.includes(label.id);
            }

            // Projects (#project)
            if (term.startsWith('#')) {
                const projectName = term.slice(1);
                if (projectName === 'inbox') {
                    return task.projectId === 'inbox';
                }
                const project = projects.find(p => p.name.toLowerCase() === projectName);
                return project && task.projectId === project.id;
            }

            // Search content
            if (term.startsWith('search:')) {
                const search = term.slice(7);
                return task.content.toLowerCase().includes(search);
            }

            // Default: search content
            return task.content.toLowerCase().includes(term);
        });
    });
};
