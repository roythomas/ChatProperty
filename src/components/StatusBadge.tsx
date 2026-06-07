interface StatusBadgeProps {
  status: string;
  size?: 'sm' | 'md';
}

const colorMap: Record<string, string> = {
  Occupied: 'bg-green-100 text-green-800',
  Vacant: 'bg-gray-100 text-gray-700',
  'Under Renovation': 'bg-amber-100 text-amber-800',
  Reserved: 'bg-blue-100 text-blue-800',
  Active: 'bg-green-100 text-green-800',
  Expired: 'bg-red-100 text-red-800',
  Terminated: 'bg-gray-100 text-gray-700',
  Completed: 'bg-green-100 text-green-800',
  'In Progress': 'bg-blue-100 text-blue-800',
  Planned: 'bg-purple-100 text-purple-800',
  'On Hold': 'bg-red-100 text-red-800',
  'Not Started': 'bg-gray-100 text-gray-700',
  Excellent: 'bg-green-100 text-green-800',
  Good: 'bg-blue-100 text-blue-800',
  Fair: 'bg-amber-100 text-amber-800',
  Poor: 'bg-red-100 text-red-800',
  Villa: 'bg-purple-100 text-purple-800',
  Apartment: 'bg-blue-100 text-blue-800',
  Townhouse: 'bg-indigo-100 text-indigo-800',
  Commercial: 'bg-orange-100 text-orange-800',
  Pending: 'bg-gray-100 text-gray-600',
};

export function StatusBadge({ status, size = 'md' }: StatusBadgeProps) {
  const color = colorMap[status] ?? 'bg-gray-100 text-gray-700';
  const sizeClass = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs';
  return (
    <span className={`inline-flex items-center rounded-full font-medium ${sizeClass} ${color}`}>
      {status}
    </span>
  );
}
