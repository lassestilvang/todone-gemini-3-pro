
import type { Task } from '../../types';
import { TaskItem } from './TaskItem';
import { AddTask } from './AddTask';

interface TaskListProps {
    tasks: Task[];
}

export const TaskList = ({ tasks }: TaskListProps) => {
    const uncompletedTasks = tasks.filter(t => !t.isCompleted);
    const completedTasks = tasks.filter(t => t.isCompleted);

    return (
        <div className="space-y-2">
            <div className="space-y-0">
                {uncompletedTasks.map((task) => (
                    <TaskItem key={task.id} task={task} />
                ))}
            </div>

            <div className="pt-2">
                <AddTask />
            </div>

            {completedTasks.length > 0 && (
                <div className="pt-8">
                    <h3 className="text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wider">Completed</h3>
                    <div className="space-y-0 opacity-60">
                        {completedTasks.map((task) => (
                            <TaskItem key={task.id} task={task} />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};
