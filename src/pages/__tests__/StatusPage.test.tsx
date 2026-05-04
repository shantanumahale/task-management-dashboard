import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Routes, Route, MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import StatusPage from '../StatusPage';
import { createTestStore, MOCK_TASK, MOCK_TASK_2, MOCK_TASK_3 } from '../../test-utils';
import { TasksState } from '../../features/tasks/tasksSlice';

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

function renderStatusPage(route: string, tasksState?: Partial<TasksState>) {
  const store = createTestStore({
    tasks: {
      tasks: [MOCK_TASK, MOCK_TASK_2, MOCK_TASK_3],
      nextId: 4,
      activeTaskId: null,
      formMode: null,
      ...tasksState,
    },
  });
  return {
    store,
    ...render(
      <Provider store={store}>
        <MemoryRouter initialEntries={[route]}>
          <Routes>
            <Route path="/status/:status" element={<StatusPage />} />
          </Routes>
        </MemoryRouter>
      </Provider>
    ),
  };
}

describe('StatusPage', () => {
  it('shows only PENDING tasks on /status/PENDING route', () => {
    renderStatusPage('/status/PENDING');
    expect(screen.getByText('Test Task')).toBeInTheDocument();
    expect(screen.queryByText('Second Task')).not.toBeInTheDocument();
    expect(screen.queryByText('Done Task')).not.toBeInTheDocument();
  });

  it('shows only IN_PROGRESS tasks on /status/IN_PROGRESS route', () => {
    renderStatusPage('/status/IN_PROGRESS');
    expect(screen.queryByText('Test Task')).not.toBeInTheDocument();
    expect(screen.getByText('Second Task')).toBeInTheDocument();
    expect(screen.queryByText('Done Task')).not.toBeInTheDocument();
  });

  it('shows only DONE tasks on /status/DONE route', () => {
    renderStatusPage('/status/DONE');
    expect(screen.queryByText('Test Task')).not.toBeInTheDocument();
    expect(screen.queryByText('Second Task')).not.toBeInTheDocument();
    expect(screen.getByText('Done Task')).toBeInTheDocument();
  });

  it('shows all tasks on /status/ALL route', () => {
    renderStatusPage('/status/ALL');
    expect(screen.getByText('Test Task')).toBeInTheDocument();
    expect(screen.getByText('Second Task')).toBeInTheDocument();
    expect(screen.getByText('Done Task')).toBeInTheDocument();
  });

  it('displays the current status label', () => {
    renderStatusPage('/status/DONE');
    const labels = screen.getAllByText('DONE');
    expect(labels.length).toBeGreaterThan(0);
  });

  it('displays "All Tasks" label for ALL route', () => {
    renderStatusPage('/status/ALL');
    expect(screen.getByText('All Tasks')).toBeInTheDocument();
  });

  it('renders all four summary cards', () => {
    renderStatusPage('/status/ALL');
    expect(screen.getByRole('button', { name: /pending: 1 tasks/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /total: 3 tasks/i })).toBeInTheDocument();
  });

  it('renders Back to Dashboard button', () => {
    renderStatusPage('/status/PENDING');
    expect(screen.getByRole('button', { name: /back to dashboard/i })).toBeInTheDocument();
  });

  it('does not show Filter By Status control', () => {
    renderStatusPage('/status/ALL');
    expect(screen.queryByRole('button', { name: /filter by status/i })).not.toBeInTheDocument();
  });

  it('dispatches closeForm when a summary card is clicked', () => {
    const { store } = renderStatusPage('/status/ALL', {
      activeTaskId: 'TASK-0001',
      formMode: 'edit',
    });
    userEvent.click(screen.getByRole('button', { name: /total: 3 tasks/i }));
    expect(store.getState().tasks.formMode).toBeNull();
    expect(store.getState().tasks.activeTaskId).toBeNull();
  });

  it('dispatches closeForm when Back to Dashboard is clicked', () => {
    const { store } = renderStatusPage('/status/PENDING', {
      activeTaskId: 'TASK-0001',
      formMode: 'edit',
    });
    userEvent.click(screen.getByRole('button', { name: /back to dashboard/i }));
    expect(store.getState().tasks.formMode).toBeNull();
  });
});
