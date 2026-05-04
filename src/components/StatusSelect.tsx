import React, { useEffect, useRef, useState } from 'react';
import { TaskStatus } from '../types';

export const STATUS_CONFIG: Record<TaskStatus, { label: string; pill: string }> = {
  PENDING: {
    label: 'PENDING',
    pill: 'bg-gray-200 text-gray-700 dark:bg-gray-600 dark:text-gray-100',
  },
  IN_PROGRESS: {
    label: 'IN PROGRESS',
    pill: 'bg-jira text-white',
  },
  DONE: {
    label: 'DONE',
    pill: 'bg-green-500 text-white',
  },
};

const OPTION_CLASS = 'bg-white text-gray-800 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-100 dark:hover:bg-gray-700';

const ALL_STATUSES = Object.keys(STATUS_CONFIG) as TaskStatus[];

interface Props {
  value: TaskStatus;
  onChange: (s: TaskStatus) => void;
  id?: string;
}

export default function StatusSelect({ value, onChange, id }: Props) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const optionsRef = useRef<(HTMLButtonElement | null)[]>([]);

  useEffect(() => {
    const handleOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') { setOpen(false); return; }
    if (!open) {
      if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown') {
        e.preventDefault();
        setOpen(true);
        setTimeout(() => optionsRef.current[0]?.focus(), 0);
      }
      return;
    }
    const idx = ALL_STATUSES.indexOf(value);
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      optionsRef.current[Math.min(idx + 1, ALL_STATUSES.length - 1)]?.focus();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      optionsRef.current[Math.max(idx - 1, 0)]?.focus();
    }
  };

  return (
    <div ref={containerRef} className="relative inline-block" onKeyDown={handleKeyDown}>
      <button
        id={id}
        onClick={(e) => { e.stopPropagation(); setOpen((o) => !o); }}
        className={`flex items-center gap-1.5 px-2 py-1 rounded text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-black dark:focus:ring-white ${STATUS_CONFIG[value].pill}`}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={`Status: ${STATUS_CONFIG[value].label}`}
      >
        {STATUS_CONFIG[value].label}
        <ChevronIcon open={open} />
      </button>

      {open && (
        <div
          role="listbox"
          aria-label="Select status"
          className="absolute left-0 top-full mt-1 z-30 rounded border border-gray-200 dark:border-gray-600 shadow-md overflow-hidden w-36"
        >
          {ALL_STATUSES.map((s, i) => (
            <button
              key={s}
              ref={(el) => { optionsRef.current[i] = el; }}
              role="option"
              aria-selected={s === value}
              onClick={(e) => { e.stopPropagation(); onChange(s); setOpen(false); }}
              className={`w-full text-left px-3 py-2 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-inset focus:ring-black dark:focus:ring-white ${OPTION_CLASS}`}
            >
              {STATUS_CONFIG[s].label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg
      width="10"
      height="10"
      viewBox="0 0 10 10"
      fill="none"
      aria-hidden="true"
      style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.15s' }}
    >
      <path d="M2 3.5l3 3 3-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
