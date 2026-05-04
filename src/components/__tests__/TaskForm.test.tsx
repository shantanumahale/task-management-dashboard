import { screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TaskForm from '../TaskForm';
import { renderWithProviders, MOCK_TASK } from '../../test-utils';

const editState = {
  tasks: { tasks: [MOCK_TASK], nextId: 2, activeTaskId: 'TASK-0001', formMode: 'edit' as const },
};

describe('TaskForm (edit side panel)', () => {
  it('renders nothing when formMode is not edit', () => {
    const { container } = renderWithProviders(<TaskForm />, {
      preloadedState: { tasks: { tasks: [], nextId: 1, activeTaskId: null, formMode: null } },
    });
    expect(container).toBeEmptyDOMElement();
  });

  it('renders nothing when formMode is add', () => {
    const { container } = renderWithProviders(<TaskForm />, {
      preloadedState: { tasks: { tasks: [], nextId: 1, activeTaskId: null, formMode: 'add' } },
    });
    expect(container).toBeEmptyDOMElement();
  });

  it('renders the edit form with the active task data', () => {
    renderWithProviders(<TaskForm />, { preloadedState: editState });
    expect(screen.getByDisplayValue('Test Task')).toBeInTheDocument();
    expect(screen.getByDisplayValue('2099-12-31')).toBeInTheDocument();
  });

  it('renders the Edit Task heading', () => {
    renderWithProviders(<TaskForm />, { preloadedState: editState });
    expect(screen.getByText('Edit Task')).toBeInTheDocument();
  });

  it('shows validation error when title is cleared and saved', () => {
    renderWithProviders(<TaskForm />, { preloadedState: editState });
    const titleInput = screen.getByDisplayValue('Test Task');
    userEvent.clear(titleInput);
    userEvent.click(screen.getByRole('button', { name: /save/i }));
    expect(screen.getByRole('alert')).toHaveTextContent(/title is required/i);
  });

  it('saves changes and closes the form on valid submit', () => {
    const { store } = renderWithProviders(<TaskForm />, { preloadedState: editState });
    const titleInput = screen.getByDisplayValue('Test Task');
    userEvent.clear(titleInput);
    userEvent.type(titleInput, 'Updated Title');
    userEvent.click(screen.getByRole('button', { name: /save/i }));
    const tasks = store.getState().tasks.tasks;
    expect(tasks[0].title).toBe('Updated Title');
    expect(store.getState().tasks.formMode).toBeNull();
  });

  it('closes the form without saving when Escape is pressed', () => {
    const { store } = renderWithProviders(<TaskForm />, { preloadedState: editState });
    fireEvent.keyDown(screen.getByRole('complementary'), { key: 'Escape' });
    expect(store.getState().tasks.formMode).toBeNull();
    expect(store.getState().tasks.tasks[0].title).toBe('Test Task');
  });

  it('closes the form when the X button is clicked', () => {
    const { store } = renderWithProviders(<TaskForm />, { preloadedState: editState });
    userEvent.click(screen.getByRole('button', { name: /close form/i }));
    expect(store.getState().tasks.formMode).toBeNull();
  });

  it('shows a due-date error when date is cleared', () => {
    renderWithProviders(<TaskForm />, { preloadedState: editState });
    const dateInput = screen.getByLabelText(/due date/i);
    userEvent.clear(dateInput);
    userEvent.click(screen.getByRole('button', { name: /save/i }));
    expect(screen.getByRole('alert')).toHaveTextContent(/due date is required/i);
  });
});
