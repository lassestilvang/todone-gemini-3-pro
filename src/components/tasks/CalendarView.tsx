import type { Task } from '../../types';
import { format, startOfWeek, addDays, isSameDay, startOfMonth, endOfMonth, eachDayOfInterval } from 'date-fns';

interface CalendarViewProps {
    tasks: Task[];
    view?: 'month' | 'week';
}

export const CalendarView = ({ tasks, view = 'week' }: CalendarViewProps) => {
    const today = new Date();

    const getDays = () => {
        if (view === 'week') {
            const start = startOfWeek(today, { weekStartsOn: 1 });
            return Array.from({ length: 7 }).map((_, i) => addDays(start, i));
        }
        const start = startOfMonth(today);
        const end = endOfMonth(today);
        return eachDayOfInterval({ start, end });
    };

    const days = getDays();

    return (
        <div className="grid grid-cols-7 border border-gray-200 rounded-lg overflow-hidden bg-white">
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
                <div key={day} className="p-2 text-center text-xs font-semibold text-gray-500 border-b border-gray-200 bg-gray-50">
                    {day}
                </div>
            ))}

            {days.map(day => {
                const dayTasks = tasks.filter(t => t.dueDate && isSameDay(new Date(t.dueDate), day));
                return (
                    <div key={day.toISOString()} className="min-h-[120px] p-2 border-b border-r border-gray-100 last:border-r-0 hover:bg-gray-50 transition-colors">
                        <div className="text-right mb-2">
                            <span className={`text-xs font-medium px-1.5 py-0.5 rounded-full ${isSameDay(day, today) ? 'bg-primary-500 text-white' : 'text-gray-700'}`}>
                                {format(day, 'd')}
                            </span>
                        </div>
                        <div className="space-y-1">
                            {dayTasks.map(task => (
                                <div key={task.id} className="text-[10px] truncate bg-primary-50 text-primary-700 px-1 py-0.5 rounded border border-primary-100">
                                    {task.content}
                                </div>
                            ))}
                        </div>
                    </div>
                );
            })}
        </div>
    );
};
