import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  iconColor: string;
  iconBg: string;
  trend?: { value: number; label: string; positive: boolean };
}

export function StatCard({ title, value, subtitle, icon: Icon, trend }: StatCardProps) {
  return (
    <div className="bg-white rounded-xl p-5 border border-gray-200">
      <div className="flex items-start justify-between mb-3">
        <p className="text-sm text-gray-500">{title}</p>
        <Icon className="w-4 h-4 text-gray-400" />
      </div>
      <p className="text-2xl font-semibold text-gray-900 tracking-tight">{value}</p>
      {subtitle && <p className="text-xs text-gray-400 mt-1">{subtitle}</p>}
      {trend && (
        <div className="mt-2 flex items-center gap-1">
          <span className={`text-xs font-medium ${trend.positive ? 'text-emerald-600' : 'text-red-500'}`}>
            {trend.positive ? '↑' : '↓'} {trend.value}%
          </span>
          <span className="text-xs text-gray-400">{trend.label}</span>
        </div>
      )}
    </div>
  );
}
