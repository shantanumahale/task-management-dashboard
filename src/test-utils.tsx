import React from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { configureStore, combineReducers } from '@reduxjs/toolkit';
import tasksReducer, { TasksState } from './features/tasks/tasksSlice';
import { Task } from './types';

type DeepPartial<T> = { [K in keyof T]?: DeepPartial<T[K]> };

interface RenderConfig extends Omit<RenderOptions, 'wrapper'> {
  preloadedState?: DeepPartial<{ tasks: TasksState }>;
  route?: string;
}

const rootReducer = combineReducers({ tasks: tasksReducer });

export function createTestStore(preloadedState?: DeepPartial<{ tasks: TasksState }>) {
  return configureStore({
    reducer: rootReducer,
    preloadedState: preloadedState as any,
  });
}

export function renderWithProviders(
  ui: React.ReactElement,
  { preloadedState, route = '/', ...renderOptions }: RenderConfig = {}
) {
  const store = createTestStore(preloadedState);

  function Wrapper({ children }: { children: React.ReactNode }) {
    return (
      <Provider store={store}>
        <MemoryRouter initialEntries={[route]}>{children}</MemoryRouter>
      </Provider>
    );
  }

  return { store, ...render(ui, { wrapper: Wrapper, ...renderOptions }) };
}

export const MOCK_TASK: Task = {
  id: 'TASK-0001',
  title: 'Test Task',
  description: 'A test description',
  status: 'PENDING',
  dueDate: '2099-12-31',
  createdAt: '2026-01-01T00:00:00.000Z',
};

export const MOCK_TASK_2: Task = {
  id: 'TASK-0002',
  title: 'Second Task',
  description: 'Another description',
  status: 'IN_PROGRESS',
  dueDate: '2099-06-15',
  createdAt: '2026-01-02T00:00:00.000Z',
};

export const MOCK_TASK_3: Task = {
  id: 'TASK-0003',
  title: 'Done Task',
  description: 'Finished',
  status: 'DONE',
  dueDate: '2099-03-10',
  createdAt: '2026-01-03T00:00:00.000Z',
};
