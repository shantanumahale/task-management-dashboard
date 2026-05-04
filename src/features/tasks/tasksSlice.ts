import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Task, TaskStatus, FormMode } from '../../types';

export interface TasksState {
  tasks: Task[];
  nextId: number;
  activeTaskId: string | null;
  formMode: FormMode;
}

const initialState: TasksState = {
  tasks: [],
  nextId: 1,
  activeTaskId: null,
  formMode: null,
};

const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    addTask: {
      reducer(state, action: PayloadAction<Task>) {
        state.tasks.unshift(action.payload);
        state.nextId += 1;
        state.formMode = null;
        state.activeTaskId = null;
      },
      prepare(payload: Omit<Task, 'id' | 'createdAt'> & { nextId: number }) {
        const { nextId, ...rest } = payload;
        return {
          payload: {
            ...rest,
            id: `TASK-${String(nextId).padStart(4, '0')}`,
            createdAt: new Date().toISOString(),
          },
        };
      },
    },
    updateTask(state, action: PayloadAction<Partial<Task> & { id: string }>) {
      const idx = state.tasks.findIndex((t) => t.id === action.payload.id);
      if (idx !== -1) {
        state.tasks[idx] = { ...state.tasks[idx], ...action.payload };
      }
    },
    deleteTask(state, action: PayloadAction<string>) {
      state.tasks = state.tasks.filter((t) => t.id !== action.payload);
      if (state.activeTaskId === action.payload) {
        state.activeTaskId = null;
        state.formMode = null;
      }
    },
    openEditForm(state, action: PayloadAction<string>) {
      state.activeTaskId = action.payload;
      state.formMode = 'edit';
    },
    openAddForm(state) {
      state.activeTaskId = null;
      state.formMode = 'add';
    },
    closeForm(state) {
      state.activeTaskId = null;
      state.formMode = null;
    },
    updateTaskStatus(state, action: PayloadAction<{ id: string; status: TaskStatus }>) {
      const task = state.tasks.find((t) => t.id === action.payload.id);
      if (task) task.status = action.payload.status;
    },
  },
});

export const {
  addTask,
  updateTask,
  deleteTask,
  openEditForm,
  openAddForm,
  closeForm,
  updateTaskStatus,
} = tasksSlice.actions;

export default tasksSlice.reducer;
