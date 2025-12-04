import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, type DragEndEvent } from '@dnd-kit/core';
import { SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { AnimatePresence, motion } from 'framer-motion';
import { TaskItem } from './TaskItem';
import { SortableTaskItem } from './SortableTaskItem';
import { AddTask } from './AddTask';
import { EmptyState } from '../ui/EmptyState';
import { CheckCircle2 } from 'lucide-react';
import { useTaskStore } from '../../store/useTaskStore';
import type { Task } from '../../types';

interface TaskListProps {
    tasks?: Task[];
}

export const TaskList = ({ tasks: propTasks }: TaskListProps) => {
    const { tasks: storeTasks, reorderTasks } = useTaskStore();
    const tasks = propTasks || storeTasks;

    // Only show top-level tasks in the main list
    // Sort by order
    const topLevelTasks = tasks
        .filter(t => !t.parentId)
        .sort((a, b) => a.order - b.order);

    const uncompletedTasks = topLevelTasks.filter(t => !t.isCompleted);
    const completedTasks = topLevelTasks.filter(t => t.isCompleted);

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        if (over && active.id !== over.id) {
            reorderTasks(active.id as string, over.id as string);
        }
    };

    if (tasks.length === 0) {
        return (
            <div className="max-w-3xl mx-auto p-6">
                <AddTask />
                <EmptyState
                    icon={CheckCircle2}
                    title="All caught up!"
                    description="You have no tasks on your list. Enjoy your day or add a new task to get started."
                />
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto p-6 pb-24">
            <AddTask />

            <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
            >
                <div className="space-y-1 mt-6">
                    <SortableContext
                        items={uncompletedTasks.map(t => t.id)}
                        strategy={verticalListSortingStrategy}
                    >
                        <AnimatePresence initial={false}>
                            {uncompletedTasks.map((task) => (
                                <motion.div
                                    key={task.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, height: 0 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <SortableTaskItem task={task} />
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </SortableContext>
                </div>
            </DndContext>

            {completedTasks.length > 0 && (
                <div className="mt-8">
                    <h3 className="text-sm font-semibold text-gray-500 mb-3">Completed</h3>
                    <div className="space-y-1 opacity-60 hover:opacity-100 transition-opacity">
                        <AnimatePresence initial={false}>
                            {completedTasks.map((task) => (
                                <motion.div
                                    key={task.id}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                >
                                    <TaskItem key={task.id} task={task} />
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                </div>
            )}
        </div>
    );
};
