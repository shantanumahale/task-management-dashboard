import { useEffect, useRef, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { addTask, closeForm } from '../features/tasks/tasksSlice';
import { TaskStatus } from '../types';
import StatusSelect from './StatusSelect';

const TODAY = new Date().toISOString().split('T')[0];

export default function TaskFormModal() {
  const dispatch = useAppDispatch();
  const { formMode, nextId } = useAppSelector((s) => s.tasks);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<TaskStatus>('PENDING');
  const [dueDate, setDueDate] = useState(TODAY);
  const [errors, setErrors] = useState<{ title?: string; dueDate?: string }>({});

  const titleRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (formMode === 'add') {
      setTitle('');
      setDescription('');
      setStatus('PENDING');
      setDueDate(TODAY);
      setErrors({});
      setTimeout(() => titleRef.current?.focus(), 0);
    }
  }, [formMode]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => { if (e.key === 'Escape') dispatch(closeForm()); };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [dispatch]);

  const validate = () => {
    const errs: { title?: string; dueDate?: string } = {};
    if (!title.trim()) errs.title = 'Title is required.';
    if (!dueDate) errs.dueDate = 'Due date is required.';
    else if (dueDate < TODAY) errs.dueDate = 'Due date cannot be in the past.';
    return errs;
  };

  const handleSave = () => {
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    dispatch(addTask({ title: title.trim(), description, status, dueDate, nextId }));
  };

  if (formMode !== 'add') return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      role="dialog"
      aria-modal="true"
      aria-labelledby="create-task-title"
      onClick={(e) => { if (e.target === e.currentTarget) dispatch(closeForm()); }}
    >
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl w-full max-w-md mx-4 flex flex-col gap-5 p-6">
        <div className="flex items-center justify-between">
          <h2 id="create-task-title" className="font-semibold text-base text-gray-900 dark:text-gray-100">
            Create Task
          </h2>
          <button
            onClick={() => dispatch(closeForm())}
            className="text-gray-500 dark:text-gray-400 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white rounded"
            aria-label="Close dialog"
          >
            <CloseIcon />
          </button>
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="create-task-title-input" className="text-xs font-semibold uppercase text-gray-600 dark:text-gray-300">
            Title <span aria-hidden="true">*</span>
          </label>
          <input
            id="create-task-title-input"
            ref={titleRef}
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="border border-gray-300 dark:border-gray-600 rounded px-3 py-2 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
            placeholder="Enter Title"
            aria-required="true"
            aria-describedby={errors.title ? 'create-title-error' : undefined}
          />
          {errors.title && (
            <span id="create-title-error" role="alert" className="text-xs text-red-500">{errors.title}</span>
          )}
        </div>

        <div className="flex gap-4">
          <div className="flex flex-col gap-1 flex-1">
            <label htmlFor="create-task-status" className="text-xs font-semibold uppercase text-gray-600 dark:text-gray-300">
              Status
            </label>
            <StatusSelect id="create-task-status" value={status} onChange={setStatus} />
          </div>

          <div className="flex flex-col gap-1 flex-1">
            <label htmlFor="create-task-due-date" className="text-xs font-semibold uppercase text-gray-600 dark:text-gray-300">
              Due Date <span aria-hidden="true">*</span>
            </label>
            <input
              id="create-task-due-date"
              type="date"
              value={dueDate}
              min={TODAY}
              onChange={(e) => setDueDate(e.target.value)}
              className="border border-gray-300 dark:border-gray-600 rounded px-3 py-2 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
              aria-required="true"
              aria-describedby={errors.dueDate ? 'create-due-date-error' : undefined}
            />
            {errors.dueDate && (
              <span id="create-due-date-error" role="alert" className="text-xs text-red-500">{errors.dueDate}</span>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="create-task-description" className="text-xs font-semibold uppercase text-gray-600 dark:text-gray-300">
            Description
          </label>
          <textarea
            id="create-task-description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            className="border border-gray-300 dark:border-gray-600 rounded px-3 py-2 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
            placeholder="Task Description"
          />
        </div>

        <div className="flex justify-end gap-3 pt-1">
          <button
            onClick={() => dispatch(closeForm())}
            className="border border-gray-300 dark:border-gray-600 rounded px-5 py-2 text-sm font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="bg-jira hover:bg-jira-hover text-white rounded px-5 py-2 text-sm font-semibold uppercase focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-jira dark:focus:ring-offset-gray-800"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

function CloseIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <line x1="2" y1="2" x2="14" y2="14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <line x1="14" y1="2" x2="2" y2="14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
