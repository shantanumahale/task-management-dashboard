import { screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TaskList from '../TaskList';
import { renderWithProviders, MOCK_TASK, MOCK_TASK_2, MOCK_TASK_3 } from '../../test-utils';

const THREE_TASKS = [MOCK_TASK, MOCK_TASK_2, MOCK_TASK_3];

const stateWithTasks = {
  tasks: { tasks: THREE_TASKS, nextId: 4, activeTaskId: null, formMode: null as null },
};

describe('TaskList', () => {
  describe('rendering', () => {
    it('renders all provided tasks', () => {
      renderWithProviders(<TaskList tasks={THREE_TASKS} />, { preloadedState: stateWithTasks });
      expect(screen.getByText('Test Task')).toBeInTheDocument();
      expect(screen.getByText('Second Task')).toBeInTheDocument();
      expect(screen.getByText('Done Task')).toBeInTheDocument();
    });

    it('shows empty message when no tasks match', () => {
      renderWithProviders(<TaskList tasks={[]} />, {
        preloadedState: { tasks: { tasks: [], nextId: 1, activeTaskId: null, formMode: null } },
      });
      expect(screen.getByRole('status')).toHaveTextContent(/no tasks found/i);
    });

    it('renders a search input', () => {
      renderWithProviders(<TaskList tasks={[]} />);
      expect(screen.getByRole('searchbox')).toBeInTheDocument();
    });

    it('renders Sort By Date button', () => {
      renderWithProviders(<TaskList tasks={[]} />);
      expect(screen.getByRole('button', { name: /sort by date/i })).toBeInTheDocument();
    });

    it('renders Filter By Status button when showFilterByStatus is true', () => {
      renderWithProviders(<TaskList tasks={[]} showFilterByStatus={true} />);
      expect(screen.getByRole('button', { name: /filter by status/i })).toBeInTheDocument();
    });

    it('does not render Filter By Status when showFilterByStatus is false', () => {
      renderWithProviders(<TaskList tasks={[]} showFilterByStatus={false} />);
      expect(screen.queryByRole('button', { name: /filter by status/i })).not.toBeInTheDocument();
    });

    it('shows the add placeholder row when formMode is add', () => {
      renderWithProviders(<TaskList tasks={[]} />, {
        preloadedState: { tasks: { tasks: [], nextId: 1, activeTaskId: null, formMode: 'add' } },
      });
      expect(screen.getByLabelText(/new task placeholder/i)).toBeInTheDocument();
    });
  });

  describe('search', () => {
    it('filters tasks by title', () => {
      renderWithProviders(<TaskList tasks={THREE_TASKS} />, { preloadedState: stateWithTasks });
      userEvent.type(screen.getByRole('searchbox'), 'Second');
      expect(screen.getByText('Second Task')).toBeInTheDocument();
      expect(screen.queryByText('Test Task')).not.toBeInTheDocument();
    });

    it('filters tasks by task ID', () => {
      renderWithProviders(<TaskList tasks={THREE_TASKS} />, { preloadedState: stateWithTasks });
      userEvent.type(screen.getByRole('searchbox'), 'TASK-0002');
      expect(screen.getByText('Second Task')).toBeInTheDocument();
      expect(screen.queryByText('Test Task')).not.toBeInTheDocument();
    });

    it('search is case-insensitive', () => {
      renderWithProviders(<TaskList tasks={THREE_TASKS} />, { preloadedState: stateWithTasks });
      userEvent.type(screen.getByRole('searchbox'), 'done task');
      expect(screen.getByText('Done Task')).toBeInTheDocument();
    });
  });

  describe('sort by date', () => {
    it('opens sort dropdown when Sort By Date is clicked', () => {
      renderWithProviders(<TaskList tasks={THREE_TASKS} />, { preloadedState: stateWithTasks });
      userEvent.click(screen.getByRole('button', { name: /sort by date/i }));
      expect(screen.getByRole('listbox', { name: /sort order/i })).toBeInTheDocument();
    });

    it('sorts oldest first when that radio is selected', () => {
      renderWithProviders(<TaskList tasks={THREE_TASKS} />, { preloadedState: stateWithTasks });
      userEvent.click(screen.getByRole('button', { name: /sort by date/i }));
      userEvent.click(screen.getByLabelText('Oldest First'));
      const rows = screen.getAllByRole('row');
      expect(rows[0]).toHaveTextContent('Done Task'); // 2099-03-10 is earliest
    });

    it('sorts newest first when that radio is selected', () => {
      renderWithProviders(<TaskList tasks={THREE_TASKS} />, { preloadedState: stateWithTasks });
      userEvent.click(screen.getByRole('button', { name: /sort by date/i }));
      userEvent.click(screen.getByLabelText('Newest First'));
      const rows = screen.getAllByRole('row');
      expect(rows[0]).toHaveTextContent('Test Task'); // 2099-12-31 is latest
    });

    it('closes the sort dropdown after a selection', () => {
      renderWithProviders(<TaskList tasks={[]} />);
      userEvent.click(screen.getByRole('button', { name: /sort by date/i }));
      userEvent.click(screen.getByLabelText('Oldest First'));
      expect(screen.queryByRole('listbox', { name: /sort order/i })).not.toBeInTheDocument();
    });
  });

  describe('filter by status', () => {
    it('opens filter dropdown when Filter By Status is clicked', () => {
      renderWithProviders(<TaskList tasks={THREE_TASKS} showFilterByStatus={true} />, { preloadedState: stateWithTasks });
      userEvent.click(screen.getByRole('button', { name: /filter by status/i }));
      expect(screen.getByRole('group', { name: /filter by status/i })).toBeInTheDocument();
    });

    it('shows all status checkboxes', () => {
      renderWithProviders(<TaskList tasks={THREE_TASKS} showFilterByStatus={true} />, { preloadedState: stateWithTasks });
      userEvent.click(screen.getByRole('button', { name: /filter by status/i }));
      expect(screen.getByRole('checkbox', { name: /pending/i })).toBeChecked();
      expect(screen.getByRole('checkbox', { name: /in progress/i })).toBeChecked();
      expect(screen.getByRole('checkbox', { name: /done/i })).toBeChecked();
    });

    it('filters out tasks when a status is unchecked', () => {
      renderWithProviders(<TaskList tasks={THREE_TASKS} showFilterByStatus={true} />, { preloadedState: stateWithTasks });
      userEvent.click(screen.getByRole('button', { name: /filter by status/i }));
      userEvent.click(screen.getByRole('checkbox', { name: /pending/i }));
      expect(screen.queryByText('Test Task')).not.toBeInTheDocument();
      expect(screen.getByText('Second Task')).toBeInTheDocument();
    });

    it('updates the button label to show count of active filters', () => {
      renderWithProviders(<TaskList tasks={THREE_TASKS} showFilterByStatus={true} />, { preloadedState: stateWithTasks });
      userEvent.click(screen.getByRole('button', { name: /filter by status/i }));
      userEvent.click(screen.getByRole('checkbox', { name: /pending/i }));
      expect(screen.getByRole('button', { name: /filter by status \(2\)/i })).toBeInTheDocument();
    });
  });
});
