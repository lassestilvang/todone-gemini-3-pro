import { useEffect, useState } from 'react';
import { Layout } from './components/layout/Layout';
import { useSeedData } from './hooks/useSeedData';
import { useProjectStore } from './store/useProjectStore';
import { useTaskStore } from './store/useTaskStore';
import { useLabelStore } from './store/useLabelStore';
import { useFilterStore } from './store/useFilterStore';
import { useSettingsStore } from './store/useSettingsStore';
import { TaskList } from './components/tasks/TaskList';
import { CommandPalette } from './components/search/CommandPalette';
import { filterTasks } from './lib/filter';

import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';

import { BoardView } from './components/tasks/BoardView';
import { CalendarView } from './components/tasks/CalendarView';
import { LayoutGrid, List, Calendar as CalendarIcon } from 'lucide-react';

function App() {
  const { theme } = useSettingsStore();

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');

    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      root.classList.add(systemTheme);
    } else {
      root.classList.add(theme);
    }
  }, [theme]);

  useSeedData();
  const { projects, fetchProjects } = useProjectStore();
  const { tasks, fetchTasks } = useTaskStore();
  const { labels, fetchLabels } = useLabelStore();
  const { fetchFilters } = useFilterStore();

  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [viewType, setViewType] = useState<'list' | 'board' | 'calendar'>('list');

  const filteredTasks = filterTasks(tasks, '', labels, projects); // Placeholder for actual query state

  useEffect(() => {
    fetchProjects();
    fetchTasks();
    fetchLabels();
    fetchFilters();
  }, [fetchProjects, fetchTasks, fetchLabels, fetchFilters]);

  useKeyboardShortcuts([
    {
      key: 'k',
      meta: true,
      handler: () => setIsCommandPaletteOpen(true),
      description: 'Open Command Palette'
    },
    {
      key: 'q',
      handler: () => {
        // TODO: Focus quick add
        const quickAddBtn = document.querySelector('[aria-label="Quick Add"]') as HTMLButtonElement;
        quickAddBtn?.click();
      },
      description: 'Quick Add Task'
    }
  ]);

  return (
    <Layout>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Inbox</h1>
          <p className="text-gray-500">Tasks without a project</p>
        </div>

        <div className="flex bg-gray-100 p-1 rounded-lg">
          <button
            onClick={() => setViewType('list')}
            className={`p-2 rounded-md transition-colors ${viewType === 'list' ? 'bg-white shadow-sm text-primary-600' : 'text-gray-500 hover:text-gray-700'}`}
          >
            <List size={18} />
          </button>
          <button
            onClick={() => setViewType('board')}
            className={`p-2 rounded-md transition-colors ${viewType === 'board' ? 'bg-white shadow-sm text-primary-600' : 'text-gray-500 hover:text-gray-700'}`}
          >
            <LayoutGrid size={18} />
          </button>
          <button
            onClick={() => setViewType('calendar')}
            className={`p-2 rounded-md transition-colors ${viewType === 'calendar' ? 'bg-white shadow-sm text-primary-600' : 'text-gray-500 hover:text-gray-700'}`}
          >
            <CalendarIcon size={18} />
          </button>
          <button
            onClick={() => setViewType('settings')}
            className={`p-2 rounded-md transition-colors ${viewType === 'settings' ? 'bg-white shadow-sm text-primary-600' : 'text-gray-500 hover:text-gray-700'}`}
            title="Settings"
          >
            <Settings size={18} />
          </button>
        </div>
      </div>

      {viewType === 'list' && <TaskList />}
      {viewType === 'board' && <BoardView tasks={filteredTasks} />}
      {viewType === 'calendar' && <CalendarView tasks={filteredTasks} />}
      {viewType === 'settings' && <SettingsPage />}

      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
      />
    </Layout>
  );
}

export default App;
