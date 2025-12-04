import { Plus } from 'lucide-react';
import { useUIStore } from '../../store/useUIStore';

export const AddTask = () => {
    const { openModal } = useUIStore();

    return (
        <button
            onClick={() => openModal('task')}
            className="flex items-center gap-2 text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors py-2 px-2 -ml-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 w-full text-left"
        >
            <div className="w-5 h-5 rounded-full flex items-center justify-center text-primary-500">
                <Plus size={18} />
            </div>
            <span className="text-sm">Add task</span>
        </button>
    );
};
