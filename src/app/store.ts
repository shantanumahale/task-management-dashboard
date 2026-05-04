import { configureStore } from '@reduxjs/toolkit';
import tasksReducer, { TasksState } from '../features/tasks/tasksSlice';

const STORAGE_KEY = 'task_mgmt_state';

function loadPersistedState(): Pick<TasksState, 'tasks' | 'nextId'> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return { tasks: [], nextId: 1 };
}

const { tasks, nextId } = loadPersistedState();

const store = configureStore({
  reducer: { tasks: tasksReducer },
  preloadedState: {
    tasks: { tasks, nextId, activeTaskId: null, formMode: null },
  },
});

store.subscribe(() => {
  const { tasks: t, nextId: n } = store.getState().tasks;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ tasks: t, nextId: n }));
  } catch {}
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
