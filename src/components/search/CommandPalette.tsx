import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Search, Hash, Tag, ArrowRight, CheckCircle } from 'lucide-react';
import { useTaskStore } from '../../store/useTaskStore';
import { useProjectStore } from '../../store/useProjectStore';
import { useLabelStore } from '../../store/useLabelStore';
import { cn } from '../../lib/utils';
import type { Task, Project, Label } from '../../types';

interface CommandPaletteProps {
    isOpen: boolean;
    onClose: () => void;
}

export const CommandPalette = ({ isOpen, onClose }: CommandPaletteProps) => {
    const [query, setQuery] = useState('');
    const [selectedIndex, setSelectedIndex] = useState(0);
    const inputRef = useRef<HTMLInputElement>(null);

    const { tasks } = useTaskStore();
    const { projects } = useProjectStore();
    const { labels } = useLabelStore();

    // Filter results
    const filteredTasks = tasks.filter(t => t.content.toLowerCase().includes(query.toLowerCase())).slice(0, 5);
    const filteredProjects = projects.filter(p => p.name.toLowerCase().includes(query.toLowerCase())).slice(0, 3);
    const filteredLabels = labels.filter(l => l.name.toLowerCase().includes(query.toLowerCase())).slice(0, 3);

    const allResults = React.useMemo(() => [
        ...filteredTasks.map(t => ({ type: 'task' as const, data: t })),
        ...filteredProjects.map(p => ({ type: 'project' as const, data: p })),
        ...filteredLabels.map(l => ({ type: 'label' as const, data: l })),
    ], [filteredTasks, filteredProjects, filteredLabels]);

    const handleSelect = useCallback((item: { type: 'task' | 'project' | 'label', data: Task | Project | Label }) => {
        if (!item) return;

        // TODO: Implement navigation/action
        console.log('Selected:', item);
        onClose();
    }, [onClose]);

    useEffect(() => {
        if (isOpen) {
            setTimeout(() => inputRef.current?.focus(), 50);
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setQuery('');
            setSelectedIndex(0);
        }
    }, [isOpen]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (!isOpen) return;

            if (e.key === 'ArrowDown') {
                e.preventDefault();
                setSelectedIndex(prev => (prev + 1) % allResults.length);
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                setSelectedIndex(prev => (prev - 1 + allResults.length) % allResults.length);
            } else if (e.key === 'Enter') {
                e.preventDefault();
                if (allResults.length > 0) {
                    handleSelect(allResults[selectedIndex]);
                }
            } else if (e.key === 'Escape') {
                onClose();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, allResults, selectedIndex, onClose, handleSelect]);

    if (!isOpen) return null;

    return (
        <Transition.Root show={isOpen} as={React.Fragment}>
            <Dialog as="div" className="relative z-50" onClose={onClose}>
                <Transition.Child
                    as={React.Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-gray-500 bg-opacity-25 transition-opacity" />
                </Transition.Child>

                <div className="fixed inset-0 z-10 overflow-y-auto p-4 sm:p-6 md:p-20">
                    <Transition.Child
                        as={React.Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0 scale-95"
                        enterTo="opacity-100 scale-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100 scale-100"
                        leaveTo="opacity-0 scale-95"
                    >
                        <Dialog.Panel className="mx-auto max-w-2xl transform divide-y divide-gray-100 overflow-hidden rounded-xl bg-white shadow-2xl ring-1 ring-black ring-opacity-5 transition-all">
                            <div className="relative">
                                <Search className="pointer-events-none absolute top-3.5 left-4 h-5 w-5 text-gray-400" aria-hidden="true" />
                                <input
                                    ref={inputRef}
                                    type="text"
                                    className="h-12 w-full border-0 bg-transparent pl-11 pr-4 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm"
                                    placeholder="Search..."
                                    value={query}
                                    onChange={(e) => {
                                        setQuery(e.target.value);
                                        setSelectedIndex(0);
                                    }}
                                />
                            </div>

                            {allResults.length > 0 && (
                                <ul className="max-h-96 scroll-py-3 overflow-y-auto p-3">
                                    {allResults.map((item, index) => (
                                        <ResultItem
                                            key={`${item.type}-${item.data.id}`}
                                            item={item}
                                            active={index === selectedIndex}
                                            onClick={() => handleSelect(item)}
                                        />
                                    ))}
                                </ul>
                            )}

                            {query !== '' && allResults.length === 0 && (
                                <p className="p-4 text-sm text-gray-500">No results found.</p>
                            )}

                            <div className="bg-gray-50 px-4 py-2 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
                                <div className="flex gap-4">
                                    <span><kbd className="font-sans">↑↓</kbd> to navigate</span>
                                    <span><kbd className="font-sans">↵</kbd> to select</span>
                                </div>
                                <div>
                                    Todone Search
                                </div>
                            </div>
                        </Dialog.Panel>
                    </Transition.Child>
                </div>
            </Dialog>
        </Transition.Root>
    );
};

interface ResultItemProps {
    item: { type: 'task' | 'project' | 'label', data: Task | Project | Label };
    active: boolean;
    onClick: () => void;
}

const ResultItem = ({ item, active, onClick }: ResultItemProps) => {
    let icon;
    let label;
    let subLabel;

    if (item.type === 'task') {
        const task = item.data as Task;
        icon = <CheckCircle size={16} className="text-gray-400" />;
        label = task.content;
        subLabel = task.description;
    } else if (item.type === 'project') {
        const project = item.data as Project;
        icon = <Hash size={16} color={project.color} />;
        label = project.name;
    } else {
        const labelItem = item.data as Label;
        icon = <Tag size={16} color={labelItem.color} />;
        label = labelItem.name;
    }

    return (
        <li
            onClick={onClick}
            className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition-colors",
                active ? "bg-primary-50 text-primary-900" : "hover:bg-gray-100 text-gray-700"
            )}
        >
            <div className="flex-shrink-0">{icon}</div>
            <div className="flex-1 min-w-0">
                <div className="font-medium truncate">{label}</div>
                {subLabel && <div className="text-xs text-gray-500 truncate">{subLabel}</div>}
            </div>
            {active && <ArrowRight size={16} className="text-primary-500" />}
        </li>
    );
};
