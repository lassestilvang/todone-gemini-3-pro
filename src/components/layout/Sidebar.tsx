import React from 'react';
import { Inbox, Calendar, CalendarDays, Hash, Plus } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useProjectStore } from '../../store/useProjectStore';

export const Sidebar = () => {
    const { projects } = useProjectStore();

    return (
        <aside className="w-64 bg-gray-50 border-r border-gray-200 h-screen flex flex-col pt-8 pb-4 px-4">
            <div className="mb-6 px-2">
                <h1 className="text-2xl font-bold text-primary-600 flex items-center gap-2">
                    <span className="bg-primary-500 text-white rounded-md p-1 text-sm">✓</span>
                    Todone
                </h1>
            </div>

            <nav className="space-y-1 mb-8">
                <SidebarItem icon={<Inbox size={20} />} label="Inbox" count={4} active />
                <SidebarItem icon={<Calendar size={20} />} label="Today" count={2} />
                <SidebarItem icon={<CalendarDays size={20} />} label="Upcoming" />
            </nav>

            <div className="flex items-center justify-between px-2 mb-2">
                <h3 className="text-sm font-semibold text-gray-500">Projects</h3>
                <button className="text-gray-400 hover:text-primary-500 transition-colors">
                    <Plus size={16} />
                </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-1">
                {projects.map((project) => (
                    <SidebarItem
                        key={project.id}
                        icon={<Hash size={18} color={project.color} />}
                        label={project.name}
                    />
                ))}
            </div>

            <div className="pt-4 border-t border-gray-200 mt-auto">
                <div className="flex items-center gap-3 px-2 py-2 hover:bg-gray-100 rounded-md cursor-pointer transition-colors">
                    <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-medium">
                        JD
                    </div>
                    <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">John Doe</p>
                        <p className="text-xs text-gray-500">0/5 tasks</p>
                    </div>
                </div>
            </div>
        </aside>
    );
};

interface SidebarItemProps {
    icon: React.ReactNode;
    label: string;
    count?: number;
    active?: boolean;
}

const SidebarItem = ({ icon, label, count, active }: SidebarItemProps) => {
    return (
        <div
            className={cn(
                "flex items-center justify-between px-2 py-2 rounded-md cursor-pointer transition-colors group",
                active ? "bg-primary-50 text-primary-700" : "hover:bg-gray-100 text-gray-700"
            )}
        >
            <div className="flex items-center gap-3">
                <span className={cn(active ? "text-primary-600" : "text-gray-500 group-hover:text-gray-700")}>
                    {icon}
                </span>
                <span className="text-sm font-medium">{label}</span>
            </div>
            {count !== undefined && (
                <span className="text-xs text-gray-400 font-medium">{count}</span>
            )}
        </div>
    );
};
