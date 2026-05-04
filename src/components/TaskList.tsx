import { useEffect, useRef, useState } from 'react';
import { useAppSelector } from '../app/hooks';
import { Task, TaskStatus } from '../types';
import TaskCard from './TaskCard';

type SortOrder = 'asc' | 'desc' | 'none';

const ALL_STATUSES: TaskStatus[] = ['PENDING', 'IN_PROGRESS', 'DONE'];
const STATUS_LABELS: Record<TaskStatus, string> = {
  PENDING: 'PENDING',
  IN_PROGRESS: 'IN PROGRESS',
  DONE: 'DONE',
};

interface Props {
  tasks: Task[];
  showFilterByStatus?: boolean;
}

export default function TaskList({ tasks, showFilterByStatus = true }: Props) {
  const { activeTaskId, formMode } = useAppSelector((s) => s.tasks);

  const [search, setSearch] = useState('');
  const [sortOrder, setSortOrder] = useState<SortOrder>('none');
  const [filterStatuses, setFilterStatuses] = useState<TaskStatus[]>([...ALL_STATUSES]);
  const [sortOpen, setSortOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);

  const sortRef = useRef<HTMLDivElement>(null);
  const filterRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (sortRef.current && !sortRef.current.contains(e.target as Node)) setSortOpen(false);
      if (filterRef.current && !filterRef.current.contains(e.target as Node)) setFilterOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const toggleStatus = (s: TaskStatus) => {
    setFilterStatuses((prev) =>
      prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]
    );
  };

  const filtered = tasks.filter((t) => {
    const matchesSearch =
      t.id.toLowerCase().includes(search.toLowerCase()) ||
      t.title.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = showFilterByStatus ? filterStatuses.includes(t.status) : true;
    return matchesSearch && matchesStatus;
  });

  const sorted = [...filtered].sort((a, b) => {
    if (sortOrder === 'asc') return a.dueDate.localeCompare(b.dueDate);
    if (sortOrder === 'desc') return b.dueDate.localeCompare(a.dueDate);
    return 0;
  });

  const activeStatuses = ALL_STATUSES.filter((s) => filterStatuses.includes(s));
  const filterLabel =
    showFilterByStatus && activeStatuses.length < ALL_STATUSES.length
      ? `Filter By Status (${activeStatuses.length})`
      : 'Filter By Status';

  const SortIcon = sortOrder === 'asc' ? UpArrow : sortOrder === 'desc' ? DownArrow : null;

  return (
    <div className="flex flex-col gap-3 min-w-0" style={{ flex: '7' }}>
      <div className="flex items-center gap-4 flex-wrap">
        <div className="relative flex-1 min-w-48">
          <label htmlFor="task-search" className="sr-only">Search by Task ID or Task Title</label>
          <input
            id="task-search"
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search based on Task ID or Task Title"
            className="border border-gray-300 dark:border-gray-600 rounded px-3 py-2 text-sm w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
          />
        </div>

        <div className="relative" ref={sortRef}>
          <button
            onClick={() => { setSortOpen((o) => !o); setFilterOpen(false); }}
            className="flex items-center gap-1 text-sm text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white rounded px-1"
            aria-haspopup="listbox"
            aria-expanded={sortOpen}
          >
            Sort By Date {SortIcon && <SortIcon />}
          </button>

          {sortOpen && (
            <div
              role="listbox"
              aria-label="Sort order"
              className="absolute left-0 top-full mt-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 z-20 w-40 p-2 shadow-md"
              onKeyDown={(e) => { if (e.key === 'Escape') setSortOpen(false); }}
            >
              {(['none', 'asc', 'desc'] as const).map((opt) => (
                <label
                  key={opt}
                  className="flex items-center gap-2 py-1 px-1 cursor-pointer text-sm text-gray-800 dark:text-gray-200"
                >
                  <input
                    type="radio"
                    name="sort-order"
                    value={opt}
                    checked={sortOrder === opt}
                    onChange={() => { setSortOrder(opt); setSortOpen(false); }}
                    className="accent-jira"
                  />
                  {opt === 'none' ? 'None' : opt === 'asc' ? 'Oldest First' : 'Newest First'}
                </label>
              ))}
            </div>
          )}
        </div>

        {showFilterByStatus && (
          <div className="relative" ref={filterRef}>
            <button
              onClick={() => { setFilterOpen((o) => !o); setSortOpen(false); }}
              className="text-sm text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white rounded px-1"
              aria-haspopup="listbox"
              aria-expanded={filterOpen}
            >
              {filterLabel}
            </button>

            {filterOpen && (
              <div
                role="group"
                aria-label="Filter by status"
                className="absolute left-0 top-full mt-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 z-20 w-44 p-2 shadow-md"
                onKeyDown={(e) => { if (e.key === 'Escape') setFilterOpen(false); }}
              >
                {ALL_STATUSES.map((s) => (
                  <label
                    key={s}
                    className="flex items-center gap-2 py-1 px-1 cursor-pointer text-sm text-gray-800 dark:text-gray-200"
                  >
                    <input
                      type="checkbox"
                      checked={filterStatuses.includes(s)}
                      onChange={() => toggleStatus(s)}
                      className="accent-jira"
                    />
                    {STATUS_LABELS[s]}
                  </label>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      <div role="grid" aria-label="Task list" className="flex flex-col gap-2">
        {sorted.length === 0 && (
          <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4" role="status">
            No tasks found.
          </p>
        )}
        {sorted.map((task) => (
          <TaskCard key={task.id} task={task} isActive={task.id === activeTaskId} />
        ))}

        {formMode === 'add' && (
          <div
            className="border border-dashed border-blue-300 dark:border-blue-700 rounded px-3 py-3 bg-blue-50 dark:bg-gray-700"
            aria-label="New task placeholder"
            aria-live="polite"
          />
        )}
      </div>

    </div>
  );
}

function UpArrow() {
  return (
    <svg width="11" height="11" viewBox="0 0 12 12" fill="none" aria-hidden="true">
      <path d="M6 10V2M2 6l4-4 4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function DownArrow() {
  return (
    <svg width="11" height="11" viewBox="0 0 12 12" fill="none" aria-hidden="true">
      <path d="M6 2v8M2 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
