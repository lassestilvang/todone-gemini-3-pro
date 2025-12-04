import React from 'react';
import { CheckSquare, Calendar, CalendarDays, Inbox, Hash, Plus, WifiOff } from 'lucide-react';
import { useProjectStore } from '../../store/useProjectStore';
import { useUIStore } from '../../store/useUIStore';

import { cn } from '../../lib/utils';
import { LabelList } from './LabelList';
import { FilterList } from './FilterList';
import { useOnlineStatus } from '../../hooks/useOnlineStatus';
import { KarmaStats } from '../gamification/KarmaStats';

export const Sidebar = () => {
    const { projects } = useProjectStore();
    const { openModal, activeContext, setActiveContext } = useUIStore();

    const isOnline = useOnlineStatus();

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
                        count={4}
                        active={activeContext.type === 'inbox'}
                        onClick={() => setActiveContext({ type: 'inbox' })}
                    />
                    <SidebarItem
                        icon={<Calendar size={20} />}
                        label="Today"
                        count={2}
                        active={activeContext.type === 'today'}
                        onClick={() => setActiveContext({ type: 'today' })}
                    />
                    <SidebarItem
                        icon={<CalendarDays size={20} />}
                        label="Upcoming"
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

            <div className="flex-1 overflow-y-auto space-y-1">
                {projects.map((project) => (
                    <SidebarItem
                        key={project.id}
                        icon={<Hash size={18} />}
                        label={project.name}
                        color={project.color}
                        active={activeContext.type === 'project' && activeContext.id === project.id}
                        onClick={() => setActiveContext({ type: 'project', id: project.id })}
                    />
                ))}
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
            {count !== undefined && (
                <span className={cn("text-xs", active ? "text-primary-500" : "text-gray-400")}>
                    {count}
                </span>
            )}
        </button>
    );
};
