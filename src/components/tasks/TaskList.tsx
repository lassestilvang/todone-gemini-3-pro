import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, type DragEndEvent } from '@dnd-kit/core';
import { SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { TaskItem } from './TaskItem';
import { SortableTaskItem } from './SortableTaskItem';
import { AddTask } from './AddTask';
import { useTaskStore } from '../../store/useTaskStore';

interface TaskListProps {
    // tasks: Task[]; // tasks prop is no longer needed as it comes from the store
}

export const TaskList = ({ /* tasks */ }: TaskListProps) => {
    const { tasks, reorderTasks } = useTaskStore();

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

    return (
        <div className="space-y-2">
            <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
            >
                <SortableContext
                    items={uncompletedTasks.map(t => t.id)}
                    strategy={verticalListSortingStrategy}
                >
                    <div className="space-y-1">
                        {uncompletedTasks.map((task) => (
                            <SortableTaskItem key={task.id} task={task} />
                        ))}
                    </div>
                </SortableContext>
            </DndContext>

            <div className="py-2">
                <AddTask />
            </div>

            {completedTasks.length > 0 && (
                <div className="mt-6">
                    <h3 className="text-sm font-medium text-gray-500 mb-2">Completed</h3>
                    <div className="space-y-1 opacity-60">
                        {completedTasks.map((task) => (
                            <TaskItem key={task.id} task={task} />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};
