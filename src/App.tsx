import { useEffect } from 'react';
import { Layout } from './components/layout/Layout';
import { useSeedData } from './hooks/useSeedData';
import { useProjectStore } from './store/useProjectStore';
import { useTaskStore } from './store/useTaskStore';
import { useLabelStore } from './store/useLabelStore';
import { useFilterStore } from './store/useFilterStore';
import { TaskList } from './components/tasks/TaskList';
import { filterTasks } from './lib/filter';

function App() {
  useSeedData();
  const { projects, fetchProjects } = useProjectStore();
  const { tasks, fetchTasks } = useTaskStore();
  const { labels, fetchLabels } = useLabelStore();
  const { fetchFilters } = useFilterStore();



  const filteredTasks = filterTasks(tasks, '', labels, projects); // Placeholder for actual query state

  useEffect(() => {
    fetchProjects();
    fetchTasks();
    fetchLabels();
    fetchFilters();
  }, [fetchProjects, fetchTasks, fetchLabels, fetchFilters]);

  return (
    <Layout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Inbox</h1>
        <p className="text-gray-500">Tasks without a project</p>
      </div>

      <TaskList tasks={filteredTasks} />
    </Layout>
  );
}

export default App;
