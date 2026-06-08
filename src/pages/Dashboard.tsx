import { Building2, Home, Wrench, DollarSign, TrendingUp, Users, AlertCircle, CheckCircle } from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line,
} from 'recharts';
import { properties, renovations, monthlyRevenueData, occupancyTrendData } from '../data/mockData';
import { StatCard } from '../components/StatCard';
import { StatusBadge } from '../components/StatusBadge';
import { ProgressBar } from '../components/ProgressBar';

const PIE_COLORS = ['#10B981', '#9CA3AF', '#F59E0B', '#6366F1'];

export function Dashboard() {
  const allUnits = properties.flatMap(p => p.units);
  const totalUnits = allUnits.length;
  const occupied = allUnits.filter(u => u.status === 'Occupied').length;
  const vacant = allUnits.filter(u => u.status === 'Vacant').length;
  const underRenovation = allUnits.filter(u => u.status === 'Under Renovation').length;
  const reserved = allUnits.filter(u => u.status === 'Reserved').length;
  const monthlyRevenue = allUnits.filter(u => u.status === 'Occupied' && u.lease).reduce((s, u) => s + u.monthlyRent, 0);
  const occupancyRate = Math.round((occupied / totalUnits) * 100);
  const activeRenovations = renovations.filter(r => r.status === 'In Progress').length;
  const completedRenovations = renovations.filter(r => r.status === 'Completed').length;
  const onHoldRenovations = renovations.filter(r => r.status === 'On Hold').length;
  const recentRenovations = renovations.slice(0, 5);

  const occupancyPieData = [
    { name: 'Occupied', value: occupied },
    { name: 'Vacant', value: vacant },
    { name: 'Under Renovation', value: underRenovation },
    { name: 'Reserved', value: reserved },
  ];

  const renovationTypeData = renovations.reduce<Record<string, number>>((acc, r) => {
    acc[r.type] = (acc[r.type] ?? 0) + 1;
    return acc;
  }, {});
  const renovationChartData = Object.entries(renovationTypeData).map(([name, count]) => ({ name: name.split(' ').slice(0, 2).join(' '), count }));

  return (
    <div className="p-6 space-y-6 max-w-[1400px]">
      {/* Header */}
      <div>
        <h1 className="text-xl font-semibold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-500 mt-0.5">Portfolio overview · June 2026</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Properties" value={properties.length} subtitle={`${totalUnits} total units`}
          icon={Building2} iconColor="" iconBg=""
          trend={{ value: 0, label: 'this month', positive: true }} />
        <StatCard title="Occupied Units" value={occupied} subtitle={`${occupancyRate}% occupancy rate`}
          icon={Home} iconColor="" iconBg=""
          trend={{ value: 4, label: 'vs last month', positive: true }} />
        <StatCard title="Monthly Revenue" value={`AED ${(monthlyRevenue / 1000).toFixed(0)}K`}
          subtitle="From occupied units" icon={DollarSign} iconColor="" iconBg=""
          trend={{ value: 3.2, label: 'vs last month', positive: true }} />
        <StatCard title="Active Renovations" value={activeRenovations}
          subtitle={`${onHoldRenovations} on hold · ${completedRenovations} done`}
          icon={Wrench} iconColor="" iconBg="" />
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { icon: Users, label: 'Active Tenants', value: allUnits.filter(u => u.tenant).length },
          { icon: AlertCircle, label: 'Vacant Units', value: vacant },
          { icon: CheckCircle, label: 'Renovations Done', value: completedRenovations },
        ].map(({ icon: Icon, label, value }) => (
          <div key={label} className="bg-white rounded-xl p-4 border border-gray-200 flex items-center gap-3">
            <Icon className="w-5 h-5 text-gray-400 flex-shrink-0" />
            <div>
              <p className="text-xl font-semibold text-gray-900">{value}</p>
              <p className="text-xs text-gray-500">{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 bg-white rounded-xl p-5 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-medium text-gray-900 text-sm">Monthly Revenue</h3>
              <p className="text-xs text-gray-400 mt-0.5">2025 revenue vs target (AED)</p>
            </div>
            <TrendingUp className="w-4 h-4 text-emerald-500" />
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={monthlyRevenueData} barGap={2}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#9CA3AF' }} axisLine={false} tickLine={false} tickFormatter={v => `${(v / 1000).toFixed(0)}K`} />
              <Tooltip formatter={(v: number) => [`AED ${v.toLocaleString()}`, '']} contentStyle={{ borderRadius: 8, border: '1px solid #E5E7EB', boxShadow: 'none', fontSize: 12 }} />
              <Bar dataKey="revenue" name="Revenue" fill="#6366F1" radius={[3, 3, 0, 0]} />
              <Bar dataKey="target" name="Target" fill="#F3F4F6" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl p-5 border border-gray-200">
          <h3 className="font-medium text-gray-900 text-sm mb-0.5">Unit Status</h3>
          <p className="text-xs text-gray-400 mb-4">All properties</p>
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie data={occupancyPieData} cx="50%" cy="50%" innerRadius={45} outerRadius={72} paddingAngle={2} dataKey="value">
                {occupancyPieData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i]} />)}
              </Pie>
              <Tooltip formatter={(v: number) => [v, 'Units']} contentStyle={{ borderRadius: 8, border: '1px solid #E5E7EB', boxShadow: 'none', fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-2 mt-1">
            {occupancyPieData.map((entry, i) => (
              <div key={entry.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: PIE_COLORS[i] }} />
                  <span className="text-gray-500">{entry.name}</span>
                </div>
                <span className="font-medium text-gray-900 tabular-nums">{entry.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl p-5 border border-gray-200">
          <h3 className="font-medium text-gray-900 text-sm mb-0.5">Occupancy Trend</h3>
          <p className="text-xs text-gray-400 mb-4">Monthly rate (%)</p>
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={occupancyTrendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
              <YAxis domain={[70, 100]} tick={{ fontSize: 11, fill: '#9CA3AF' }} axisLine={false} tickLine={false} tickFormatter={v => `${v}%`} />
              <Tooltip formatter={(v: number) => [`${v}%`, 'Occupancy']} contentStyle={{ borderRadius: 8, border: '1px solid #E5E7EB', boxShadow: 'none', fontSize: 12 }} />
              <Line type="monotone" dataKey="occupancy" stroke="#6366F1" strokeWidth={2} dot={false} activeDot={{ r: 4, fill: '#6366F1' }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl p-5 border border-gray-200">
          <h3 className="font-medium text-gray-900 text-sm mb-0.5">Renovations by Type</h3>
          <p className="text-xs text-gray-400 mb-4">Number of tasks</p>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={renovationChartData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 11, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
              <YAxis dataKey="name" type="category" tick={{ fontSize: 11, fill: '#9CA3AF' }} axisLine={false} tickLine={false} width={75} />
              <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid #E5E7EB', boxShadow: 'none', fontSize: 12 }} />
              <Bar dataKey="count" name="Count" fill="#6366F1" radius={[0, 3, 3, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl p-5 border border-gray-200">
          <h3 className="font-medium text-gray-900 text-sm mb-4">Property Summary</h3>
          <div className="space-y-4">
            {properties.map(property => {
              const propOccupied = property.units.filter(u => u.status === 'Occupied').length;
              const propOccupancyRate = Math.round((propOccupied / property.totalUnits) * 100);
              const propRevenue = property.units.filter(u => u.status === 'Occupied').reduce((s, u) => s + u.monthlyRent, 0);
              return (
                <div key={property.id} className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Building2 className="w-4 h-4 text-gray-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <p className="font-medium text-gray-800 text-sm truncate">{property.name}</p>
                      <span className="text-xs text-gray-400 ml-2 flex-shrink-0 tabular-nums">{propOccupied}/{property.totalUnits}</span>
                    </div>
                    <ProgressBar value={propOccupancyRate} height="thin" showLabel={false} />
                    <p className="text-xs text-gray-400 mt-1">AED {propRevenue.toLocaleString()} / mo</p>
                  </div>
                  <StatusBadge status={property.type} size="sm" />
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 border border-gray-200">
          <h3 className="font-medium text-gray-900 text-sm mb-4">Recent Renovations</h3>
          <div className="space-y-2">
            {recentRenovations.map(r => (
              <div key={r.id} className="flex items-center gap-3 p-3 rounded-lg bg-gray-50">
                <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 mt-0.5 ${
                  r.status === 'Completed' ? 'bg-emerald-500' :
                  r.status === 'In Progress' ? 'bg-indigo-500' :
                  r.status === 'On Hold' ? 'bg-red-400' : 'bg-gray-400'
                }`} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800 truncate">{r.type} — {r.unitNumber}</p>
                  <p className="text-xs text-gray-400">{r.propertyName} · {r.contractor}</p>
                  <ProgressBar value={r.progress} height="thin" showLabel={false} />
                </div>
                <StatusBadge status={r.status} size="sm" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
