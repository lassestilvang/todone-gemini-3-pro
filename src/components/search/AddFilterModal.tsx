import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { useFilterStore } from '../../store/useFilterStore';
import { useUIStore } from '../../store/useUIStore';

export const AddFilterModal = () => {
    const { activeModal, closeModal } = useUIStore();
    const { addFilter } = useFilterStore();
    const [name, setName] = useState('');
    const [query, setQuery] = useState('');
    const [color, setColor] = useState('#808080');

    const isOpen = activeModal === 'filter';

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim() || !query.trim()) return;

        await addFilter(name, query, color);

        setName('');
        setQuery('');
        setColor('#808080');
        closeModal();
    };

    return (
        <Modal isOpen={isOpen} onClose={closeModal} title="Add Filter">
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="filter-name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Name
                    </label>
                    <input
                        type="text"
                        id="filter-name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white p-2 border"
                        placeholder="Filter Name"
                        autoFocus
                    />
                </div>

                <div>
                    <label htmlFor="filter-query" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Query
                    </label>
                    <input
                        type="text"
                        id="filter-query"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white p-2 border"
                        placeholder="e.g., priority:1"
                    />
                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                        Supports simple queries like 'priority:1', 'label:work'.
                    </p>
                </div>

                <div>
                    <label htmlFor="filter-color" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Color
                    </label>
                    <div className="mt-1 flex items-center gap-2">
                        <input
                            type="color"
                            id="filter-color"
                            value={color}
                            onChange={(e) => setColor(e.target.value)}
                            className="h-8 w-8 rounded-md border border-gray-300 cursor-pointer p-0.5"
                        />
                        <span className="text-sm text-gray-500 dark:text-gray-400">{color}</span>
                    </div>
                </div>

                <div className="flex justify-end gap-3 mt-6">
                    <button
                        type="button"
                        onClick={closeModal}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={!name.trim() || !query.trim()}
                        className="px-4 py-2 text-sm font-medium text-white bg-primary-600 border border-transparent rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Add Filter
                    </button>
                </div>
            </form>
        </Modal>
    );
};
