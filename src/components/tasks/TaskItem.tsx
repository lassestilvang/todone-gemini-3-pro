import { useState } from 'react';
import { Check, Calendar, Tag, Plus, ChevronDown, Sparkles, Loader2, Pencil } from 'lucide-react';
import type { Task } from '../../types';
import { useTaskStore } from '../../store/useTaskStore';
import { useLabelStore } from '../../store/useLabelStore';
import { cn } from '../../lib/utils';
import { format } from 'date-fns';
import { generateSubtasks } from '../../lib/ai';

interface TaskItemProps {
    task: Task;
}

import { useKarmaStore } from '../../store/useKarmaStore';
import { TaskEditModal } from './TaskEditModal';

export const TaskItem = ({ task }: TaskItemProps) => {
    const { toggleTask, tasks, addTask } = useTaskStore();
    const { labels } = useLabelStore();
    const { addPoints } = useKarmaStore();
    const [isExpanded, setIsExpanded] = useState(false);
    const [isAddingSubtask, setIsAddingSubtask] = useState(false);
    const [subtaskContent, setSubtaskContent] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);


    const handleGenerateSubtasks = async () => {
        setIsGenerating(true);
        try {
            const suggestions = await generateSubtasks(task.content);
            for (const suggestion of suggestions) {
                await addTask({
                    content: suggestion.content,
                    projectId: task.projectId,
                    parentId: task.id,
                    priority: 4,
                    labels: [],
                    isRecurring: false,
                });
            }
            setIsExpanded(true);
        } catch (error) {
            console.error('Failed to generate subtasks', error);
        } finally {
            setIsGenerating(false);
        }
    };

    const taskLabels = labels.filter(l => task.labels.includes(l.id));
    const subtasks = tasks.filter(t => t.parentId === task.id);
    const completedSubtasks = subtasks.filter(t => t.isCompleted).length;

    const handleToggle = async () => {
        await toggleTask(task.id);
        if (!task.isCompleted) {
            addPoints(100); // Award 100 points for completing a task
            // Play sound?
        }
    };

    const handleAddSubtask = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!subtaskContent.trim()) return;

        await addTask({
            content: subtaskContent,
            projectId: task.projectId,
            parentId: task.id,
            priority: 4,
            labels: [],
            isRecurring: false,
        });
        setSubtaskContent('');
        setIsAddingSubtask(false);
        setIsExpanded(true);
    };

    const [isEditing, setIsEditing] = useState(false);
    const [editContent, setEditContent] = useState(task.content);
    const { updateTask } = useTaskStore();

    const handleSave = async () => {
        if (editContent.trim() !== task.content) {
            await updateTask(task.id, { content: editContent });
        }
        setIsEditing(false);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleSave();
        } else if (e.key === 'Escape') {
            setEditContent(task.content);
            setIsEditing(false);
        }
    };

    return (
        <div className="group/item">
            <div
                className="flex items-start gap-3 py-2 border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 -mx-4 px-4 transition-colors cursor-pointer"
                onClick={() => setIsEditModalOpen(true)}
            >
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        handleToggle();
                    }}
                    className={cn(
                        "mt-1 w-5 h-5 rounded-full border flex items-center justify-center transition-colors",
                        task.isCompleted
                            ? "bg-primary-500 border-primary-500 text-white"
                            : "border-gray-300 dark:border-gray-600 hover:border-primary-500 text-transparent"
                    )}
                >
                    <Check size={12} strokeWidth={3} />
                </button>

                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                        {isEditing ? (
                            <input
                                autoFocus
                                type="text"
                                value={editContent}
                                onChange={(e) => setEditContent(e.target.value)}
                                onBlur={handleSave}
                                onKeyDown={handleKeyDown}
                                onClick={(e) => e.stopPropagation()}
                                className="w-full text-sm bg-transparent border-none focus:ring-0 p-0 text-gray-900 dark:text-white"
                                onFocus={(e) => e.target.select()}
                            />
                        ) : (
                            <span className={cn(
                                "text-sm text-gray-900 dark:text-white",
                                task.isCompleted && "line-through text-gray-400 dark:text-gray-500"
                            )}>
                                {task.content}
                            </span>
                        )}
                        {subtasks.length > 0 && (
                            <span className="text-xs text-gray-400 flex items-center gap-0.5">
                                <span className="w-1 h-1 rounded-full bg-gray-300" />
                                {completedSubtasks}/{subtasks.length}
                            </span>
                        )}
                    </div>

                    {(task.description || task.dueDate || taskLabels.length > 0) && !isEditing && (
                        <div className="flex items-center gap-3 mt-1 text-xs text-gray-500 dark:text-gray-400">
                            {task.dueDate && (
                                <div className="flex items-center gap-1 text-red-500">
                                    <Calendar size={12} />
                                    <span>{format(new Date(task.dueDate), 'MMM d')}</span>
                                </div>
                            )}
                            {task.description && (
                                <span className="truncate max-w-[200px]">{task.description}</span>
                            )}
                            {taskLabels.map(label => (
                                <div key={label.id} className="flex items-center gap-1">
                                    <Tag size={10} color={label.color} className="fill-current opacity-50" />
                                    <span className="text-xs" style={{ color: label.color }}>{label.name}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="opacity-0 group-hover/item:opacity-100 flex items-center gap-2">
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                setIsEditModalOpen(true);
                            }}
                            className="p-1 text-gray-400 hover:text-primary-600 hover:bg-gray-100 rounded transition-colors"
                            title="Edit task"
                        >
                            <Pencil size={16} />
                        </button>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                handleGenerateSubtasks();
                            }}
                            disabled={isGenerating}
                            className="p-1 text-gray-400 hover:text-purple-500 hover:bg-purple-50 rounded transition-colors"
                            title="Auto-generate subtasks"
                        >
                            {isGenerating ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
                        </button>
                        {/* Add subtask button */}
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                setIsAddingSubtask(true);
                                setIsExpanded(true);
                                // TODO: Focus new subtask input
                            }}
                            className="p-1 text-gray-400 hover:text-primary-600 hover:bg-gray-100 rounded transition-colors"
                        >
                            <Plus size={16} />
                        </button>
                    </div>
                    {subtasks.length > 0 && (
                        <button
                            onClick={() => setIsExpanded(!isExpanded)}
                            className={cn(
                                "p-1 text-gray-400 hover:text-gray-600 transition-colors transform",
                                isExpanded && "rotate-180"
                            )}
                        >
                            <ChevronDown size={16} />
                        </button>
                    )}
                </div>
            </div>

            {(isExpanded || isAddingSubtask) && (
                <div className="pl-8 pr-4 pb-2">
                    {isExpanded && subtasks.map(subtask => (
                        <TaskItem key={subtask.id} task={subtask} />
                    ))}

                    {isAddingSubtask && (
                        <form onSubmit={handleAddSubtask} className="mt-2 flex gap-2">
                            <input
                                autoFocus
                                type="text"
                                value={subtaskContent}
                                onChange={(e) => setSubtaskContent(e.target.value)}
                                placeholder="Add sub-task..."
                                className="flex-1 text-sm px-2 py-1 border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-primary-500"
                                onBlur={() => !subtaskContent && setIsAddingSubtask(false)}
                            />
                        </form>
                    )}
                </div>
            )}
            <TaskEditModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                task={task}
            />
        </div>
    );
};
