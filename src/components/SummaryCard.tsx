interface Props {
  label: string;
  count: number;
  gradientClass: string;
  onClick: () => void;
}

export default function SummaryCard({ label, count, gradientClass, onClick }: Props) {
  return (
    <button
      onClick={onClick}
      className={`flex-1 rounded p-5 text-center focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white border border-transparent ${gradientClass}`}
      aria-label={`${label}: ${count} tasks. Click to view.`}
    >
      <div className="text-xs font-bold uppercase tracking-widest opacity-70">{label}</div>
      <div className="text-5xl font-bold mt-2">{count}</div>
    </button>
  );
}
