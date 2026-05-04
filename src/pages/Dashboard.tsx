import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { openAddForm, closeForm } from '../features/tasks/tasksSlice';
import SummaryCard from '../components/SummaryCard';
import TaskList from '../components/TaskList';
import TaskForm from '../components/TaskForm';
import TaskFormModal from '../components/TaskFormModal';
import ThemeToggle from '../components/ThemeToggle';
import { TaskStatus } from '../types';

const SUMMARY_ITEMS: { key: TaskStatus | 'TOTAL'; label: string; gradient: string }[] = [
  {
    key: 'PENDING',
    label: 'PENDING',
    gradient: 'bg-gradient-to-br from-gray-100 to-gray-300 text-gray-800 dark:from-gray-700 dark:to-gray-600 dark:text-gray-100',
  },
  {
    key: 'IN_PROGRESS',
    label: 'IN PROGRESS',
    gradient: 'bg-gradient-to-br from-blue-100 to-blue-300 text-blue-900 dark:from-blue-900 dark:to-blue-800 dark:text-blue-100',
  },
  {
    key: 'DONE',
    label: 'DONE',
    gradient: 'bg-gradient-to-br from-green-100 to-green-300 text-green-900 dark:from-green-900 dark:to-green-800 dark:text-green-100',
  },
  {
    key: 'TOTAL',
    label: 'TOTAL',
    gradient: 'bg-gradient-to-br from-slate-100 to-slate-300 text-slate-800 dark:from-slate-800 dark:to-slate-700 dark:text-slate-100',
  },
];

export default function Dashboard() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { tasks } = useAppSelector((s) => s.tasks);

  const counts: Record<string, number> = {
    PENDING: tasks.filter((t) => t.status === 'PENDING').length,
    IN_PROGRESS: tasks.filter((t) => t.status === 'IN_PROGRESS').length,
    DONE: tasks.filter((t) => t.status === 'DONE').length,
    TOTAL: tasks.length,
  };

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6 transition-colors">
      <div className="max-w-screen-xl mx-auto">
        <div className="flex justify-end mb-4">
          <ThemeToggle />
        </div>

        <div className="border border-gray-300 dark:border-gray-700 rounded-lg p-6 flex flex-col gap-6 bg-white dark:bg-gray-800 shadow-sm"
          role="region"
          aria-label="Task Management Dashboard"
        >
          <div className="flex gap-4" role="group" aria-label="Task status summary">
            {SUMMARY_ITEMS.map(({ key, label, gradient }) => (
              <SummaryCard
                key={key}
                label={label}
                count={counts[key]}
                gradientClass={gradient}
                onClick={() => { dispatch(closeForm()); navigate(key === 'TOTAL' ? '/status/ALL' : `/status/${key}`); }}
              />
            ))}
          </div>

          <div className="flex justify-end">
            <button
              onClick={() => dispatch(openAddForm())}
              className="bg-jira hover:bg-jira-hover text-white rounded px-5 py-2 text-sm font-semibold uppercase focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-jira dark:focus:ring-offset-gray-900"
              aria-label="Create a new task"
            >
              CREATE +
            </button>
          </div>

          <div className="flex gap-4">
            <TaskList tasks={tasks} showFilterByStatus={true} />
            <TaskForm />
          </div>
          <TaskFormModal />
        </div>
      </div>
    </main>
  );
}
