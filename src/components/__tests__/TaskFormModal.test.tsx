import { screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TaskFormModal from '../TaskFormModal';
import { renderWithProviders } from '../../test-utils';

const TODAY = new Date().toISOString().split('T')[0];

const addState = {
  tasks: { tasks: [], nextId: 1, activeTaskId: null, formMode: 'add' as const },
};

describe('TaskFormModal (create modal)', () => {
  it('renders nothing when formMode is not add', () => {
    const { container } = renderWithProviders(<TaskFormModal />, {
      preloadedState: { tasks: { tasks: [], nextId: 1, activeTaskId: null, formMode: null } },
    });
    expect(container).toBeEmptyDOMElement();
  });

  it('renders the create dialog when formMode is add', () => {
    renderWithProviders(<TaskFormModal />, { preloadedState: addState });
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('Create Task')).toBeInTheDocument();
  });

  it('pre-populates the due date with today', () => {
    renderWithProviders(<TaskFormModal />, { preloadedState: addState });
    expect(screen.getByLabelText(/due date/i)).toHaveValue(TODAY);
  });

  it('defaults status to PENDING', () => {
    renderWithProviders(<TaskFormModal />, { preloadedState: addState });
    expect(screen.getByRole('button', { name: /status: pending/i })).toBeInTheDocument();
  });

  it('shows title required error on empty submit', () => {
    renderWithProviders(<TaskFormModal />, { preloadedState: addState });
    userEvent.click(screen.getByRole('button', { name: /^save$/i }));
    expect(screen.getByRole('alert')).toHaveTextContent(/title is required/i);
  });

  it('creates a task and closes the modal on valid submit', () => {
    const { store } = renderWithProviders(<TaskFormModal />, { preloadedState: addState });
    userEvent.type(screen.getByPlaceholderText(/enter title/i), 'My New Task');
    userEvent.click(screen.getByRole('button', { name: /^save$/i }));
    const tasks = store.getState().tasks.tasks;
    expect(tasks).toHaveLength(1);
    expect(tasks[0].title).toBe('My New Task');
    expect(tasks[0].id).toBe('TASK-0001');
    expect(store.getState().tasks.formMode).toBeNull();
  });

  it('increments nextId after creating a task', () => {
    const { store } = renderWithProviders(<TaskFormModal />, { preloadedState: addState });
    userEvent.type(screen.getByPlaceholderText(/enter title/i), 'Task');
    userEvent.click(screen.getByRole('button', { name: /^save$/i }));
    expect(store.getState().tasks.nextId).toBe(2);
  });

  it('closes the modal when Cancel is clicked without saving', () => {
    const { store } = renderWithProviders(<TaskFormModal />, { preloadedState: addState });
    userEvent.click(screen.getByRole('button', { name: /cancel/i }));
    expect(store.getState().tasks.formMode).toBeNull();
    expect(store.getState().tasks.tasks).toHaveLength(0);
  });

  it('closes the modal on Escape', () => {
    const { store } = renderWithProviders(<TaskFormModal />, { preloadedState: addState });
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(store.getState().tasks.formMode).toBeNull();
  });

  it('closes the modal when clicking the backdrop', () => {
    const { store } = renderWithProviders(<TaskFormModal />, { preloadedState: addState });
    fireEvent.click(screen.getByRole('dialog'));
    expect(store.getState().tasks.formMode).toBeNull();
  });

  it('closes the modal when the X button is clicked', () => {
    const { store } = renderWithProviders(<TaskFormModal />, { preloadedState: addState });
    userEvent.click(screen.getByRole('button', { name: /close dialog/i }));
    expect(store.getState().tasks.formMode).toBeNull();
  });

  it('has aria-modal and aria-labelledby on the dialog', () => {
    renderWithProviders(<TaskFormModal />, { preloadedState: addState });
    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveAttribute('aria-modal', 'true');
    expect(dialog).toHaveAttribute('aria-labelledby', 'create-task-title');
  });
});
