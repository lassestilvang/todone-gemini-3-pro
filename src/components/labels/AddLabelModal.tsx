import React, { useState, useEffect } from 'react';
import { Modal } from '../ui/Modal';
import { ColorPicker } from '../ui/ColorPicker';
import { useLabelStore } from '../../store/useLabelStore';
import { useUIStore } from '../../store/useUIStore';

export const LabelModal = () => {
    const { activeModal, closeModal, editingItemId } = useUIStore();
    const { addLabel, updateLabel, labels } = useLabelStore();
    const [name, setName] = useState('');
    const [color, setColor] = useState('#db4035');

    const isOpen = activeModal === 'label' || activeModal === 'edit-label';
    const isEditMode = activeModal === 'edit-label';
    const editingLabel = isEditMode ? labels.find(l => l.id === editingItemId) : null;

    useEffect(() => {
        if (isOpen && isEditMode && editingLabel) {
            setName(editingLabel.name);
            setColor(editingLabel.color);
        } else if (isOpen && !isEditMode) {
            setName('');
            setColor('#db4035');
        }
    }, [isOpen, isEditMode, editingLabel]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) return;

        if (isEditMode && editingItemId) {
            await updateLabel(editingItemId, { name, color });
        } else {
            await addLabel(name, color);
        }

        setName('');
        setColor('#db4035');
        closeModal();
    };

    const title = isEditMode ? 'Edit Label' : 'Add Label';
    const submitText = isEditMode ? 'Save Changes' : 'Add Label';

    return (
        <Modal isOpen={isOpen} onClose={closeModal} title={title}>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="label-name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Name
                    </label>
                    <input
                        type="text"
                        id="label-name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white p-2 border"
                        placeholder="Label Name"
                        autoFocus
                    />
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
                        disabled={!name.trim()}
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
export const AddLabelModal = LabelModal;
