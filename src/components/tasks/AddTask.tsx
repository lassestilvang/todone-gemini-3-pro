import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { useTaskStore } from '../../store/useTaskStore';

export const AddTask = () => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [content, setContent] = useState('');
    const { addTask } = useTaskStore();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!content.trim()) return;

        await addTask({
            content,
            projectId: 'inbox', // Default to inbox for now
            priority: 4,
            labels: [],
            isRecurring: false,
        });

        setContent('');
        setIsExpanded(false);
    };

    if (!isExpanded) {
        return (
            <button
                onClick={() => setIsExpanded(true)}
                className="flex items-center gap-2 text-gray-500 hover:text-primary-600 transition-colors py-2 px-2 -ml-2 rounded-md hover:bg-gray-100 w-full text-left"
            >
                <div className="w-5 h-5 rounded-full flex items-center justify-center text-primary-500">
                    <Plus size={18} />
                </div>
                <span className="text-sm">Add task</span>
            </button>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="border border-gray-200 rounded-lg p-3 shadow-sm bg-white">
            <input
                autoFocus
                type="text"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Task name"
                className="w-full text-sm font-medium placeholder:text-gray-400 outline-none mb-2"
            />
            <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                <div className="flex gap-2">
                    {/* Quick actions (Date, Priority, etc.) */}
                    <button type="button" className="px-2 py-1 text-xs font-medium text-gray-500 border border-gray-200 rounded hover:bg-gray-50">
                        Today
                    </button>
                    <button type="button" className="px-2 py-1 text-xs font-medium text-gray-500 border border-gray-200 rounded hover:bg-gray-50">
                        Inbox
                    </button>
                </div>
                <div className="flex gap-2">
                    <button
                        type="button"
                        onClick={() => setIsExpanded(false)}
                        className="px-3 py-1.5 text-xs font-semibold text-gray-700 bg-gray-100 rounded hover:bg-gray-200"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={!content.trim()}
                        className="px-3 py-1.5 text-xs font-semibold text-white bg-primary-500 rounded hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Add task
                    </button>
                </div>
            </div>
        </form>
    );
};
