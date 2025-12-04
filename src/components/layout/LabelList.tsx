import React from 'react';
import { Tag, X } from 'lucide-react';
import { useLabelStore } from '../../store/useLabelStore';
import { useUIStore } from '../../store/useUIStore';
import { cn } from '../../lib/utils';


export const LabelList = () => {
    const { labels, deleteLabel } = useLabelStore();
    const { activeContext, setActiveContext } = useUIStore();

    return (
        <div className="space-y-1">
            {labels.map((label) => {
                const isActive = activeContext.type === 'label' && activeContext.id === label.id;
                return (
                    <div
                        key={label.id}
                        onClick={() => setActiveContext({ type: 'label', id: label.id })}
                        className={cn(
                            "flex items-center justify-between px-2 py-1.5 rounded-md group cursor-pointer transition-colors",
                            isActive
                                ? "bg-white dark:bg-gray-800 shadow-sm"
                                : "hover:bg-gray-100 dark:hover:bg-gray-800"
                        )}
                    >
                        <div className="flex items-center gap-3">
                            <Tag size={16} color={label.color} className="fill-current opacity-20" />
                            <span className={cn(
                                "text-sm",
                                isActive ? "text-primary-600 dark:text-primary-400 font-medium" : "text-gray-700 dark:text-gray-300"
                            )}>{label.name}</span>
                        </div>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                deleteLabel(label.id);
                            }}
                            className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                            <X size={14} />
                        </button>
                    </div>
                );
            })}
        </div>
    );
};
