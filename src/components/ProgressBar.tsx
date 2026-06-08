interface ProgressBarProps {
  value: number;
  showLabel?: boolean;
  height?: 'thin' | 'normal';
}

export function ProgressBar({ value, showLabel = true, height = 'normal' }: ProgressBarProps) {
  const h = height === 'thin' ? 'h-1' : 'h-1.5';
  const color = value === 100 ? 'bg-emerald-500' : value >= 50 ? 'bg-indigo-500' : 'bg-amber-400';

  return (
    <div className="flex items-center gap-2">
      <div className={`flex-1 bg-gray-100 rounded-full ${h} overflow-hidden`}>
        <div className={`${h} rounded-full transition-all ${color}`} style={{ width: `${value}%` }} />
      </div>
      {showLabel && <span className="text-xs text-gray-400 w-8 text-right tabular-nums">{value}%</span>}
    </div>
  );
}
