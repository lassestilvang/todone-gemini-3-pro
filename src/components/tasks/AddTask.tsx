import React, { useState } from 'react';
import { Plus, Tag, Repeat, Calendar } from 'lucide-react';
import { useTaskStore } from '../../store/useTaskStore';
import { useUIStore } from '../../store/useUIStore';
import { useLabelStore } from '../../store/useLabelStore';
import { cn } from '../../lib/utils';
import type { RecurrencePattern } from '../../lib/recurrence';
import { parseDateFromText, removeDateFromText, type ParsedDate } from '../../lib/nlp';
import { format } from 'date-fns';

export const AddTask = () => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [content, setContent] = useState('');
    const [selectedLabels, setSelectedLabels] = useState<string[]>([]);
    const [recurringPattern, setRecurringPattern] = useState<RecurrencePattern | null>(null);
    const [parsedDate, setParsedDate] = useState<ParsedDate | null>(null);
    const { addTask } = useTaskStore();
    const { labels } = useLabelStore();

    const { activeContext } = useUIStore();

    const handleContentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newContent = e.target.value;
        setContent(newContent);

        const result = parseDateFromText(newContent);
        setParsedDate(result);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!content.trim()) return;

        let finalContent = content;
        let finalDueDate = recurringPattern ? new Date().toISOString().split('T')[0] : undefined;

        // Set default due date based on context
        if (activeContext.type === 'today' && !finalDueDate) {
            finalDueDate = new Date().toISOString().split('T')[0];
        } else if (activeContext.type === 'upcoming' && !finalDueDate) {
            const tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);
            finalDueDate = tomorrow.toISOString().split('T')[0];
        }

        if (parsedDate && !recurringPattern) {
            finalContent = removeDateFromText(content, parsedDate.text);
            finalDueDate = parsedDate.date.toISOString().split('T')[0];
        }

        // Determine project ID
        let projectId = 'inbox';
        if (activeContext.type === 'project' && activeContext.id) {
            projectId = activeContext.id;
        }

        await addTask({
            content: finalContent,
            projectId,
            priority: 4,
            labels: selectedLabels,
            isRecurring: !!recurringPattern,
            recurringPattern: recurringPattern || undefined,
            dueDate: finalDueDate,
        });

        setContent('');
        setSelectedLabels([]);
        setRecurringPattern(null);
        setParsedDate(null);
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
            <div className="relative">
                <input
                    autoFocus
                    type="text"
                    value={content}
                    onChange={handleContentChange}
                    placeholder="Task name (e.g., 'Buy milk tomorrow')"
                    className="w-full text-sm font-medium placeholder:text-gray-400 outline-none mb-2 pr-20"
                />
                {parsedDate && (
                    <div className="absolute right-0 top-0 text-xs text-primary-600 bg-primary-50 px-1.5 py-0.5 rounded border border-primary-100 flex items-center gap-1">
                        <Calendar size={10} />
                        {format(parsedDate.date, 'MMM d')}
                    </div>
                )}
            </div>
            <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                <div className="flex gap-2">
                    {/* Quick actions (Date, Priority, etc.) */}
                    <button type="button" className="px-2 py-1 text-xs font-medium text-gray-500 border border-gray-200 rounded hover:bg-gray-50">
                        Today
                    </button>
                    <button type="button" className="px-2 py-1 text-xs font-medium text-gray-500 border border-gray-200 rounded hover:bg-gray-50">
                        Inbox
                    </button>

                    <div className="relative group">
                        <button type="button" className="px-2 py-1 text-xs font-medium text-gray-500 border border-gray-200 rounded hover:bg-gray-50 flex items-center gap-1">
                            <Tag size={12} />
                            <span>Labels</span>
                        </button>

                        <div className="absolute top-full left-0 mt-1 w-48 bg-white border border-gray-200 rounded-md shadow-lg py-1 hidden group-hover:block z-10">
                            {labels.length === 0 ? (
                                <div className="px-3 py-2 text-xs text-gray-400">No labels created</div>
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
                                            "w-full text-left px-3 py-1.5 text-xs hover:bg-gray-50 flex items-center gap-2",
                                            selectedLabels.includes(label.id) ? "text-primary-600 bg-primary-50" : "text-gray-700"
                                        )}
                                    >
                                        <Tag size={12} color={label.color} className="fill-current opacity-50" />
                                        <span>{label.name}</span>
                                    </button>
                                ))
                            )}
                        </div>
                    </div>

                    <div className="relative group">
                        <button type="button" className={cn(
                            "px-2 py-1 text-xs font-medium border rounded hover:bg-gray-50 flex items-center gap-1",
                            recurringPattern ? "text-primary-600 border-primary-200 bg-primary-50" : "text-gray-500 border-gray-200"
                        )}>
                            <Repeat size={12} />
                            <span>{recurringPattern || 'Repeat'}</span>
                        </button>

                        <div className="absolute top-full left-0 mt-1 w-32 bg-white border border-gray-200 rounded-md shadow-lg py-1 hidden group-hover:block z-10">
                            {['daily', 'weekdays', 'weekly', 'monthly'].map((pattern) => (
                                <button
                                    key={pattern}
                                    type="button"
                                    onClick={() => setRecurringPattern(recurringPattern === pattern ? null : pattern as RecurrencePattern)}
                                    className={cn(
                                        "w-full text-left px-3 py-1.5 text-xs hover:bg-gray-50",
                                        recurringPattern === pattern ? "text-primary-600 bg-primary-50" : "text-gray-700"
                                    )}
                                >
                                    {pattern.charAt(0).toUpperCase() + pattern.slice(1)}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {selectedLabels.length > 0 && (
                    <div className="flex items-center gap-1">
                        {selectedLabels.map(id => {
                            const label = labels.find(l => l.id === id);
                            if (!label) return null;
                            return (
                                <span key={id} className="text-[10px] px-1.5 py-0.5 rounded-full bg-gray-100 text-gray-600 border border-gray-200">
                                    {label.name}
                                </span>
                            );
                        })}
                    </div>
                )}
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
        </form>
    );
};
