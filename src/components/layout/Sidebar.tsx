import React, { useMemo } from 'react';
import { CheckSquare, Calendar, CalendarDays, Inbox, Hash, Plus, WifiOff, Pencil } from 'lucide-react';
import { useProjectStore } from '../../store/useProjectStore';
import { useTaskStore } from '../../store/useTaskStore';
import { useUIStore } from '../../store/useUIStore';
import { isToday, parseISO, isFuture } from 'date-fns';

import { cn } from '../../lib/utils';
import { LabelList } from './LabelList';
import { FilterList } from './FilterList';
import { useOnlineStatus } from '../../hooks/useOnlineStatus';
import { KarmaStats } from '../gamification/KarmaStats';

export const Sidebar = () => {
    const { projects } = useProjectStore();
    const { tasks } = useTaskStore();
    const { openModal, activeContext, setActiveContext, setEditingItemId } = useUIStore();

    const isOnline = useOnlineStatus();

    // Compute counts for incomplete tasks
    const counts = useMemo(() => {
        const incompleteTasks = tasks.filter(t => !t.isCompleted && !t.parentId);

        const inboxCount = incompleteTasks.filter(t => t.projectId === 'inbox').length;
        const todayCount = incompleteTasks.filter(t => t.dueDate && isToday(parseISO(t.dueDate))).length;
        const upcomingCount = incompleteTasks.filter(t => t.dueDate && isFuture(parseISO(t.dueDate)) && !isToday(parseISO(t.dueDate))).length;

        const projectCounts: Record<string, number> = {};
        projects.forEach(p => {
            projectCounts[p.id] = incompleteTasks.filter(t => t.projectId === p.id).length;
        });

        return { inboxCount, todayCount, upcomingCount, projectCounts };
    }, [tasks, projects]);

    const handleEditProject = (e: React.MouseEvent, projectId: string) => {
        e.stopPropagation();
        setEditingItemId(projectId);
        openModal('edit-project');
    };

    return (
        <div className="w-64 bg-gray-50 dark:bg-gray-950 border-r border-gray-200 dark:border-gray-800 h-screen flex flex-col">
            <div className="p-4">
                <div className="flex items-center gap-2 mb-6">
                    <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center text-white font-bold">
                        <CheckSquare size={20} />
                    </div>
                    <span className="text-xl font-bold text-gray-900 dark:text-white">Todone</span>
                </div>

                {!isOnline && (
                    <div className="mb-4 p-2 bg-yellow-50 border border-yellow-200 rounded-md flex items-center gap-2 text-xs text-yellow-700">
                        <WifiOff size={14} />
                        <span>You are offline</span>
                    </div>
                )}

                <nav className="space-y-1">
                    <SidebarItem
                        icon={<Inbox size={20} />}
                        label="Inbox"
                        count={counts.inboxCount}
                        active={activeContext.type === 'inbox'}
                        onClick={() => setActiveContext({ type: 'inbox' })}
                    />
                    <SidebarItem
                        icon={<Calendar size={20} />}
                        label="Today"
                        count={counts.todayCount}
                        active={activeContext.type === 'today'}
                        onClick={() => setActiveContext({ type: 'today' })}
                    />
                    <SidebarItem
                        icon={<CalendarDays size={20} />}
                        label="Upcoming"
                        count={counts.upcomingCount}
                        active={activeContext.type === 'upcoming'}
                        onClick={() => setActiveContext({ type: 'upcoming' })}
                    />
                </nav>
            </div>

            <div className="flex items-center justify-between px-4 mb-2">
                <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400">Projects</h3>
                <button
                    onClick={() => openModal('project')}
                    className="text-gray-400 hover:text-primary-500 transition-colors"
                    title="Add Project"
                >
                    <Plus size={16} />
                </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-1 px-2">
                {projects.filter(p => p.id !== 'inbox').map((project) => {
                    const projectCount = counts.projectCounts[project.id] || 0;
                    return (
                        <div
                            key={project.id}
                            onClick={() => setActiveContext({ type: 'project', id: project.id })}
                            className={cn(
                                "flex items-center justify-between px-2 py-1.5 rounded-md group cursor-pointer transition-colors",
                                activeContext.type === 'project' && activeContext.id === project.id
                                    ? "bg-white dark:bg-gray-800 shadow-sm"
                                    : "hover:bg-gray-100 dark:hover:bg-gray-800"
                            )}
                        >
                            <div className="flex items-center gap-3">
                                <Hash size={18} style={{ color: project.color }} />
                                <span className={cn(
                                    "text-sm",
                                    activeContext.type === 'project' && activeContext.id === project.id
                                        ? "text-primary-600 dark:text-primary-400 font-medium"
                                        : "text-gray-700 dark:text-gray-300"
                                )}>{project.name}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                {projectCount > 0 && (
                                    <span className={cn(
                                        "text-xs",
                                        activeContext.type === 'project' && activeContext.id === project.id
                                            ? "text-primary-500"
                                            : "text-gray-400"
                                    )}>{projectCount}</span>
                                )}
                                <button
                                    onClick={(e) => handleEditProject(e, project.id)}
                                    className="text-gray-400 hover:text-primary-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <Pencil size={14} />
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="flex items-center justify-between px-4 mb-2 mt-4">
                <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400">Labels</h3>
                <button
                    onClick={() => openModal('label')}
                    className="text-gray-400 hover:text-primary-500 transition-colors"
                    title="Add Label"
                >
                    <Plus size={16} />
                </button>
            </div>
            <div className="px-2 mb-4">
                <LabelList />
            </div>

            <div className="flex items-center justify-between px-4 mb-2">
                <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400">Filters</h3>
                <button
                    onClick={() => openModal('filter')}
                    className="text-gray-400 hover:text-primary-500 transition-colors"
                    title="Add Filter"
                >
                    <Plus size={16} />
                </button>
            </div>
            <div className="px-2 mb-4">
                <FilterList />
            </div>

            <div className="mt-auto p-4 border-t border-gray-200 dark:border-gray-800">
                <KarmaStats />
            </div>
        </div>
    );
};

interface SidebarItemProps {
    icon: React.ReactNode;
    label: string;
    count?: number;
    active?: boolean;
    color?: string;
    onClick?: () => void;
}

const SidebarItem = ({ icon, label, count, active, color, onClick }: SidebarItemProps) => {
    return (
        <button
            onClick={onClick}
            className={cn(
                "w-full flex items-center justify-between px-3 py-2 rounded-md text-sm font-medium transition-colors",
                active
                    ? "bg-white dark:bg-gray-800 text-primary-600 dark:text-primary-400 shadow-sm"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white"
            )}
        >
            <div className="flex items-center gap-3">
                <span className={cn("text-gray-400 dark:text-gray-500", active && "text-primary-500")} style={{ color: color }}>
                    {icon}
                </span>
                <span>{label}</span>
            </div>
            {count !== undefined && count > 0 && (
                <span className={cn("text-xs", active ? "text-primary-500" : "text-gray-400")}>
                    {count}
                </span>
            )}
        </button>
    );
};
