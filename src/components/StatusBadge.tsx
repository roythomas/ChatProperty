interface StatusBadgeProps {
  status: string;
  size?: 'sm' | 'md';
}

const dotColor: Record<string, string> = {
  Occupied: 'bg-emerald-500',
  Vacant: 'bg-gray-300',
  'Under Renovation': 'bg-amber-500',
  Reserved: 'bg-indigo-400',
  Active: 'bg-emerald-500',
  Expired: 'bg-red-400',
  Terminated: 'bg-gray-300',
  Completed: 'bg-emerald-500',
  'In Progress': 'bg-indigo-400',
  Planned: 'bg-gray-400',
  'On Hold': 'bg-red-400',
  'Not Started': 'bg-gray-300',
  Excellent: 'bg-emerald-500',
  Good: 'bg-indigo-400',
  Fair: 'bg-amber-500',
  Poor: 'bg-red-400',
  Villa: 'bg-indigo-400',
  Apartment: 'bg-blue-400',
  Townhouse: 'bg-violet-400',
  Commercial: 'bg-orange-400',
  Pending: 'bg-gray-400',
};

export function StatusBadge({ status, size = 'md' }: StatusBadgeProps) {
  const dot = dotColor[status] ?? 'bg-gray-300';
  const sz = size === 'sm' ? 'text-xs gap-1.5' : 'text-xs gap-1.5';
  return (
    <span className={`inline-flex items-center ${sz} text-gray-600 font-medium whitespace-nowrap`}>
      <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${dot}`} />
      {status}
    </span>
  );
}
