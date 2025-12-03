import React, { useState, useEffect, useRef } from 'react';
import { Search, Hash, Tag, CheckCircle, ArrowRight } from 'lucide-react';
import { useTaskStore } from '../../store/useTaskStore';
import { useProjectStore } from '../../store/useProjectStore';
import { useLabelStore } from '../../store/useLabelStore';
import { cn } from '../../lib/utils';

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

    const allResults = [
        ...filteredTasks.map(t => ({ type: 'task', data: t })),
        ...filteredProjects.map(p => ({ type: 'project', data: p })),
        ...filteredLabels.map(l => ({ type: 'label', data: l })),
    ];

    useEffect(() => {
        if (isOpen) {
            setTimeout(() => inputRef.current?.focus(), 50);
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
                handleSelect(allResults[selectedIndex]);
            } else if (e.key === 'Escape') {
                onClose();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, allResults, selectedIndex, onClose]);

    const handleSelect = (item: any) => {
        if (!item) return;

        // TODO: Implement navigation/action
        console.log('Selected:', item);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-[20vh]">
            <div className="fixed inset-0 bg-black/20 backdrop-blur-sm" onClick={onClose} />

            <div className="relative w-full max-w-2xl bg-white rounded-xl shadow-2xl overflow-hidden border border-gray-200 flex flex-col max-h-[60vh]">
                <div className="flex items-center px-4 py-3 border-b border-gray-100">
                    <Search className="w-5 h-5 text-gray-400 mr-3" />
                    <input
                        ref={inputRef}
                        type="text"
                        value={query}
                        onChange={(e) => {
                            setQuery(e.target.value);
                            setSelectedIndex(0);
                        }}
                        placeholder="Search tasks, projects, or commands..."
                        className="flex-1 text-lg outline-none placeholder:text-gray-400 text-gray-900"
                    />
                    <div className="flex gap-1">
                        <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-xs text-gray-500 bg-gray-100 border border-gray-200 rounded">ESC</kbd>
                    </div>
                </div>

                <div className="overflow-y-auto p-2">
                    {allResults.length === 0 ? (
                        <div className="text-center py-8 text-gray-500 text-sm">
                            No results found for "{query}"
                        </div>
                    ) : (
                        <div className="space-y-1">
                            {filteredTasks.length > 0 && (
                                <div className="mb-2">
                                    <div className="text-xs font-semibold text-gray-500 px-2 py-1 mb-1">Tasks</div>
                                    {filteredTasks.map((task) => {
                                        return (
                                            <ResultItem
                                                key={task.id}
                                                icon={<CheckCircle size={16} className="text-gray-400" />}
                                                label={task.content}
                                                subLabel={task.description}
                                                active={allResults.indexOf(allResults.find(r => r.data.id === task.id)!) === selectedIndex}
                                                onClick={() => handleSelect({ type: 'task', data: task })}
                                            />
                                        );
                                    })}
                                </div>
                            )}

                            {filteredProjects.length > 0 && (
                                <div className="mb-2">
                                    <div className="text-xs font-semibold text-gray-500 px-2 py-1 mb-1">Projects</div>
                                    {filteredProjects.map((project) => (
                                        <ResultItem
                                            key={project.id}
                                            icon={<Hash size={16} color={project.color} />}
                                            label={project.name}
                                            active={allResults.indexOf(allResults.find(r => r.data.id === project.id)!) === selectedIndex}
                                            onClick={() => handleSelect({ type: 'project', data: project })}
                                        />
                                    ))}
                                </div>
                            )}

                            {filteredLabels.length > 0 && (
                                <div className="mb-2">
                                    <div className="text-xs font-semibold text-gray-500 px-2 py-1 mb-1">Labels</div>
                                    {filteredLabels.map((label) => (
                                        <ResultItem
                                            key={label.id}
                                            icon={<Tag size={16} color={label.color} />}
                                            label={label.name}
                                            active={allResults.indexOf(allResults.find(r => r.data.id === label.id)!) === selectedIndex}
                                            onClick={() => handleSelect({ type: 'label', data: label })}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>

                <div className="bg-gray-50 px-4 py-2 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
                    <div className="flex gap-4">
                        <span><kbd className="font-sans">↑↓</kbd> to navigate</span>
                        <span><kbd className="font-sans">↵</kbd> to select</span>
                    </div>
                    <div>
                        Todone Search
                    </div>
                </div>
            </div>
        </div>
    );
};

interface ResultItemProps {
    icon: React.ReactNode;
    label: string;
    subLabel?: string;
    active: boolean;
    onClick: () => void;
}

const ResultItem = ({ icon, label, subLabel, active, onClick }: ResultItemProps) => {
    return (
        <div
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
        </div>
    );
};
