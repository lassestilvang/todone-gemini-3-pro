import { TaskItem } from './TaskItem';
import { AddTask } from './AddTask';
import { useProjectStore } from '../../store/useProjectStore';
import type { Task } from '../../types';

interface BoardViewProps {
    tasks: Task[];
    groupBy?: 'priority' | 'project' | 'status';
}

export const BoardView = ({ tasks, groupBy = 'status' }: BoardViewProps) => {
    const { projects } = useProjectStore();

    const getColumns = () => {
        if (groupBy === 'priority') {
            return [
                { id: '1', title: 'Priority 1', tasks: tasks.filter(t => t.priority === 1) },
                { id: '2', title: 'Priority 2', tasks: tasks.filter(t => t.priority === 2) },
                { id: '3', title: 'Priority 3', tasks: tasks.filter(t => t.priority === 3) },
                { id: '4', title: 'Priority 4', tasks: tasks.filter(t => t.priority === 4) },
            ];
        }
        if (groupBy === 'project') {
            return projects.map(p => ({
                id: p.id,
                title: p.name,
                tasks: tasks.filter(t => t.projectId === p.id)
            }));
        }
        // Default: Status (Todo / Completed)
        return [
            { id: 'todo', title: 'To Do', tasks: tasks.filter(t => !t.isCompleted) },
            { id: 'completed', title: 'Completed', tasks: tasks.filter(t => t.isCompleted) },
        ];
    };

    const columns = getColumns();

    return (
        <div className="flex gap-6 overflow-x-auto pb-4 h-full min-h-[500px]">
            {columns.map(col => (
                <div key={col.id} className="min-w-[300px] w-[300px] flex flex-col bg-gray-50/50 dark:bg-gray-800/50 rounded-xl p-3 border border-gray-100 dark:border-gray-700">
                    <div className="flex items-center justify-between mb-3 px-1">
                        <h3 className="font-semibold text-gray-700 dark:text-gray-200 text-sm">{col.title}</h3>
                        <span className="text-xs text-gray-400 dark:text-gray-300 font-medium bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded-full">
                            {col.tasks.length}
                        </span>
                    </div>

                    <div className="flex-1 overflow-y-auto space-y-2">
                        {col.tasks.map(task => (
                            <div key={task.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 p-2">
                                <TaskItem task={task} />
                            </div>
                        ))}
                        {col.id === 'todo' && (
                            <div className="mt-2">
                                <AddTask />
                            </div>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
};
