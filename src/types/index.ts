export type Priority = 1 | 2 | 3 | 4;

export interface User {
    id: string;
    email: string;
    name: string;
    avatar?: string;
    settings: UserSettings;
    karma: KarmaStats;
}

export interface UserSettings {
    theme: 'light' | 'dark' | 'system';
    startOfWeek: 'monday' | 'sunday';
    timeFormat: '12h' | '24h';
    defaultView: 'inbox' | 'today' | 'upcoming';
}

export interface KarmaStats {
    level: string;
    points: number;
    dailyGoal: number;
    weeklyGoal: number;
    currentStreak: number;
    longestStreak: number;
}

export interface Project {
    id: string;
    name: string;
    color: string;
    viewType: 'list' | 'board' | 'calendar';
    isFavorite: boolean;
    isShared: boolean;
    parentId?: string;
    order: number;
}

export interface Section {
    id: string;
    name: string;
    projectId: string;
    order: number;
}

export interface Task {
    id: string;
    content: string;
    description?: string;
    projectId: string;
    sectionId?: string;
    priority: Priority;
    labels: string[]; // Label IDs
    dueDate?: string; // ISO date string
    dueTime?: string; // HH:mm
    duration?: number; // in minutes
    isRecurring: boolean;
    recurringPattern?: string;
    assigneeId?: string;
    parentId?: string;
    order: number;
    isCompleted: boolean;
    completedAt?: string; // ISO date string
    createdAt: string; // ISO date string
}

export interface Label {
    id: string;
    name: string;
    color: string;
    isFavorite: boolean;
}

export interface Filter {
    id: string;
    name: string;
    query: string;
    color: string;
    isFavorite: boolean;
}

export interface Comment {
    id: string;
    taskId: string;
    userId: string;
    content: string;
    createdAt: string;
    attachments?: Attachment[];
}

export interface Attachment {
    id: string;
    fileName: string;
    url: string;
    type: string;
    size: number;
}
