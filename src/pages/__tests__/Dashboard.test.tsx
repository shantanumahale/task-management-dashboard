import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Dashboard from '../Dashboard';
import { renderWithProviders, MOCK_TASK, MOCK_TASK_2, MOCK_TASK_3 } from '../../test-utils';

beforeEach(() => {
  localStorage.clear();
  document.documentElement.classList.remove('dark');
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation((query: string) => ({
      matches: false,
      media: query,
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
    })),
  });
});

const threeTaskState = {
  tasks: {
    tasks: [MOCK_TASK, MOCK_TASK_2, MOCK_TASK_3],
    nextId: 4,
    activeTaskId: null as null,
    formMode: null as null,
  },
};

describe('Dashboard', () => {
  it('renders the dashboard region', () => {
    renderWithProviders(<Dashboard />, { preloadedState: threeTaskState });
    expect(screen.getByRole('region', { name: /task management dashboard/i })).toBeInTheDocument();
  });

  it('renders all four summary cards', () => {
    renderWithProviders(<Dashboard />, { preloadedState: threeTaskState });
    expect(screen.getByRole('button', { name: /pending: 1 tasks/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /in progress: 1 tasks/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /done: 1 tasks/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /total: 3 tasks/i })).toBeInTheDocument();
  });

  it('renders the CREATE + button', () => {
    renderWithProviders(<Dashboard />);
    expect(screen.getByRole('button', { name: /create a new task/i })).toBeInTheDocument();
  });

  it('opens the create modal when CREATE + is clicked', () => {
    renderWithProviders(<Dashboard />);
    userEvent.click(screen.getByRole('button', { name: /create a new task/i }));
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('Create Task')).toBeInTheDocument();
  });

  it('renders task list with tasks from state', () => {
    renderWithProviders(<Dashboard />, { preloadedState: threeTaskState });
    expect(screen.getByText('Test Task')).toBeInTheDocument();
    expect(screen.getByText('Second Task')).toBeInTheDocument();
  });

  it('shows task counts correctly in summary cards', () => {
    renderWithProviders(<Dashboard />, { preloadedState: threeTaskState });
    expect(screen.getByRole('button', { name: /pending: 1 tasks/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /total: 3 tasks/i })).toBeInTheDocument();
  });

  it('opens the edit form when a task is clicked', () => {
    const { store } = renderWithProviders(<Dashboard />, { preloadedState: threeTaskState });
    userEvent.click(screen.getByText('Test Task'));
    expect(store.getState().tasks.activeTaskId).toBe('TASK-0001');
    expect(store.getState().tasks.formMode).toBe('edit');
  });

  it('dispatches closeForm when navigating via a summary card', () => {
    const { store } = renderWithProviders(<Dashboard />, {
      preloadedState: {
        tasks: { ...threeTaskState.tasks, activeTaskId: 'TASK-0001', formMode: 'edit' as const },
      },
    });
    userEvent.click(screen.getByRole('button', { name: /pending: 1 tasks/i }));
    expect(store.getState().tasks.formMode).toBeNull();
    expect(store.getState().tasks.activeTaskId).toBeNull();
  });

  it('renders the theme toggle button', () => {
    renderWithProviders(<Dashboard />);
    expect(screen.getByRole('button', { name: /switch to/i })).toBeInTheDocument();
  });
});
