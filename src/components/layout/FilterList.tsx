import React, { useState } from 'react';
import { Filter as FilterIcon, Plus, X } from 'lucide-react';
import { useFilterStore } from '../../store/useFilterStore';

export const FilterList = () => {
    const { filters, addFilter, deleteFilter } = useFilterStore();
    const [isAdding, setIsAdding] = useState(false);
    const [newFilterName, setNewFilterName] = useState('');
    const [newFilterQuery, setNewFilterQuery] = useState('');

    const handleAddFilter = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newFilterName.trim() || !newFilterQuery.trim()) return;

        // Random color for now
        const colors = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6', '#a855f7', '#ec4899'];
        const randomColor = colors[Math.floor(Math.random() * colors.length)];

        await addFilter(newFilterName, newFilterQuery, randomColor);
        setNewFilterName('');
        setNewFilterQuery('');
        setIsAdding(false);
    };

    return (
        <div className="mt-6">
            <div className="flex items-center justify-between px-2 mb-2 group">
                <h3 className="text-sm font-semibold text-gray-500">Filters</h3>
                <button
                    onClick={() => setIsAdding(true)}
                    className="text-gray-400 hover:text-primary-500 transition-colors opacity-0 group-hover:opacity-100"
                >
                    <Plus size={16} />
                </button>
            </div>

            <div className="space-y-1">
                {filters.map((filter) => (
                    <div
                        key={filter.id}
                        className="flex items-center justify-between px-2 py-1.5 rounded-md hover:bg-gray-100 group cursor-pointer"
                    >
                        <div className="flex items-center gap-3">
                            <FilterIcon size={16} color={filter.color} className="fill-current opacity-20" />
                            <span className="text-sm text-gray-700">{filter.name}</span>
                        </div>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                deleteFilter(filter.id);
                            }}
                            className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                            <X size={14} />
                        </button>
                    </div>
                ))}

                {isAdding && (
                    <form onSubmit={handleAddFilter} className="px-2 py-1 space-y-2 border border-gray-200 rounded-md p-2 bg-white">
                        <input
                            autoFocus
                            type="text"
                            value={newFilterName}
                            onChange={(e) => setNewFilterName(e.target.value)}
                            placeholder="Filter name"
                            className="w-full text-sm px-2 py-1 border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-primary-500"
                        />
                        <input
                            type="text"
                            value={newFilterQuery}
                            onChange={(e) => setNewFilterQuery(e.target.value)}
                            placeholder="Query (e.g., today & p1)"
                            className="w-full text-sm px-2 py-1 border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-primary-500"
                        />
                        <div className="flex justify-end gap-2">
                            <button
                                type="button"
                                onClick={() => setIsAdding(false)}
                                className="text-xs text-gray-500 hover:text-gray-700"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={!newFilterName || !newFilterQuery}
                                className="text-xs bg-primary-500 text-white px-2 py-1 rounded hover:bg-primary-600 disabled:opacity-50"
                            >
                                Add
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
};
