import { Check, Calendar, Tag } from 'lucide-react';
import type { Task } from '../../types';
import { useTaskStore } from '../../store/useTaskStore';
import { useLabelStore } from '../../store/useLabelStore';
import { cn } from '../../lib/utils';
import { format } from 'date-fns';

interface TaskItemProps {
    task: Task;
}

export const TaskItem = ({ task }: TaskItemProps) => {
    const { toggleTask } = useTaskStore();
    const { labels } = useLabelStore();

    const taskLabels = labels.filter(l => task.labels.includes(l.id));

    return (
        <div className="group flex items-start gap-3 py-3 border-b border-gray-100 hover:bg-gray-50 -mx-4 px-4 transition-colors">
            <button
                onClick={() => toggleTask(task.id)}
                className={cn(
                    "mt-1 w-5 h-5 rounded-full border flex items-center justify-center transition-colors",
                    task.isCompleted
                        ? "bg-primary-500 border-primary-500 text-white"
                        : "border-gray-300 hover:bg-gray-100 text-transparent hover:text-gray-300",
                    `priority-${task.priority}`
                )}
            >
                <Check size={12} strokeWidth={3} />
            </button>

            <div className="flex-1 min-w-0">
                <div className={cn("text-sm text-gray-900 mb-1", task.isCompleted && "line-through text-gray-500")}>
                    {task.content}
                </div>

                {(task.description || task.dueDate) && (
                    <div className="flex items-center gap-3 text-xs text-gray-500">
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

            <div className="opacity-0 group-hover:opacity-100 flex items-center gap-2 transition-opacity">
                {/* Actions will go here (Edit, Delete, Date, etc.) */}
            </div>
        </div>
    );
};
