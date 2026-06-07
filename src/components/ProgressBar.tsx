interface ProgressBarProps {
  value: number;
  showLabel?: boolean;
  height?: 'thin' | 'normal';
}

export function ProgressBar({ value, showLabel = true, height = 'normal' }: ProgressBarProps) {
  const color =
    value === 100
      ? 'bg-green-500'
      : value >= 60
      ? 'bg-blue-500'
      : value >= 30
      ? 'bg-amber-500'
      : 'bg-red-400';

  const h = height === 'thin' ? 'h-1.5' : 'h-2';

  return (
    <div className="flex items-center gap-2">
      <div className={`flex-1 bg-gray-100 rounded-full ${h} overflow-hidden`}>
        <div
          className={`${h} rounded-full transition-all ${color}`}
          style={{ width: `${value}%` }}
        />
      </div>
      {showLabel && <span className="text-xs text-gray-500 w-8 text-right">{value}%</span>}
    </div>
  );
}
