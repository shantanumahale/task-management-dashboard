import { screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TaskCard from '../TaskCard';
import { renderWithProviders, MOCK_TASK } from '../../test-utils';
import { openEditForm } from '../../features/tasks/tasksSlice';

describe('TaskCard', () => {
  it('renders task ID, title, and formatted due date', () => {
    renderWithProviders(<TaskCard task={MOCK_TASK} isActive={false} />);
    expect(screen.getByText('TASK-0001')).toBeInTheDocument();
    expect(screen.getByText('Test Task')).toBeInTheDocument();
    expect(screen.getByText('31/12/2099')).toBeInTheDocument();
  });

  it('renders the status select with current status', () => {
    renderWithProviders(<TaskCard task={MOCK_TASK} isActive={false} />);
    expect(screen.getByRole('button', { name: /status: pending/i })).toBeInTheDocument();
  });

  it('renders edit and delete buttons', () => {
    renderWithProviders(<TaskCard task={MOCK_TASK} isActive={false} />);
    expect(screen.getByRole('button', { name: /edit task: test task/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /delete task: test task/i })).toBeInTheDocument();
  });

  it('applies active styling when isActive is true', () => {
    renderWithProviders(<TaskCard task={MOCK_TASK} isActive={true} />);
    const row = screen.getByRole('row');
    expect(row).toHaveAttribute('aria-selected', 'true');
  });

  it('dispatches openEditForm when the row is clicked', () => {
    const { store } = renderWithProviders(<TaskCard task={MOCK_TASK} isActive={false} />);
    userEvent.click(screen.getByRole('row'));
    expect(store.getState().tasks.activeTaskId).toBe('TASK-0001');
    expect(store.getState().tasks.formMode).toBe('edit');
  });

  it('dispatches openEditForm when the edit (pencil) button is clicked', () => {
    const { store } = renderWithProviders(<TaskCard task={MOCK_TASK} isActive={false} />);
    userEvent.click(screen.getByRole('button', { name: /edit task/i }));
    expect(store.getState().tasks.activeTaskId).toBe('TASK-0001');
  });

  it('dispatches openEditForm on Enter key on the row', () => {
    const { store } = renderWithProviders(<TaskCard task={MOCK_TASK} isActive={false} />);
    fireEvent.keyDown(screen.getByRole('row'), { key: 'Enter' });
    expect(store.getState().tasks.activeTaskId).toBe('TASK-0001');
  });

  it('dispatches openEditForm on Space key on the row', () => {
    const { store } = renderWithProviders(<TaskCard task={MOCK_TASK} isActive={false} />);
    fireEvent.keyDown(screen.getByRole('row'), { key: ' ' });
    expect(store.getState().tasks.activeTaskId).toBe('TASK-0001');
  });

  it('shows delete confirmation modal when delete button is clicked', () => {
    renderWithProviders(<TaskCard task={MOCK_TASK} isActive={false} />);
    userEvent.click(screen.getByRole('button', { name: /delete task/i }));
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText(/are you sure you want to delete this task/i)).toBeInTheDocument();
  });

  it('removes task from store when delete is confirmed', () => {
    const { store } = renderWithProviders(<TaskCard task={MOCK_TASK} isActive={false} />, {
      preloadedState: { tasks: { tasks: [MOCK_TASK], nextId: 2, activeTaskId: null, formMode: null } },
    });
    userEvent.click(screen.getByRole('button', { name: /delete task/i }));
    userEvent.click(screen.getByRole('button', { name: /^delete$/i }));
    expect(store.getState().tasks.tasks).toHaveLength(0);
  });

  it('closes delete modal without deleting when cancel is clicked', () => {
    const { store } = renderWithProviders(<TaskCard task={MOCK_TASK} isActive={false} />, {
      preloadedState: { tasks: { tasks: [MOCK_TASK], nextId: 2, activeTaskId: null, formMode: null } },
    });
    userEvent.click(screen.getByRole('button', { name: /delete task/i }));
    userEvent.click(screen.getByRole('button', { name: /cancel/i }));
    expect(store.getState().tasks.tasks).toHaveLength(1);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('updates task status via the inline status select', () => {
    const { store } = renderWithProviders(<TaskCard task={MOCK_TASK} isActive={false} />, {
      preloadedState: { tasks: { tasks: [MOCK_TASK], nextId: 2, activeTaskId: null, formMode: null } },
    });
    userEvent.click(screen.getByRole('button', { name: /status: pending/i }));
    userEvent.click(screen.getByRole('option', { name: 'DONE' }));
    expect(store.getState().tasks.tasks[0].status).toBe('DONE');
  });

  it('formats dates as DD/MM/YYYY', () => {
    const task = { ...MOCK_TASK, dueDate: '2026-07-04' };
    renderWithProviders(<TaskCard task={task} isActive={false} />);
    expect(screen.getByText('04/07/2026')).toBeInTheDocument();
  });
});
