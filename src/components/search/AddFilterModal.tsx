import React, { useState, useEffect } from 'react';
import { Modal } from '../ui/Modal';
import { ColorPicker } from '../ui/ColorPicker';
import { useFilterStore } from '../../store/useFilterStore';
import { useUIStore } from '../../store/useUIStore';

export const FilterModal = () => {
    const { activeModal, closeModal, editingItemId } = useUIStore();
    const { addFilter, updateFilter, filters } = useFilterStore();
    const [name, setName] = useState('');
    const [query, setQuery] = useState('');
    const [color, setColor] = useState('#158fad');

    const isOpen = activeModal === 'filter' || activeModal === 'edit-filter';
    const isEditMode = activeModal === 'edit-filter';
    const editingFilter = isEditMode ? filters.find(f => f.id === editingItemId) : null;

    useEffect(() => {
        if (isOpen && isEditMode && editingFilter) {
            setName(editingFilter.name);
            setQuery(editingFilter.query);
            setColor(editingFilter.color);
        } else if (isOpen && !isEditMode) {
            setName('');
            setQuery('');
            setColor('#158fad');
        }
    }, [isOpen, isEditMode, editingFilter]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim() || !query.trim()) return;

        if (isEditMode && editingItemId) {
            await updateFilter(editingItemId, { name, query, color });
        } else {
            await addFilter(name, query, color);
        }

        setName('');
        setQuery('');
        setColor('#158fad');
        closeModal();
    };

    const title = isEditMode ? 'Edit Filter' : 'Add Filter';
    const submitText = isEditMode ? 'Save Changes' : 'Add Filter';

    return (
        <Modal isOpen={isOpen} onClose={closeModal} title={title}>
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
                        Examples: p1, today, @label, #project
                    </p>
                </div>

                <ColorPicker value={color} onChange={setColor} />

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
                        {submitText}
                    </button>
                </div>
            </form>
        </Modal>
    );
};

// Keep the old export for backwards compatibility
export const AddFilterModal = FilterModal;
