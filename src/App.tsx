import { useEffect } from 'react';
import { Layout } from './components/layout/Layout';
import { useSeedData } from './hooks/useSeedData';
import { useProjectStore } from './store/useProjectStore';
import { useTaskStore } from './store/useTaskStore';
import { TaskList } from './components/tasks/TaskList';

function App() {
  useSeedData();
  const { fetchProjects } = useProjectStore();
  const { tasks, fetchTasks } = useTaskStore();

  useEffect(() => {
    fetchProjects();
    fetchTasks();
  }, [fetchProjects, fetchTasks]);

  return (
    <Layout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Inbox</h1>
        <p className="text-gray-500">Tasks without a project</p>
      </div>

      <TaskList tasks={tasks} />
    </Layout>
  );
}

export default App;
