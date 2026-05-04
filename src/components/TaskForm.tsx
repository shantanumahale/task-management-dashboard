import React, { useEffect, useRef, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { closeForm, updateTask } from '../features/tasks/tasksSlice';
import { TaskStatus } from '../types';
import StatusSelect from './StatusSelect';

const TODAY = new Date().toISOString().split('T')[0];

export default function TaskForm() {
  const dispatch = useAppDispatch();
  const { formMode, activeTaskId, tasks } = useAppSelector((s) => s.tasks);
  const activeTask = tasks.find((t) => t.id === activeTaskId) ?? null;

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<TaskStatus>('PENDING');
  const [dueDate, setDueDate] = useState('');
  const [errors, setErrors] = useState<{ title?: string; dueDate?: string }>({});

  const titleRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (formMode === 'edit' && activeTask) {
      setTitle(activeTask.title);
      setDescription(activeTask.description);
      setStatus(activeTask.status);
      setDueDate(activeTask.dueDate);
      setErrors({});
      titleRef.current?.focus();
    }
  }, [formMode, activeTaskId]); // eslint-disable-line react-hooks/exhaustive-deps

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
    if (activeTask) {
      dispatch(updateTask({ id: activeTask.id, title: title.trim(), description, status, dueDate }));
      dispatch(closeForm());
    }
  };

  if (formMode !== 'edit') return null;

  return (
    <aside
      className="border border-gray-300 dark:border-gray-600 rounded p-4 flex flex-col gap-4 bg-white dark:bg-gray-800 min-w-0" style={{ flex: '3' }}
      aria-label="Edit task"
      onKeyDown={(e) => { if (e.key === 'Escape') dispatch(closeForm()); }}
    >
      <div className="flex items-center justify-between">
        <span className="font-semibold text-sm text-gray-800 dark:text-gray-100">Edit Task</span>
        <button
          onClick={() => dispatch(closeForm())}
          className="text-gray-500 dark:text-gray-400 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white rounded"
          aria-label="Close form"
        >
          <CloseIcon />
        </button>
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="edit-task-title" className="text-xs font-semibold uppercase text-gray-600 dark:text-gray-300">
          Title <span aria-hidden="true">*</span>
        </label>
        <input
          id="edit-task-title"
          ref={titleRef}
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border border-gray-300 dark:border-gray-600 rounded px-2 py-1.5 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
          placeholder="Enter Title"
          aria-required="true"
          aria-describedby={errors.title ? 'edit-title-error' : undefined}
        />
        {errors.title && (
          <span id="edit-title-error" role="alert" className="text-xs text-red-500">{errors.title}</span>
        )}
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="edit-task-status" className="text-xs font-semibold uppercase text-gray-600 dark:text-gray-300">
          Status
        </label>
        <StatusSelect id="edit-task-status" value={status} onChange={setStatus} />
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="edit-task-due-date" className="text-xs font-semibold uppercase text-gray-600 dark:text-gray-300">
          Due Date <span aria-hidden="true">*</span>
        </label>
        <input
          id="edit-task-due-date"
          type="date"
          value={dueDate}
          min={TODAY}
          onChange={(e) => setDueDate(e.target.value)}
          className="border border-gray-300 dark:border-gray-600 rounded px-2 py-1.5 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
          aria-required="true"
          aria-describedby={errors.dueDate ? 'edit-due-date-error' : undefined}
        />
        {errors.dueDate && (
          <span id="edit-due-date-error" role="alert" className="text-xs text-red-500">{errors.dueDate}</span>
        )}
      </div>

      <div className="flex flex-col gap-1 flex-1">
        <label htmlFor="edit-task-description" className="text-xs font-semibold uppercase text-gray-600 dark:text-gray-300">
          Description
        </label>
        <textarea
          id="edit-task-description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="border border-gray-300 dark:border-gray-600 rounded px-2 py-1.5 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 resize-none flex-1 min-h-24 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
          placeholder="Task Description"
        />
      </div>

      <button
        onClick={handleSave}
        className="bg-jira hover:bg-jira-hover text-white rounded py-2 uppercase text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-jira dark:focus:ring-offset-gray-800"
      >
        Save
      </button>
    </aside>
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
