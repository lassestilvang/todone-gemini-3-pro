import { useEffect, useState } from 'react';
import { Layout } from './components/layout/Layout';
import { useSeedData } from './hooks/useSeedData';
import { useProjectStore } from './store/useProjectStore';
import { useTaskStore } from './store/useTaskStore';
import { useLabelStore } from './store/useLabelStore';
import { useFilterStore } from './store/useFilterStore';
import { useSettingsStore } from './store/useSettingsStore';
import { useUIStore } from './store/useUIStore';
import { TaskList } from './components/tasks/TaskList';
import { CommandPalette } from './components/search/CommandPalette';
import { filterTasks } from './lib/filter';

import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';

import { BoardView } from './components/tasks/BoardView';
import { CalendarView } from './components/tasks/CalendarView';
import { SettingsPage } from './components/settings/SettingsPage';
import { AddProjectModal } from './components/projects/AddProjectModal';
import { AddLabelModal } from './components/labels/AddLabelModal';
import { AddFilterModal } from './components/search/AddFilterModal';
import { LayoutGrid, List, Calendar as CalendarIcon, Settings } from 'lucide-react';

function App() {
  const { theme } = useSettingsStore();
  const { viewType, setViewType, activeContext } = useUIStore();

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');

    const applyTheme = () => {
      if (theme === 'system') {
        const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        root.classList.remove('light', 'dark'); // Ensure clean slate
        root.classList.add(systemTheme);
      } else {
        root.classList.remove('light', 'dark'); // Ensure clean slate
        root.classList.add(theme);
      }
    };

    applyTheme();

    if (theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = () => applyTheme();
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, [theme]);

  useSeedData();
  const { projects, fetchProjects } = useProjectStore();
  const { tasks, fetchTasks } = useTaskStore();
  const { labels, fetchLabels } = useLabelStore();
  const { filters, fetchFilters } = useFilterStore();

  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);

  // Derive query from activeContext
  let query = '';
  let title = 'Inbox';
  let description = 'Tasks without a project';

  switch (activeContext.type) {
    case 'inbox':
      query = '#inbox'; // Assuming inbox is treated as a project or default
      title = 'Inbox';
      description = 'Tasks without a project';
      break;
    case 'today':
      query = 'today';
      title = 'Today';
      description = 'Tasks due today';
      break;
    case 'upcoming':
      query = 'tomorrow'; // Or a broader upcoming query if supported
      title = 'Upcoming';
      description = 'Tasks due soon';
      break;
    case 'project':
      const project = projects.find(p => p.id === activeContext.id);
      if (project) {
        query = `#${project.name}`;
        title = project.name;
        description = 'Project tasks';
      }
      break;
    case 'label':
      const label = labels.find(l => l.id === activeContext.id);
      if (label) {
        query = `@${label.name}`;
        title = label.name;
        description = 'Label tasks';
      }
      break;
    case 'filter':
      const filter = filters.find(f => f.id === activeContext.id);
      if (filter) {
        query = filter.query;
        title = filter.name;
        description = 'Filtered tasks';
      }
      break;
  }

  // Special handling for Inbox if it's not a real project in DB but a concept
  // If filterTasks treats empty query as all tasks, we need to be careful.
  // Let's assume filterTasks handles these queries.
  // Actually, looking at filter.ts:
  // if (!query.trim()) return tasks;
  // So for inbox, we might need a specific logic if it's "no project".
  // filter.ts doesn't seem to have "no project" filter explicitly unless we add it.
  // But wait, "Inbox" usually means `!task.projectId` or `task.projectId === 'inbox'`.
  // In `AddTask.tsx`, we set `projectId: 'inbox'`.
  // So `#inbox` should work if we have a project named "Inbox" OR if we handle it.
  // `filter.ts` handles `#project` by name.
  // If "Inbox" is not in `projects` array, `#inbox` won't match unless we add a virtual project or update filter.ts.
  // Let's check `useProjectStore` or `seedData`.
  // For now, let's assume `projectId` is 'inbox' for inbox tasks.
  // And `filter.ts` checks `project && task.projectId === project.id`.
  // If "Inbox" project doesn't exist in DB, this fails.
  // We might need to update `filter.ts` to handle `#inbox` specifically or ensure Inbox exists.
  // Or just filter manually here for Inbox?
  // Let's stick to `query` for now and maybe update `filter.ts` if needed.
  // Actually, for Inbox, let's pass a special query or handle it in `filterTasks`.

  // Refined logic for Inbox:
  if (activeContext.type === 'inbox') {
    // If we want to filter by "no project" or "inbox project"
    // Let's assume we want tasks with projectId === 'inbox'
    // We can pass a custom query that filter.ts understands?
    // Or we can filter here?
    // filterTasks returns tasks.
    // Let's update filter.ts to handle 'is:inbox' or similar?
    // Or just rely on the fact that we might have an Inbox project?
    // Let's try to use a specific filter logic in App for now if filter.ts is limited.
    // But `filterTasks` is used.
    // Let's update `filter.ts` to handle `is:inbox`?
    // Or just use `projectId` check if `activeContext.type === 'inbox'`.
  }

  const filteredTasks = filterTasks(tasks, query, labels, projects);

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
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{title}</h1>
          <p className="text-gray-500 dark:text-gray-400">{description}</p>
        </div>

        <div className="flex bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
          <button
            onClick={() => setViewType('list')}
            className={`p-2 rounded-md transition-colors ${viewType === 'list' ? 'bg-white dark:bg-gray-700 shadow-sm text-primary-600 dark:text-primary-400' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'}`}
          >
            <List size={18} />
          </button>
          <button
            onClick={() => setViewType('board')}
            className={`p-2 rounded-md transition-colors ${viewType === 'board' ? 'bg-white dark:bg-gray-700 shadow-sm text-primary-600 dark:text-primary-400' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'}`}
          >
            <LayoutGrid size={18} />
          </button>
          <button
            onClick={() => setViewType('calendar')}
            className={`p-2 rounded-md transition-colors ${viewType === 'calendar' ? 'bg-white dark:bg-gray-700 shadow-sm text-primary-600 dark:text-primary-400' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'}`}
          >
            <CalendarIcon size={18} />
          </button>
          <button
            onClick={() => setViewType('settings')}
            className={`p-2 rounded-md transition-colors ${viewType === 'settings' ? 'bg-white dark:bg-gray-700 shadow-sm text-primary-600 dark:text-primary-400' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'}`}
            title="Settings"
          >
            <Settings size={18} />
          </button>
        </div>
      </div>

      {viewType === 'list' && <TaskList tasks={filteredTasks} />}
      {viewType === 'board' && <BoardView tasks={filteredTasks} />}
      {viewType === 'calendar' && <CalendarView tasks={filteredTasks} />}
      {viewType === 'settings' && <SettingsPage />}

      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
      />

      <AddProjectModal />
      <AddLabelModal />
      <AddFilterModal />
    </Layout>
  );
}

export default App;
