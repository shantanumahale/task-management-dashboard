import React, { useState } from 'react';
import { Task, TaskStatus } from '../types';
import { useAppDispatch } from '../app/hooks';
import { openEditForm, updateTaskStatus, deleteTask } from '../features/tasks/tasksSlice';
import DeleteModal from './DeleteModal';
import StatusSelect from './StatusSelect';

interface Props {
  task: Task;
  isActive: boolean;
}

function formatDate(iso: string): string {
  if (!iso) return '';
  const [y, m, d] = iso.split('-');
  return `${d}/${m}/${y}`;
}

export default function TaskCard({ task, isActive }: Props) {
  const dispatch = useAppDispatch();
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleEdit = (e: React.MouseEvent | React.KeyboardEvent) => {
    e.stopPropagation();
    dispatch(openEditForm(task.id));
  };

  return (
    <>
      <div
        role="row"
        className={`flex items-center gap-3 border rounded px-3 py-2 cursor-pointer focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition-colors ${
          isActive
            ? 'bg-blue-50 border-blue-300 dark:bg-gray-700 dark:border-gray-500'
            : 'bg-white border-gray-300 dark:bg-gray-800 dark:border-gray-600'
        }`}
        tabIndex={0}
        aria-selected={isActive}
        onClick={() => dispatch(openEditForm(task.id))}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); dispatch(openEditForm(task.id)); }
        }}
      >
        <span className="text-xs text-gray-400 dark:text-gray-500 shrink-0 w-24 truncate font-mono" title={task.id}>
          {task.id}
        </span>

        <span className="flex-1 text-sm text-gray-900 dark:text-gray-100 truncate">{task.title}</span>

        <span className="text-sm text-gray-500 dark:text-gray-400 shrink-0 tabular-nums">
          {formatDate(task.dueDate)}
        </span>

        <div onClick={(e) => e.stopPropagation()} className="shrink-0">
          <StatusSelect
            value={task.status}
            onChange={(s: TaskStatus) => dispatch(updateTaskStatus({ id: task.id, status: s }))}
          />
        </div>

        <button
          onClick={handleEdit}
          className="shrink-0 p-1 rounded text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-100 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
          aria-label={`Edit task: ${task.title}`}
        >
          <PencilIcon />
        </button>

        <button
          onClick={(e) => { e.stopPropagation(); setShowDeleteModal(true); }}
          className="shrink-0 p-1 rounded text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
          aria-label={`Delete task: ${task.title}`}
        >
          <TrashIcon />
        </button>
      </div>

      {showDeleteModal && (
        <DeleteModal
          onConfirm={() => { dispatch(deleteTask(task.id)); setShowDeleteModal(false); }}
          onCancel={() => setShowDeleteModal(false)}
        />
      )}
    </>
  );
}

function PencilIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M11.5 2.5l2 2-8 8H3.5v-2l8-8z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M9.5 4.5l2 2" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <rect x="3" y="5" width="10" height="9" rx="1" stroke="currentColor" strokeWidth="1.5" />
      <path d="M1 5h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M6 5V3h4v2" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  );
}
