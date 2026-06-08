import { useState } from 'react';
import { Wrench, DollarSign, CheckCircle, AlertCircle, Clock, Hash, Building2, Search } from 'lucide-react';
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
    <div className="p-6 space-y-6 max-w-[1400px]">
      {/* Header */}
      <div>
        <h1 className="text-xl font-semibold text-gray-900">Renovation Tracker</h1>
        <p className="text-sm text-gray-400 mt-0.5">{renovations.length} tasks across {properties.length} properties</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="In Progress" value={totalActive} subtitle="Active renovations"
          icon={Wrench} iconColor="" iconBg="" />
        <StatCard title="Completed" value={totalCompleted} subtitle="Finished"
          icon={CheckCircle} iconColor="" iconBg="" />
        <StatCard title="On Hold / Planned" value={`${totalOnHold} / ${totalPlanned}`} subtitle="Awaiting action"
          icon={AlertCircle} iconColor="" iconBg="" />
        <StatCard title="Estimated Cost" value={`AED ${(totalCost / 1000).toFixed(0)}K`}
          subtitle={`AED ${(actualCostSoFar / 1000).toFixed(0)}K actual`}
          icon={DollarSign} iconColor="" iconBg="" />
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-4 border border-gray-200">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by property, unit, contractor, LPO…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all placeholder:text-gray-400"
            />
          </div>

          {[
            {
              value: filterProperty, onChange: (v: string) => setFilterProperty(v),
              options: [{ value: 'All', label: 'All Properties' }, ...properties.map(p => ({ value: p.id, label: p.name }))],
            },
            {
              value: filterType, onChange: (v: string) => setFilterType(v as RenovationType | 'All'),
              options: [{ value: 'All', label: 'All Types' }, ...renovationTypes.map(t => ({ value: t, label: t }))],
            },
            {
              value: filterStatus, onChange: (v: string) => setFilterStatus(v as RenovationStatus | 'All'),
              options: [{ value: 'All', label: 'All Statuses' }, ...statuses.map(s => ({ value: s, label: s }))],
            },
          ].map((sel, i) => (
            <select key={i} value={sel.value} onChange={e => sel.onChange(e.target.value)}
              className="px-3 py-2 border border-gray-200 rounded-lg text-sm bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-gray-700">
              {sel.options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          ))}
        </div>
        <p className="text-xs text-gray-400 mt-2.5">{filtered.length} result{filtered.length !== 1 ? 's' : ''}</p>
      </div>

      {/* Grouped tables */}
      {Object.entries(groupedByProperty).map(([propertyName, propRenovations]) => (
        <div key={propertyName} className="space-y-2">
          <div className="flex items-center gap-2">
            <Building2 className="w-3.5 h-3.5 text-gray-400" />
            <h2 className="text-sm font-medium text-gray-700">{propertyName}</h2>
            <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full tabular-nums">{propRenovations.length}</span>
          </div>

          <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  {['Unit', 'Type', 'Contractor', 'Scope', 'LPO', 'Est. Cost', 'Actual', 'Start', 'Due', 'Status', 'Progress'].map(h => (
                    <th key={h} className={`px-4 py-3 font-medium text-gray-400 text-xs whitespace-nowrap ${h === 'Est. Cost' || h === 'Actual' ? 'text-right' : 'text-left'}`}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {propRenovations.map(r => (
                  <tr key={r.id} onClick={() => setSelectedRenovation(r)}
                    className="hover:bg-gray-50 cursor-pointer transition-colors">
                    <td className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap">{r.unitNumber}</td>
                    <td className="px-4 py-3 text-gray-600 whitespace-nowrap">
                      <span className="flex items-center gap-1.5">
                        <Wrench className="w-3 h-3 text-gray-400" />{r.type}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-500 whitespace-nowrap text-xs">{r.contractor}</td>
                    <td className="px-4 py-3 text-gray-500 max-w-[180px]">
                      <p className="truncate text-xs" title={r.scopeOfWork}>{r.scopeOfWork}</p>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className="flex items-center gap-1 text-xs text-gray-400">
                        <Hash className="w-2.5 h-2.5" />{r.lpo.lpoNumber.replace('LPO-', '')}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right text-gray-900 font-medium whitespace-nowrap tabular-nums text-xs">
                      AED {r.estimatedCost.toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-right whitespace-nowrap text-xs tabular-nums">
                      {r.actualCost ? (
                        <span className={r.actualCost <= r.estimatedCost ? 'text-emerald-600' : 'text-red-500'}>
                          AED {r.actualCost.toLocaleString()}
                        </span>
                      ) : <span className="text-gray-300">—</span>}
                    </td>
                    <td className="px-4 py-3 text-gray-400 whitespace-nowrap text-xs tabular-nums">{r.startDate}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-xs tabular-nums">
                      {r.actualCompletionDate
                        ? <span className="text-emerald-600">{r.actualCompletionDate}</span>
                        : <span className="text-gray-400">{r.completionDate}</span>}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <StatusBadge status={r.status} size="sm" />
                    </td>
                    <td className="px-4 py-3 w-24">
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
        <div className="bg-white rounded-xl p-12 text-center border border-gray-200">
          <Wrench className="w-10 h-10 mx-auto mb-2 text-gray-200" />
          <p className="text-gray-400 text-sm">No renovations match your filters</p>
          <button onClick={() => { setSearch(''); setFilterProperty('All'); setFilterType('All'); setFilterStatus('All'); }}
            className="mt-3 text-indigo-600 hover:underline text-sm">Clear filters</button>
        </div>
      )}

      {/* Status summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statuses.map(status => {
          const count = renovations.filter(r => r.status === status).length;
          const total = renovations.filter(r => r.status === status).reduce((s, r) => s + r.estimatedCost, 0);
          const iconMap: Record<string, React.ReactNode> = {
            'Planned': <Clock className="w-4 h-4 text-gray-400" />,
            'In Progress': <Wrench className="w-4 h-4 text-indigo-400" />,
            'Completed': <CheckCircle className="w-4 h-4 text-emerald-500" />,
            'On Hold': <AlertCircle className="w-4 h-4 text-red-400" />,
          };
          return (
            <div key={status} className="bg-white rounded-xl p-4 border border-gray-200 flex items-center gap-3">
              {iconMap[status]}
              <div>
                <p className="text-lg font-semibold text-gray-900 tabular-nums">{count}</p>
                <p className="text-sm text-gray-600">{status}</p>
                <p className="text-xs text-gray-400">AED {(total / 1000).toFixed(0)}K</p>
              </div>
            </div>
          );
        })}
      </div>

      {selectedRenovation && (
        <RenovationDetailModal renovation={selectedRenovation} onClose={() => setSelectedRenovation(null)} />
      )}
    </div>
  );
}
