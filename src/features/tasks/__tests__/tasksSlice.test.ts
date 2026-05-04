import tasksReducer, {
  addTask,
  updateTask,
  deleteTask,
  openEditForm,
  openAddForm,
  closeForm,
  updateTaskStatus,
  TasksState,
} from '../tasksSlice';

const baseState: TasksState = {
  tasks: [],
  nextId: 1,
  activeTaskId: null,
  formMode: null,
};

const existingTask = {
  id: 'TASK-0001',
  title: 'Existing',
  description: 'desc',
  status: 'PENDING' as const,
  dueDate: '2099-12-31',
  createdAt: '2026-01-01T00:00:00.000Z',
};

describe('tasksSlice reducers', () => {
  describe('addTask', () => {
    it('prepends the new task to the front of the list', () => {
      const stateWithTask = { ...baseState, tasks: [existingTask], nextId: 2 };
      const action = addTask({ title: 'New', description: '', status: 'PENDING', dueDate: '2099-01-01', nextId: 2 });
      const next = tasksReducer(stateWithTask, action);
      expect(next.tasks[0].title).toBe('New');
      expect(next.tasks[1]).toEqual(existingTask);
    });

    it('formats the ID as TASK-XXXX with zero-padding', () => {
      const action = addTask({ title: 'T', description: '', status: 'PENDING', dueDate: '2099-01-01', nextId: 1 });
      const next = tasksReducer(baseState, action);
      expect(next.tasks[0].id).toBe('TASK-0001');
    });

    it('pads IDs beyond single digits correctly', () => {
      const action = addTask({ title: 'T', description: '', status: 'IN_PROGRESS', dueDate: '2099-01-01', nextId: 42 });
      const next = tasksReducer(baseState, action);
      expect(next.tasks[0].id).toBe('TASK-0042');
    });

    it('increments nextId after adding', () => {
      const action = addTask({ title: 'T', description: '', status: 'PENDING', dueDate: '2099-01-01', nextId: 1 });
      const next = tasksReducer(baseState, action);
      expect(next.nextId).toBe(2);
    });

    it('resets formMode and activeTaskId after adding', () => {
      const state = { ...baseState, formMode: 'add' as const, activeTaskId: null };
      const action = addTask({ title: 'T', description: '', status: 'PENDING', dueDate: '2099-01-01', nextId: 1 });
      const next = tasksReducer(state, action);
      expect(next.formMode).toBeNull();
      expect(next.activeTaskId).toBeNull();
    });

    it('sets createdAt to an ISO timestamp', () => {
      const before = Date.now();
      const action = addTask({ title: 'T', description: '', status: 'DONE', dueDate: '2099-01-01', nextId: 1 });
      const next = tasksReducer(baseState, action);
      const createdAt = new Date(next.tasks[0].createdAt).getTime();
      expect(createdAt).toBeGreaterThanOrEqual(before);
    });
  });

  describe('updateTask', () => {
    it('updates the matching task fields', () => {
      const state = { ...baseState, tasks: [existingTask] };
      const next = tasksReducer(state, updateTask({ id: 'TASK-0001', title: 'Updated', status: 'DONE' }));
      expect(next.tasks[0].title).toBe('Updated');
      expect(next.tasks[0].status).toBe('DONE');
    });

    it('preserves other fields on partial update', () => {
      const state = { ...baseState, tasks: [existingTask] };
      const next = tasksReducer(state, updateTask({ id: 'TASK-0001', title: 'Only Title Changed' }));
      expect(next.tasks[0].description).toBe('desc');
      expect(next.tasks[0].dueDate).toBe('2099-12-31');
    });

    it('does nothing when ID does not match', () => {
      const state = { ...baseState, tasks: [existingTask] };
      const next = tasksReducer(state, updateTask({ id: 'TASK-9999', title: 'Ghost' }));
      expect(next.tasks[0]).toEqual(existingTask);
    });
  });

  describe('deleteTask', () => {
    it('removes the task with the given ID', () => {
      const state = { ...baseState, tasks: [existingTask] };
      const next = tasksReducer(state, deleteTask('TASK-0001'));
      expect(next.tasks).toHaveLength(0);
    });

    it('clears activeTaskId and formMode when the active task is deleted', () => {
      const state = { ...baseState, tasks: [existingTask], activeTaskId: 'TASK-0001', formMode: 'edit' as const };
      const next = tasksReducer(state, deleteTask('TASK-0001'));
      expect(next.activeTaskId).toBeNull();
      expect(next.formMode).toBeNull();
    });

    it('preserves activeTaskId when a different task is deleted', () => {
      const second = { ...existingTask, id: 'TASK-0002', title: 'Second' };
      const state = { ...baseState, tasks: [existingTask, second], activeTaskId: 'TASK-0001', formMode: 'edit' as const };
      const next = tasksReducer(state, deleteTask('TASK-0002'));
      expect(next.activeTaskId).toBe('TASK-0001');
      expect(next.tasks).toHaveLength(1);
    });
  });

  describe('openEditForm', () => {
    it('sets activeTaskId and formMode to edit', () => {
      const next = tasksReducer(baseState, openEditForm('TASK-0001'));
      expect(next.activeTaskId).toBe('TASK-0001');
      expect(next.formMode).toBe('edit');
    });
  });

  describe('openAddForm', () => {
    it('clears activeTaskId and sets formMode to add', () => {
      const state = { ...baseState, activeTaskId: 'TASK-0001', formMode: 'edit' as const };
      const next = tasksReducer(state, openAddForm());
      expect(next.activeTaskId).toBeNull();
      expect(next.formMode).toBe('add');
    });
  });

  describe('closeForm', () => {
    it('clears both activeTaskId and formMode', () => {
      const state = { ...baseState, activeTaskId: 'TASK-0001', formMode: 'edit' as const };
      const next = tasksReducer(state, closeForm());
      expect(next.activeTaskId).toBeNull();
      expect(next.formMode).toBeNull();
    });
  });

  describe('updateTaskStatus', () => {
    it('updates only the status of the matching task', () => {
      const state = { ...baseState, tasks: [existingTask] };
      const next = tasksReducer(state, updateTaskStatus({ id: 'TASK-0001', status: 'DONE' }));
      expect(next.tasks[0].status).toBe('DONE');
    });

    it('leaves other fields unchanged', () => {
      const state = { ...baseState, tasks: [existingTask] };
      const next = tasksReducer(state, updateTaskStatus({ id: 'TASK-0001', status: 'IN_PROGRESS' }));
      expect(next.tasks[0].title).toBe('Existing');
      expect(next.tasks[0].description).toBe('desc');
    });

    it('does nothing for an unknown ID', () => {
      const state = { ...baseState, tasks: [existingTask] };
      const next = tasksReducer(state, updateTaskStatus({ id: 'TASK-9999', status: 'DONE' }));
      expect(next.tasks[0].status).toBe('PENDING');
    });
  });
});
