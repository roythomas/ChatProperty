import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, AreaChart, Area,
} from 'recharts';
import { properties, renovations, monthlyRevenueData, occupancyTrendData } from '../data/mockData';
import { TrendingUp, DollarSign, Home, Wrench } from 'lucide-react';

const COLORS = ['#6366F1', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4', '#F97316'];

export function Analytics() {
  const allUnits = properties.flatMap(p => p.units);

  const revenueByProperty = properties.map(p => ({
    name: p.name.split(' ').slice(0, 2).join(' '),
    revenue: p.units.filter(u => u.status === 'Occupied').reduce((s, u) => s + u.monthlyRent, 0),
    units: p.totalUnits,
    occupied: p.units.filter(u => u.status === 'Occupied').length,
  }));

  const unitTypeData = allUnits.reduce<Record<string, number>>((acc, u) => {
    acc[u.type] = (acc[u.type] ?? 0) + 1;
    return acc;
  }, {});
  const unitTypePieData = Object.entries(unitTypeData).map(([name, value]) => ({ name, value }));

  const renovCostByType = renovations.reduce<Record<string, number>>((acc, r) => {
    acc[r.type] = (acc[r.type] ?? 0) + r.estimatedCost;
    return acc;
  }, {});
  const renovCostData = Object.entries(renovCostByType)
    .sort((a, b) => b[1] - a[1])
    .map(([name, cost]) => ({ name: name.split(' ').slice(0, 2).join(' '), cost }));

  const renovStatusData = [
    { name: 'In Progress', value: renovations.filter(r => r.status === 'In Progress').length },
    { name: 'Completed', value: renovations.filter(r => r.status === 'Completed').length },
    { name: 'Planned', value: renovations.filter(r => r.status === 'Planned').length },
    { name: 'On Hold', value: renovations.filter(r => r.status === 'On Hold').length },
  ];
  const renovStatusColors = ['#6366F1', '#10B981', '#9CA3AF', '#EF4444'];

  const totalRevenue = allUnits.filter(u => u.status === 'Occupied').reduce((s, u) => s + u.monthlyRent, 0);
  const avgRent = Math.round(totalRevenue / allUnits.filter(u => u.status === 'Occupied').length);
  const totalRenovCost = renovations.reduce((s, r) => s + r.estimatedCost, 0);

  const tooltipStyle = { borderRadius: 8, border: '1px solid #E5E7EB', boxShadow: 'none', fontSize: 12 };

  return (
    <div className="p-6 space-y-6 max-w-[1400px]">
      <div>
        <h1 className="text-xl font-semibold text-gray-900">Analytics</h1>
        <p className="text-sm text-gray-400 mt-0.5">Portfolio performance and financial insights</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Monthly Revenue', value: `AED ${totalRevenue.toLocaleString()}`, icon: DollarSign },
          { label: 'Avg. Rent Per Unit', value: `AED ${avgRent.toLocaleString()}`, icon: Home },
          { label: 'Total Area', value: `${properties.reduce((s, p) => s + p.totalArea, 0).toLocaleString()} m²`, icon: TrendingUp },
          { label: 'Renovation Budget', value: `AED ${(totalRenovCost / 1000).toFixed(0)}K`, icon: Wrench },
        ].map(kpi => (
          <div key={kpi.label} className="bg-white rounded-xl p-5 border border-gray-200">
            <div className="flex items-start justify-between mb-3">
              <p className="text-xs text-gray-500">{kpi.label}</p>
              <kpi.icon className="w-4 h-4 text-gray-400" />
            </div>
            <p className="text-xl font-semibold text-gray-900">{kpi.value}</p>
          </div>
        ))}
      </div>

      {/* Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl p-5 border border-gray-200">
          <h3 className="font-medium text-gray-900 text-sm mb-0.5">Annual Revenue Trend</h3>
          <p className="text-xs text-gray-400 mb-4">Monthly vs target (AED)</p>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={monthlyRevenueData}>
              <defs>
                <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366F1" stopOpacity={0.12} />
                  <stop offset="95%" stopColor="#6366F1" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#9CA3AF' }} axisLine={false} tickLine={false} tickFormatter={v => `${(v / 1000).toFixed(0)}K`} />
              <Tooltip formatter={(v: number) => [`AED ${v.toLocaleString()}`, '']} contentStyle={tooltipStyle} />
              <Area type="monotone" dataKey="revenue" stroke="#6366F1" strokeWidth={2} fill="url(#revGrad)" dot={false} />
              <Line type="monotone" dataKey="target" stroke="#E5E7EB" strokeWidth={1.5} strokeDasharray="4 4" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl p-5 border border-gray-200">
          <h3 className="font-medium text-gray-900 text-sm mb-0.5">Occupancy Rate</h3>
          <p className="text-xs text-gray-400 mb-4">Monthly percentage</p>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={occupancyTrendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
              <YAxis domain={[70, 100]} tick={{ fontSize: 11, fill: '#9CA3AF' }} axisLine={false} tickLine={false} tickFormatter={v => `${v}%`} />
              <Tooltip formatter={(v: number) => [`${v}%`, 'Occupancy']} contentStyle={tooltipStyle} />
              <Line type="monotone" dataKey="occupancy" stroke="#10B981" strokeWidth={2} dot={false} activeDot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 bg-white rounded-xl p-5 border border-gray-200">
          <h3 className="font-medium text-gray-900 text-sm mb-0.5">Revenue by Property</h3>
          <p className="text-xs text-gray-400 mb-4">Monthly revenue (AED)</p>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={revenueByProperty}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#9CA3AF' }} axisLine={false} tickLine={false} tickFormatter={v => `${(v / 1000).toFixed(0)}K`} />
              <Tooltip formatter={(v: number) => [`AED ${v.toLocaleString()}`, 'Revenue']} contentStyle={tooltipStyle} />
              <Bar dataKey="revenue" radius={[4, 4, 0, 0]}>
                {revenueByProperty.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl p-5 border border-gray-200">
          <h3 className="font-medium text-gray-900 text-sm mb-0.5">Unit Types</h3>
          <p className="text-xs text-gray-400 mb-3">Distribution</p>
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie data={unitTypePieData} cx="50%" cy="50%" outerRadius={72} paddingAngle={2} dataKey="value">
                {unitTypePieData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip formatter={(v: number) => [v, 'Units']} contentStyle={tooltipStyle} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-1.5 mt-2">
            {unitTypePieData.map((entry, i) => (
              <div key={entry.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                  <span className="text-gray-500">{entry.name}</span>
                </div>
                <span className="font-medium text-gray-900 tabular-nums">{entry.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Row 3 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl p-5 border border-gray-200">
          <h3 className="font-medium text-gray-900 text-sm mb-0.5">Renovation Cost by Type</h3>
          <p className="text-xs text-gray-400 mb-4">Estimated (AED)</p>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={renovCostData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 11, fill: '#9CA3AF' }} axisLine={false} tickLine={false} tickFormatter={v => `${(v / 1000).toFixed(0)}K`} />
              <YAxis dataKey="name" type="category" tick={{ fontSize: 11, fill: '#9CA3AF' }} axisLine={false} tickLine={false} width={75} />
              <Tooltip formatter={(v: number) => [`AED ${v.toLocaleString()}`, 'Cost']} contentStyle={tooltipStyle} />
              <Bar dataKey="cost" radius={[0, 3, 3, 0]}>
                {renovCostData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl p-5 border border-gray-200">
          <h3 className="font-medium text-gray-900 text-sm mb-0.5">Renovation Status</h3>
          <p className="text-xs text-gray-400 mb-3">Current distribution</p>
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie data={renovStatusData} cx="50%" cy="50%" innerRadius={40} outerRadius={72} paddingAngle={2} dataKey="value">
                {renovStatusData.map((_, i) => <Cell key={i} fill={renovStatusColors[i]} />)}
              </Pie>
              <Tooltip formatter={(v: number) => [v, 'Renovations']} contentStyle={tooltipStyle} />
            </PieChart>
          </ResponsiveContainer>
          <div className="grid grid-cols-2 gap-2 mt-2">
            {renovStatusData.map((entry, i) => (
              <div key={entry.name} className="flex items-center gap-2 text-xs">
                <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: renovStatusColors[i] }} />
                <span className="text-gray-500 truncate">{entry.name}</span>
                <span className="font-medium text-gray-900 ml-auto tabular-nums">{entry.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Property Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-200">
          <h3 className="font-medium text-gray-900 text-sm">Property Performance</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                {['Property', 'Type', 'Units', 'Occupied', 'Occ. %', 'Monthly Rev.', 'Avg. Rent', 'Active Renos'].map(h => (
                  <th key={h} className={`px-5 py-3 font-medium text-gray-400 text-xs ${h === 'Property' ? 'text-left' : 'text-center'}`}>{h}</th>
                ))}
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
                  <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-3 font-medium text-gray-900">{p.name}</td>
                    <td className="px-4 py-3 text-center text-gray-400 text-xs">{p.type}</td>
                    <td className="px-4 py-3 text-center text-gray-700 font-medium tabular-nums">{p.totalUnits}</td>
                    <td className="px-4 py-3 text-center text-emerald-600 font-medium tabular-nums">{occ}</td>
                    <td className="px-4 py-3 text-center">
                      <span className={`font-semibold tabular-nums ${rate >= 80 ? 'text-emerald-600' : rate >= 60 ? 'text-amber-500' : 'text-red-500'}`}>{rate}%</span>
                    </td>
                    <td className="px-4 py-3 text-center font-medium text-gray-900 tabular-nums">AED {rev.toLocaleString()}</td>
                    <td className="px-4 py-3 text-center text-gray-500 tabular-nums">AED {avg.toLocaleString()}</td>
                    <td className="px-4 py-3 text-center">{activeRenos > 0 ? <span className="text-indigo-600 font-medium tabular-nums">{activeRenos}</span> : <span className="text-gray-300">—</span>}</td>
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
