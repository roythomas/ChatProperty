import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, Legend, AreaChart, Area,
} from 'recharts';
import { properties, renovations, monthlyRevenueData, occupancyTrendData } from '../data/mockData';
import { TrendingUp, DollarSign, Home, Wrench } from 'lucide-react';

const COLORS = ['#3b82f6', '#22c55e', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#f97316'];

export function Analytics() {
  const allUnits = properties.flatMap(p => p.units);

  // Revenue by property
  const revenueByProperty = properties.map(p => ({
    name: p.name.split(' ').slice(0, 2).join(' '),
    revenue: p.units.filter(u => u.status === 'Occupied').reduce((s, u) => s + u.monthlyRent, 0),
    units: p.totalUnits,
    occupied: p.units.filter(u => u.status === 'Occupied').length,
  }));

  // Unit type distribution
  const unitTypeData = allUnits.reduce<Record<string, number>>((acc, u) => {
    acc[u.type] = (acc[u.type] ?? 0) + 1;
    return acc;
  }, {});
  const unitTypePieData = Object.entries(unitTypeData).map(([name, value]) => ({ name, value }));

  // Renovation cost by type
  const renovCostByType = renovations.reduce<Record<string, number>>((acc, r) => {
    acc[r.type] = (acc[r.type] ?? 0) + r.estimatedCost;
    return acc;
  }, {});
  const renovCostData = Object.entries(renovCostByType)
    .sort((a, b) => b[1] - a[1])
    .map(([name, cost]) => ({ name: name.split(' ').slice(0, 2).join(' '), cost }));

  // Renovation status pie
  const renovStatusData = [
    { name: 'In Progress', value: renovations.filter(r => r.status === 'In Progress').length },
    { name: 'Completed', value: renovations.filter(r => r.status === 'Completed').length },
    { name: 'Planned', value: renovations.filter(r => r.status === 'Planned').length },
    { name: 'On Hold', value: renovations.filter(r => r.status === 'On Hold').length },
  ];
  const renovStatusColors = ['#3b82f6', '#22c55e', '#8b5cf6', '#ef4444'];

  const totalRevenue = allUnits.filter(u => u.status === 'Occupied').reduce((s, u) => s + u.monthlyRent, 0);
  const avgRent = Math.round(totalRevenue / allUnits.filter(u => u.status === 'Occupied').length);
  const totalRenovCost = renovations.reduce((s, r) => s + r.estimatedCost, 0);

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
        <p className="text-gray-500 text-sm mt-1">Portfolio performance and financial insights</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Monthly Revenue', value: `AED ${totalRevenue.toLocaleString()}`, icon: DollarSign, color: 'text-green-600', bg: 'bg-green-100' },
          { label: 'Avg. Rent Per Unit', value: `AED ${avgRent.toLocaleString()}`, icon: Home, color: 'text-blue-600', bg: 'bg-blue-100' },
          { label: 'Total Portfolio Area', value: `${properties.reduce((s, p) => s + p.totalArea, 0).toLocaleString()} m²`, icon: TrendingUp, color: 'text-purple-600', bg: 'bg-purple-100' },
          { label: 'Total Renovation Budget', value: `AED ${(totalRenovCost / 1000).toFixed(0)}K`, icon: Wrench, color: 'text-amber-600', bg: 'bg-amber-100' },
        ].map(kpi => (
          <div key={kpi.label} className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-500">{kpi.label}</p>
              <div className={`p-2 rounded-xl ${kpi.bg}`}>
                <kpi.icon className={`w-4 h-4 ${kpi.color}`} />
              </div>
            </div>
            <p className="text-xl font-bold text-gray-900">{kpi.value}</p>
          </div>
        ))}
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Revenue Area */}
        <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
          <h3 className="font-semibold text-gray-900 mb-1">Annual Revenue Trend</h3>
          <p className="text-sm text-gray-500 mb-4">Monthly revenue vs target (AED)</p>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={monthlyRevenueData}>
              <defs>
                <linearGradient id="revGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} tickFormatter={v => `${(v / 1000).toFixed(0)}K`} />
              <Tooltip formatter={(v: number) => [`AED ${v.toLocaleString()}`, '']} />
              <Area type="monotone" dataKey="revenue" name="Revenue" stroke="#3b82f6" strokeWidth={2} fill="url(#revGradient)" />
              <Line type="monotone" dataKey="target" name="Target" stroke="#e2e8f0" strokeWidth={2} strokeDasharray="5 5" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Occupancy Trend */}
        <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
          <h3 className="font-semibold text-gray-900 mb-1">Occupancy Rate Trend</h3>
          <p className="text-sm text-gray-500 mb-4">Monthly occupancy rate percentage</p>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={occupancyTrendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis domain={[70, 100]} tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} tickFormatter={v => `${v}%`} />
              <Tooltip formatter={(v: number) => [`${v}%`, 'Occupancy']} />
              <Line type="monotone" dataKey="occupancy" stroke="#22c55e" strokeWidth={2.5} dot={{ fill: '#22c55e', r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue by Property */}
        <div className="lg:col-span-2 bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
          <h3 className="font-semibold text-gray-900 mb-1">Revenue by Property</h3>
          <p className="text-sm text-gray-500 mb-4">Monthly revenue per property (AED)</p>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={revenueByProperty}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} tickFormatter={v => `${(v / 1000).toFixed(0)}K`} />
              <Tooltip formatter={(v: number) => [`AED ${v.toLocaleString()}`, 'Revenue']} />
              <Bar dataKey="revenue" name="Revenue" fill="#3b82f6" radius={[6, 6, 0, 0]}>
                {revenueByProperty.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Unit Type Pie */}
        <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
          <h3 className="font-semibold text-gray-900 mb-1">Unit Types</h3>
          <p className="text-sm text-gray-500 mb-4">Distribution by unit type</p>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie data={unitTypePieData} cx="50%" cy="50%" outerRadius={80} paddingAngle={3} dataKey="value">
                {unitTypePieData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip formatter={(v: number) => [v, 'Units']} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-1.5 mt-2">
            {unitTypePieData.map((entry, i) => (
              <div key={entry.name} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                  <span className="text-gray-600">{entry.name}</span>
                </div>
                <span className="font-semibold text-gray-900">{entry.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Charts Row 3 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Renovation Cost by Type */}
        <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
          <h3 className="font-semibold text-gray-900 mb-1">Renovation Cost by Type</h3>
          <p className="text-sm text-gray-500 mb-4">Estimated cost breakdown (AED)</p>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={renovCostData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} tickFormatter={v => `${(v / 1000).toFixed(0)}K`} />
              <YAxis dataKey="name" type="category" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} width={80} />
              <Tooltip formatter={(v: number) => [`AED ${v.toLocaleString()}`, 'Cost']} />
              <Bar dataKey="cost" name="Cost" fill="#f59e0b" radius={[0, 4, 4, 0]}>
                {renovCostData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Renovation Status Pie */}
        <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
          <h3 className="font-semibold text-gray-900 mb-1">Renovation Status</h3>
          <p className="text-sm text-gray-500 mb-4">Current status distribution</p>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie data={renovStatusData} cx="50%" cy="50%" innerRadius={45} outerRadius={80} paddingAngle={3} dataKey="value">
                {renovStatusData.map((_, i) => <Cell key={i} fill={renovStatusColors[i]} />)}
              </Pie>
              <Tooltip formatter={(v: number) => [v, 'Renovations']} />
            </PieChart>
          </ResponsiveContainer>
          <div className="grid grid-cols-2 gap-2 mt-2">
            {renovStatusData.map((entry, i) => (
              <div key={entry.name} className="flex items-center gap-2 text-sm">
                <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: renovStatusColors[i] }} />
                <span className="text-gray-600 truncate">{entry.name}</span>
                <span className="font-semibold text-gray-900 ml-auto">{entry.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Property Comparison Table */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h3 className="font-semibold text-gray-900">Property Performance Comparison</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-left px-6 py-3 font-semibold text-gray-700">Property</th>
                <th className="text-center px-4 py-3 font-semibold text-gray-700">Type</th>
                <th className="text-center px-4 py-3 font-semibold text-gray-700">Total Units</th>
                <th className="text-center px-4 py-3 font-semibold text-gray-700">Occupied</th>
                <th className="text-center px-4 py-3 font-semibold text-gray-700">Occupancy %</th>
                <th className="text-right px-4 py-3 font-semibold text-gray-700">Monthly Revenue</th>
                <th className="text-right px-4 py-3 font-semibold text-gray-700">Avg. Rent</th>
                <th className="text-center px-4 py-3 font-semibold text-gray-700">Active Renos</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {properties.map(p => {
                const occ = p.units.filter(u => u.status === 'Occupied').length;
                const rev = p.units.filter(u => u.status === 'Occupied').reduce((s, u) => s + u.monthlyRent, 0);
                const avg = occ > 0 ? Math.round(rev / occ) : 0;
                const rate = Math.round((occ / p.totalUnits) * 100);
                const activeRenos = renovations.filter(r => r.propertyId === p.id && r.status === 'In Progress').length;
                return (
                  <tr key={p.id} className="hover:bg-gray-50">
                    <td className="px-6 py-3 font-medium text-gray-900">{p.name}</td>
                    <td className="px-4 py-3 text-center text-gray-600">{p.type}</td>
                    <td className="px-4 py-3 text-center text-gray-900 font-medium">{p.totalUnits}</td>
                    <td className="px-4 py-3 text-center text-green-700 font-medium">{occ}</td>
                    <td className="px-4 py-3 text-center">
                      <span className={`font-bold ${rate >= 80 ? 'text-green-700' : rate >= 60 ? 'text-amber-600' : 'text-red-600'}`}>{rate}%</span>
                    </td>
                    <td className="px-4 py-3 text-right font-semibold text-gray-900">AED {rev.toLocaleString()}</td>
                    <td className="px-4 py-3 text-right text-gray-600">AED {avg.toLocaleString()}</td>
                    <td className="px-4 py-3 text-center">{activeRenos > 0 ? <span className="text-blue-600 font-medium">{activeRenos}</span> : <span className="text-gray-400">—</span>}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
