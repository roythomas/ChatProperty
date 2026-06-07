import { useState } from 'react';
import { Wrench, DollarSign, CheckCircle, AlertCircle, Clock, Hash, Building2, Search, Filter } from 'lucide-react';
import { renovations, properties } from '../data/mockData';
import { RenovationType, RenovationStatus } from '../types';
import { StatusBadge } from '../components/StatusBadge';
import { ProgressBar } from '../components/ProgressBar';
import { RenovationDetailModal } from '../components/RenovationDetailModal';
import { Renovation } from '../types';
import { StatCard } from '../components/StatCard';

const renovationTypes: RenovationType[] = [
  'AC Installation', 'Painting', 'Flooring', 'Interlock Works', 'Plumbing',
  'Electrical', 'General Maintenance', 'Back Garden', 'Tiling', 'Carpentry', 'HVAC',
];
const statuses: RenovationStatus[] = ['Planned', 'In Progress', 'Completed', 'On Hold'];

export function RenovationTracker() {
  const [search, setSearch] = useState('');
  const [filterProperty, setFilterProperty] = useState('All');
  const [filterType, setFilterType] = useState<RenovationType | 'All'>('All');
  const [filterStatus, setFilterStatus] = useState<RenovationStatus | 'All'>('All');
  const [selectedRenovation, setSelectedRenovation] = useState<Renovation | null>(null);

  const totalActive = renovations.filter(r => r.status === 'In Progress').length;
  const totalCompleted = renovations.filter(r => r.status === 'Completed').length;
  const totalOnHold = renovations.filter(r => r.status === 'On Hold').length;
  const totalPlanned = renovations.filter(r => r.status === 'Planned').length;
  const totalCost = renovations.reduce((s, r) => s + r.estimatedCost, 0);
  const actualCostSoFar = renovations.filter(r => r.actualCost).reduce((s, r) => s + (r.actualCost ?? 0), 0);

  const filtered = renovations.filter(r => {
    if (search && !(
      r.propertyName.toLowerCase().includes(search.toLowerCase()) ||
      r.unitNumber.toLowerCase().includes(search.toLowerCase()) ||
      r.contractor.toLowerCase().includes(search.toLowerCase()) ||
      r.type.toLowerCase().includes(search.toLowerCase()) ||
      r.lpo.lpoNumber.toLowerCase().includes(search.toLowerCase())
    )) return false;
    if (filterProperty !== 'All' && r.propertyId !== filterProperty) return false;
    if (filterType !== 'All' && r.type !== filterType) return false;
    if (filterStatus !== 'All' && r.status !== filterStatus) return false;
    return true;
  });

  const groupedByProperty: Record<string, typeof renovations> = {};
  filtered.forEach(r => {
    if (!groupedByProperty[r.propertyName]) groupedByProperty[r.propertyName] = [];
    groupedByProperty[r.propertyName].push(r);
  });

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Renovation Tracker</h1>
        <p className="text-gray-500 text-sm mt-1">{renovations.length} total renovation tasks across {properties.length} properties</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="In Progress"
          value={totalActive}
          subtitle="Active renovations"
          icon={Wrench}
          iconColor="text-blue-600"
          iconBg="bg-blue-100"
        />
        <StatCard
          title="Completed"
          value={totalCompleted}
          subtitle="Finished renovations"
          icon={CheckCircle}
          iconColor="text-green-600"
          iconBg="bg-green-100"
        />
        <StatCard
          title="On Hold / Planned"
          value={`${totalOnHold} / ${totalPlanned}`}
          subtitle="Awaiting action"
          icon={AlertCircle}
          iconColor="text-amber-600"
          iconBg="bg-amber-100"
        />
        <StatCard
          title="Total Estimated Cost"
          value={`AED ${(totalCost / 1000).toFixed(0)}K`}
          subtitle={`AED ${(actualCostSoFar / 1000).toFixed(0)}K actual (completed)`}
          icon={DollarSign}
          iconColor="text-emerald-600"
          iconBg="bg-emerald-100"
        />
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
        <div className="flex items-center gap-2 mb-3">
          <Filter className="w-4 h-4 text-gray-400" />
          <span className="text-sm font-medium text-gray-700">Filters</span>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by property, unit, contractor, LPO..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Property */}
          <select
            value={filterProperty}
            onChange={e => setFilterProperty(e.target.value)}
            className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="All">All Properties</option>
            {properties.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>

          {/* Type */}
          <select
            value={filterType}
            onChange={e => setFilterType(e.target.value as RenovationType | 'All')}
            className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="All">All Types</option>
            {renovationTypes.map(t => <option key={t} value={t}>{t}</option>)}
          </select>

          {/* Status */}
          <select
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value as RenovationStatus | 'All')}
            className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="All">All Statuses</option>
            {statuses.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <p className="text-xs text-gray-400 mt-2">{filtered.length} renovation{filtered.length !== 1 ? 's' : ''} found</p>
      </div>

      {/* Grouped by Property */}
      {Object.entries(groupedByProperty).map(([propertyName, propRenovations]) => (
        <div key={propertyName} className="space-y-3">
          <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4 text-slate-600" />
            <h2 className="text-base font-semibold text-gray-800">{propertyName}</h2>
            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{propRenovations.length} item{propRenovations.length !== 1 ? 's' : ''}</span>
          </div>

          <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="text-left px-4 py-3 font-semibold text-gray-700">Unit</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-700">Type</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-700">Contractor</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-700 max-w-xs">Scope of Work</th>
                  <th className="text-center px-4 py-3 font-semibold text-gray-700">LPO No.</th>
                  <th className="text-right px-4 py-3 font-semibold text-gray-700">Est. Cost</th>
                  <th className="text-right px-4 py-3 font-semibold text-gray-700">Actual</th>
                  <th className="text-center px-4 py-3 font-semibold text-gray-700">Start</th>
                  <th className="text-center px-4 py-3 font-semibold text-gray-700">Due</th>
                  <th className="text-center px-4 py-3 font-semibold text-gray-700">Status</th>
                  <th className="text-center px-4 py-3 font-semibold text-gray-700">Progress</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {propRenovations.map(r => (
                  <tr
                    key={r.id}
                    onClick={() => setSelectedRenovation(r)}
                    className="hover:bg-blue-50 cursor-pointer transition-colors"
                  >
                    <td className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap">
                      {r.unitNumber}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className="inline-flex items-center gap-1.5 text-gray-700">
                        <Wrench className="w-3.5 h-3.5 text-amber-500" />
                        {r.type}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{r.contractor}</td>
                    <td className="px-4 py-3 text-gray-600 max-w-xs">
                      <p className="truncate max-w-[200px]" title={r.scopeOfWork}>{r.scopeOfWork}</p>
                    </td>
                    <td className="px-4 py-3 text-center whitespace-nowrap">
                      <span className="flex items-center justify-center gap-1 text-gray-600">
                        <Hash className="w-3 h-3" />{r.lpo.lpoNumber.replace('LPO-', '')}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right font-medium text-gray-900 whitespace-nowrap">
                      AED {r.estimatedCost.toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-right whitespace-nowrap">
                      {r.actualCost ? (
                        <span className={r.actualCost <= r.estimatedCost ? 'text-green-700 font-medium' : 'text-red-600 font-medium'}>
                          AED {r.actualCost.toLocaleString()}
                        </span>
                      ) : <span className="text-gray-400">—</span>}
                    </td>
                    <td className="px-4 py-3 text-center text-gray-500 whitespace-nowrap text-xs">{r.startDate}</td>
                    <td className="px-4 py-3 text-center whitespace-nowrap text-xs">
                      {r.actualCompletionDate ? (
                        <span className="text-green-600 font-medium">{r.actualCompletionDate}</span>
                      ) : <span className="text-gray-500">{r.completionDate}</span>}
                    </td>
                    <td className="px-4 py-3 text-center whitespace-nowrap">
                      <StatusBadge status={r.status} size="sm" />
                    </td>
                    <td className="px-4 py-3 w-28">
                      <ProgressBar value={r.progress} height="thin" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}

      {filtered.length === 0 && (
        <div className="bg-white rounded-xl p-12 text-center text-gray-400 border border-gray-100 shadow-sm">
          <Wrench className="w-12 h-12 mx-auto mb-2 opacity-30" />
          <p>No renovations match your filters</p>
          <button onClick={() => { setSearch(''); setFilterProperty('All'); setFilterType('All'); setFilterStatus('All'); }}
            className="mt-3 text-blue-600 hover:underline text-sm">Clear filters</button>
        </div>
      )}

      {/* Status Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statuses.map(status => {
          const count = renovations.filter(r => r.status === status).length;
          const total = renovations.filter(r => r.status === status).reduce((s, r) => s + r.estimatedCost, 0);
          const icons: Record<string, React.ReactNode> = {
            'Planned': <Clock className="w-5 h-5 text-purple-500" />,
            'In Progress': <Wrench className="w-5 h-5 text-blue-500" />,
            'Completed': <CheckCircle className="w-5 h-5 text-green-500" />,
            'On Hold': <AlertCircle className="w-5 h-5 text-red-500" />,
          };
          const colors: Record<string, string> = {
            'Planned': 'border-purple-200 bg-purple-50',
            'In Progress': 'border-blue-200 bg-blue-50',
            'Completed': 'border-green-200 bg-green-50',
            'On Hold': 'border-red-200 bg-red-50',
          };
          return (
            <div key={status} className={`rounded-xl p-4 border ${colors[status]} flex items-center gap-4`}>
              <div className="p-2 bg-white rounded-xl shadow-sm">{icons[status]}</div>
              <div>
                <p className="text-lg font-bold text-gray-900">{count}</p>
                <p className="text-sm font-medium text-gray-700">{status}</p>
                <p className="text-xs text-gray-500">AED {(total / 1000).toFixed(0)}K</p>
              </div>
            </div>
          );
        })}
      </div>

      {selectedRenovation && (
        <RenovationDetailModal
          renovation={selectedRenovation}
          onClose={() => setSelectedRenovation(null)}
        />
      )}
    </div>
  );
}
