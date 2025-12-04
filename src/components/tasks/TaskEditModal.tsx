import React, { useState, useEffect } from 'react';
import { Dialog, DialogPanel, DialogTitle, Transition, TransitionChild } from '@headlessui/react';
import { X, Calendar, Tag, Hash, Flag, Clock, Check } from 'lucide-react';
import { useTaskStore } from '../../store/useTaskStore';
import { useProjectStore } from '../../store/useProjectStore';
import { useLabelStore } from '../../store/useLabelStore';
import { cn } from '../../lib/utils';
import type { Task, Priority } from '../../types';
import { format } from 'date-fns';

interface TaskEditModalProps {
    isOpen: boolean;
    onClose: () => void;
    task: Task;
}

export const TaskEditModal = ({ isOpen, onClose, task }: TaskEditModalProps) => {
    const { updateTask } = useTaskStore();
    const { projects } = useProjectStore();
    const { labels } = useLabelStore();

    const [content, setContent] = useState(task.content);
    const [description, setDescription] = useState(task.description || '');
    const [dueDate, setDueDate] = useState(task.dueDate || '');
    const [priority, setPriority] = useState<Priority>(task.priority);
    const [projectId, setProjectId] = useState(task.projectId);
    const [selectedLabels, setSelectedLabels] = useState<string[]>(task.labels);

    useEffect(() => {
        if (isOpen) {
            setContent(task.content);
            setDescription(task.description || '');
            setDueDate(task.dueDate || '');
            setPriority(task.priority);
            setProjectId(task.projectId);
            setSelectedLabels(task.labels);
        }
    }, [isOpen, task]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!content.trim()) return;

        await updateTask(task.id, {
            content,
            description,
            dueDate: dueDate || undefined,
            priority,
            projectId,
            labels: selectedLabels,
        });
        onClose();
    };

    return (
        <Transition show={isOpen} as={React.Fragment}>
            <Dialog as="div" className="relative z-50" onClose={onClose}>
                <TransitionChild
                    as={React.Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black/25 backdrop-blur-sm" />
                </TransitionChild>

                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4 text-center">
                        <TransitionChild
                            as={React.Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <DialogPanel className="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white dark:bg-gray-900 p-6 text-left align-middle shadow-xl transition-all">
                                <div className="flex justify-between items-start mb-4">
                                    <DialogTitle as="h3" className="text-lg font-medium leading-6 text-gray-900 dark:text-white">
                                        Edit Task
                                    </DialogTitle>
                                    <button
                                        onClick={onClose}
                                        className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
                                    >
                                        <X size={20} />
                                    </button>
                                </div>

                                <form onSubmit={handleSubmit} className="space-y-4">
                                    {/* Content */}
                                    <div>
                                        <input
                                            type="text"
                                            value={content}
                                            onChange={(e) => setContent(e.target.value)}
                                            className="w-full text-lg font-medium border-none focus:ring-0 p-0 placeholder:text-gray-400 dark:placeholder:text-gray-500 bg-transparent text-gray-900 dark:text-white"
                                            placeholder="Task name"
                                        />
                                    </div>

                                    {/* Description */}
                                    <div>
                                        <textarea
                                            value={description}
                                            onChange={(e) => setDescription(e.target.value)}
                                            rows={3}
                                            className="w-full text-sm text-gray-600 dark:text-gray-300 border-none focus:ring-0 p-0 resize-none placeholder:text-gray-400 dark:placeholder:text-gray-500 bg-transparent"
                                            placeholder="Description"
                                        />
                                    </div>

                                    <div className="flex flex-wrap gap-2 pt-4 border-t border-gray-100 dark:border-gray-800">
                                        {/* Due Date */}
                                        <div className="relative group">
                                            <input
                                                type="date"
                                                value={dueDate}
                                                onChange={(e) => setDueDate(e.target.value)}
                                                className="absolute inset-0 opacity-0 cursor-pointer w-full"
                                            />
                                            <button type="button" className={cn(
                                                "flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded border transition-colors",
                                                dueDate ? "text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/30 border-red-200 dark:border-red-800" : "text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
                                            )}>
                                                <Calendar size={14} />
                                                <span>{dueDate ? format(new Date(dueDate), 'MMM d') : 'Due date'}</span>
                                            </button>
                                        </div>

                                        {/* Project */}
                                        <div className="relative group">
                                            <select
                                                value={projectId}
                                                onChange={(e) => setProjectId(e.target.value)}
                                                className="absolute inset-0 opacity-0 cursor-pointer w-full"
                                            >
                                                <option value="inbox">Inbox</option>
                                                {projects.map(p => (
                                                    <option key={p.id} value={p.id}>{p.name}</option>
                                                ))}
                                            </select>
                                            <button type="button" className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700 rounded hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                                                <Hash size={14} />
                                                <span>{projects.find(p => p.id === projectId)?.name || 'Inbox'}</span>
                                            </button>
                                        </div>

                                        {/* Priority */}
                                        <div className="relative group">
                                            <select
                                                value={priority}
                                                onChange={(e) => setPriority(Number(e.target.value) as Priority)}
                                                className="absolute inset-0 opacity-0 cursor-pointer w-full"
                                            >
                                                <option value={1}>Priority 1</option>
                                                <option value={2}>Priority 2</option>
                                                <option value={3}>Priority 3</option>
                                                <option value={4}>Priority 4</option>
                                            </select>
                                            <button type="button" className={cn(
                                                "flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded border transition-colors",
                                                priority === 1 ? "text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/30 border-red-200 dark:border-red-800" :
                                                    priority === 2 ? "text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/30 border-orange-200 dark:border-orange-800" :
                                                        priority === 3 ? "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 border-blue-200 dark:border-blue-800" :
                                                            "text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
                                            )}>
                                                <Flag size={14} />
                                                <span>P{priority}</span>
                                            </button>
                                        </div>

                                        {/* Labels */}
                                        <div className="relative group">
                                            <button type="button" className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700 rounded hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                                                <Tag size={14} />
                                                <span>Labels</span>
                                            </button>

                                            <div className="absolute top-full left-0 mt-1 w-48 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg py-1 hidden group-hover:block z-10">
                                                {labels.length === 0 ? (
                                                    <div className="px-3 py-2 text-xs text-gray-400 dark:text-gray-500">No labels created</div>
                                                ) : (
                                                    labels.map(label => (
                                                        <button
                                                            key={label.id}
                                                            type="button"
                                                            onClick={() => {
                                                                setSelectedLabels(prev =>
                                                                    prev.includes(label.id)
                                                                        ? prev.filter(id => id !== label.id)
                                                                        : [...prev, label.id]
                                                                );
                                                            }}
                                                            className={cn(
                                                                "w-full text-left px-3 py-1.5 text-xs hover:bg-gray-50 dark:hover:bg-gray-800 flex items-center gap-2",
                                                                selectedLabels.includes(label.id) ? "text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/30" : "text-gray-700 dark:text-gray-300"
                                                            )}
                                                        >
                                                            <Tag size={12} color={label.color} className="fill-current opacity-50" />
                                                            <span>{label.name}</span>
                                                            {selectedLabels.includes(label.id) && <Check size={12} className="ml-auto" />}
                                                        </button>
                                                    ))
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Selected Labels Display */}
                                    {selectedLabels.length > 0 && (
                                        <div className="flex flex-wrap gap-1 mt-2">
                                            {selectedLabels.map(id => {
                                                const label = labels.find(l => l.id === id);
                                                if (!label) return null;
                                                return (
                                                    <span key={id} className="flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700">
                                                        <Tag size={10} color={label.color} className="fill-current opacity-50" />
                                                        {label.name}
                                                        <button
                                                            type="button"
                                                            onClick={() => setSelectedLabels(prev => prev.filter(l => l !== id))}
                                                            className="hover:text-red-500"
                                                        >
                                                            <X size={10} />
                                                        </button>
                                                    </span>
                                                );
                                            })}
                                        </div>
                                    )}

                                    <div className="mt-6 flex justify-end gap-2">
                                        <button
                                            type="button"
                                            onClick={onClose}
                                            className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={!content.trim()}
                                            className="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            Save Changes
                                        </button>
                                    </div>
                                </form>
                            </DialogPanel>
                        </TransitionChild>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
};
