export type TaskStatus = 'PENDING' | 'IN_PROGRESS' | 'DONE';

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  dueDate: string; // YYYY-MM-DD
  createdAt: string;
}

export type FormMode = 'add' | 'edit' | null;
