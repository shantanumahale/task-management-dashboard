import { useEffect, useRef } from 'react';

interface Props {
  onConfirm: () => void;
  onCancel: () => void;
}

export default function DeleteModal({ onConfirm, onCancel }: Props) {
  const cancelRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    cancelRef.current?.focus();
    const handleKeyDown = (e: KeyboardEvent) => { if (e.key === 'Escape') onCancel(); };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onCancel]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      role="dialog"
      aria-modal="true"
      aria-labelledby="delete-modal-title"
    >
      <div className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded p-8 w-80 relative shadow-xl">
        <button
          onClick={onCancel}
          className="absolute top-3 right-3 text-gray-500 dark:text-gray-400 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white rounded"
          aria-label="Close dialog"
        >
          <CloseIcon />
        </button>

        <p id="delete-modal-title" className="text-center font-semibold text-base mb-6 text-gray-900 dark:text-gray-100">
          Are you sure you want to delete this task?
        </p>

        <div className="flex gap-4 justify-center">
          <button
            ref={cancelRef}
            onClick={onCancel}
            className="border border-gray-400 dark:border-gray-500 rounded px-6 py-2 uppercase text-sm font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="border border-red-400 rounded px-6 py-2 uppercase text-sm font-semibold bg-red-50 text-red-700 hover:bg-red-100 dark:bg-red-900/30 dark:text-red-400 dark:border-red-700 dark:hover:bg-red-900/50 focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            Delete
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
