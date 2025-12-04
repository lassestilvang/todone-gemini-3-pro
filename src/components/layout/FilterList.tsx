import React from 'react';
import { Filter as FilterIcon, X, Pencil } from 'lucide-react';
import { useFilterStore } from '../../store/useFilterStore';
import { useUIStore } from '../../store/useUIStore';
import { cn } from '../../lib/utils';

export const FilterList = () => {
    const { filters, deleteFilter } = useFilterStore();
    const { activeContext, setActiveContext, openModal, setEditingItemId } = useUIStore();

    const handleEdit = (e: React.MouseEvent, filterId: string) => {
        e.stopPropagation();
        setEditingItemId(filterId);
        openModal('edit-filter');
    };

    return (
        <div className="space-y-1">
            {filters.map((filter) => {
                const isActive = activeContext.type === 'filter' && activeContext.id === filter.id;
                return (
                    <div
                        key={filter.id}
                        onClick={() => setActiveContext({ type: 'filter', id: filter.id })}
                        className={cn(
                            "flex items-center justify-between px-2 py-1.5 rounded-md group cursor-pointer transition-colors",
                            isActive
                                ? "bg-white dark:bg-gray-800 shadow-sm"
                                : "hover:bg-gray-100 dark:hover:bg-gray-800"
                        )}
                    >
                        <div className="flex items-center gap-3">
                            <FilterIcon size={16} color={filter.color} className="fill-current opacity-20" />
                            <span className={cn(
                                "text-sm",
                                isActive ? "text-primary-600 dark:text-primary-400 font-medium" : "text-gray-700 dark:text-gray-300"
                            )}>{filter.name}</span>
                        </div>
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                                onClick={(e) => handleEdit(e, filter.id)}
                                className="text-gray-400 hover:text-primary-500"
                            >
                                <Pencil size={14} />
                            </button>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    deleteFilter(filter.id);
                                }}
                                className="text-gray-400 hover:text-red-500"
                            >
                                <X size={14} />
                            </button>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};
