import React, { useState } from 'react';
import { Tag, Plus, X } from 'lucide-react';
import { useLabelStore } from '../../store/useLabelStore';


export const LabelList = () => {
    const { labels, addLabel, deleteLabel } = useLabelStore();
    const [isAdding, setIsAdding] = useState(false);
    const [newLabelName, setNewLabelName] = useState('');

    const handleAddLabel = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newLabelName.trim()) return;

        // Random color for now
        const colors = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6', '#a855f7', '#ec4899'];
        const randomColor = colors[Math.floor(Math.random() * colors.length)];

        await addLabel(newLabelName, randomColor);
        setNewLabelName('');
        setIsAdding(false);
    };

    return (
        <div className="mt-6">
            <div className="flex items-center justify-between px-2 mb-2 group">
                <h3 className="text-sm font-semibold text-gray-500">Labels</h3>
                <button
                    onClick={() => setIsAdding(true)}
                    className="text-gray-400 hover:text-primary-500 transition-colors opacity-0 group-hover:opacity-100"
                >
                    <Plus size={16} />
                </button>
            </div>

            <div className="space-y-1">
                {labels.map((label) => (
                    <div
                        key={label.id}
                        className="flex items-center justify-between px-2 py-1.5 rounded-md hover:bg-gray-100 group cursor-pointer"
                    >
                        <div className="flex items-center gap-3">
                            <Tag size={16} color={label.color} className="fill-current opacity-20" />
                            <span className="text-sm text-gray-700">{label.name}</span>
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
                ))}

                {isAdding && (
                    <form onSubmit={handleAddLabel} className="px-2 py-1">
                        <input
                            autoFocus
                            type="text"
                            value={newLabelName}
                            onChange={(e) => setNewLabelName(e.target.value)}
                            placeholder="Label name"
                            className="w-full text-sm px-2 py-1 border border-primary-300 rounded focus:outline-none focus:ring-2 focus:ring-primary-500"
                            onBlur={() => !newLabelName && setIsAdding(false)}
                        />
                    </form>
                )}
            </div>
        </div>
    );
};
