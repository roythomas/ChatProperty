import { Building2, Home, Wrench, DollarSign, TrendingUp, Users, AlertCircle, CheckCircle } from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, Legend,
} from 'recharts';
import { properties, renovations, monthlyRevenueData, occupancyTrendData } from '../data/mockData';
import { StatCard } from '../components/StatCard';
import { StatusBadge } from '../components/StatusBadge';
import { ProgressBar } from '../components/ProgressBar';

const PIE_COLORS = ['#22c55e', '#6b7280', '#f59e0b', '#3b82f6'];

export function Dashboard() {
  const allUnits = properties.flatMap(p => p.units);
  const totalUnits = allUnits.length;
  const occupied = allUnits.filter(u => u.status === 'Occupied').length;
  const vacant = allUnits.filter(u => u.status === 'Vacant').length;
  const underRenovation = allUnits.filter(u => u.status === 'Under Renovation').length;
  const reserved = allUnits.filter(u => u.status === 'Reserved').length;
  const monthlyRevenue = allUnits
    .filter(u => u.status === 'Occupied' && u.lease)
    .reduce((s, u) => s + u.monthlyRent, 0);

  const occupancyRate = Math.round((occupied / totalUnits) * 100);

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

  const activeRenovations = renovations.filter(r => r.status === 'In Progress').length;
  const completedRenovations = renovations.filter(r => r.status === 'Completed').length;
  const onHoldRenovations = renovations.filter(r => r.status === 'On Hold').length;

  const recentRenovations = renovations.slice(0, 5);

  return (
    <div className="p-6 space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">Overview of your property portfolio · June 2026</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Properties"
          value={properties.length}
          subtitle={`${totalUnits} total units`}
          icon={Building2}
          iconColor="text-blue-600"
          iconBg="bg-blue-100"
          trend={{ value: 0, label: 'this month', positive: true }}
        />
        <StatCard
          title="Occupied Units"
          value={occupied}
          subtitle={`${occupancyRate}% occupancy rate`}
          icon={Home}
          iconColor="text-green-600"
          iconBg="bg-green-100"
          trend={{ value: 4, label: 'vs last month', positive: true }}
        />
        <StatCard
          title="Monthly Revenue"
          value={`AED ${(monthlyRevenue / 1000).toFixed(0)}K`}
          subtitle="From occupied units"
          icon={DollarSign}
          iconColor="text-emerald-600"
          iconBg="bg-emerald-100"
          trend={{ value: 3.2, label: 'vs last month', positive: true }}
        />
        <StatCard
          title="Active Renovations"
          value={activeRenovations}
          subtitle={`${onHoldRenovations} on hold · ${completedRenovations} completed`}
          icon={Wrench}
          iconColor="text-amber-600"
          iconBg="bg-amber-100"
        />
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-gray-100 rounded-xl"><Users className="w-5 h-5 text-gray-600" /></div>
          <div><p className="text-xl font-bold text-gray-900">{allUnits.filter(u => u.tenant).length}</p><p className="text-sm text-gray-500">Active Tenants</p></div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-red-100 rounded-xl"><AlertCircle className="w-5 h-5 text-red-600" /></div>
          <div><p className="text-xl font-bold text-gray-900">{vacant}</p><p className="text-sm text-gray-500">Vacant Units</p></div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-green-100 rounded-xl"><CheckCircle className="w-5 h-5 text-green-600" /></div>
          <div><p className="text-xl font-bold text-gray-900">{completedRenovations}</p><p className="text-sm text-gray-500">Renovations Completed</p></div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Monthly Revenue Chart */}
        <div className="lg:col-span-2 bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold text-gray-900">Monthly Revenue</h3>
              <p className="text-sm text-gray-500">2025 revenue vs target (AED)</p>
            </div>
            <TrendingUp className="w-5 h-5 text-green-500" />
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={monthlyRevenueData} barGap={2}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} tickFormatter={v => `${(v / 1000).toFixed(0)}K`} />
              <Tooltip formatter={(v: number) => [`AED ${v.toLocaleString()}`, '']} labelStyle={{ color: '#1e293b' }} />
              <Legend />
              <Bar dataKey="revenue" name="Revenue" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              <Bar dataKey="target" name="Target" fill="#e2e8f0" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Occupancy Pie */}
        <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
          <h3 className="font-semibold text-gray-900 mb-1">Unit Status</h3>
          <p className="text-sm text-gray-500 mb-4">Distribution across all properties</p>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie data={occupancyPieData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3} dataKey="value">
                {occupancyPieData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i]} />)}
              </Pie>
              <Tooltip formatter={(v: number) => [v, 'Units']} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-2 mt-2">
            {occupancyPieData.map((entry, i) => (
              <div key={entry.name} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: PIE_COLORS[i] }} />
                  <span className="text-gray-600">{entry.name}</span>
                </div>
                <span className="font-semibold text-gray-900">{entry.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Second Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Occupancy Trend */}
        <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
          <h3 className="font-semibold text-gray-900 mb-1">Occupancy Trend</h3>
          <p className="text-sm text-gray-500 mb-4">Monthly occupancy rate (%)</p>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={occupancyTrendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis domain={[70, 100]} tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} tickFormatter={v => `${v}%`} />
              <Tooltip formatter={(v: number) => [`${v}%`, 'Occupancy']} />
              <Line type="monotone" dataKey="occupancy" stroke="#3b82f6" strokeWidth={2.5} dot={{ fill: '#3b82f6', r: 4 }} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Renovation by Type */}
        <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
          <h3 className="font-semibold text-gray-900 mb-1">Renovations by Type</h3>
          <p className="text-sm text-gray-500 mb-4">Number of renovation tasks</p>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={renovationChartData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis dataKey="name" type="category" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} width={80} />
              <Tooltip />
              <Bar dataKey="count" name="Count" fill="#8b5cf6" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Properties Summary & Recent Renovations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Properties Summary */}
        <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
          <h3 className="font-semibold text-gray-900 mb-4">Property Summary</h3>
          <div className="space-y-4">
            {properties.map(property => {
              const propOccupied = property.units.filter(u => u.status === 'Occupied').length;
              const propOccupancyRate = Math.round((propOccupied / property.totalUnits) * 100);
              const propRevenue = property.units.filter(u => u.status === 'Occupied').reduce((s, u) => s + u.monthlyRent, 0);
              return (
                <div key={property.id} className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Building2 className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <p className="font-medium text-gray-900 text-sm truncate">{property.name}</p>
                      <span className="text-xs text-gray-500 ml-2 flex-shrink-0">{propOccupied}/{property.totalUnits}</span>
                    </div>
                    <ProgressBar value={propOccupancyRate} height="thin" />
                    <p className="text-xs text-gray-400 mt-1">AED {propRevenue.toLocaleString()} / month</p>
                  </div>
                  <StatusBadge status={property.type} size="sm" />
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent Renovation Activity */}
        <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
          <h3 className="font-semibold text-gray-900 mb-4">Recent Renovations</h3>
          <div className="space-y-3">
            {recentRenovations.map(r => (
              <div key={r.id} className="flex items-start gap-3 p-3 rounded-xl bg-gray-50">
                <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                  r.status === 'Completed' ? 'bg-green-500' :
                  r.status === 'In Progress' ? 'bg-blue-500' :
                  r.status === 'On Hold' ? 'bg-red-500' : 'bg-purple-500'
                }`} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{r.type} — {r.unitNumber}</p>
                  <p className="text-xs text-gray-500">{r.propertyName} · {r.contractor}</p>
                  <ProgressBar value={r.progress} height="thin" />
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
