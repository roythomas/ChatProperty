import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Download, Upload, X, ChevronUp, ChevronDown } from 'lucide-react';
import { mockApartments } from '../data/hubMockData';
import { Apartment, ApartmentStatus } from '../types/hub';
import { UnitDetailPanel } from '../components/hub/UnitDetailPanel';
import { ImportDialog } from '../components/hub/ImportDialog';
import * as XLSX from 'xlsx';

const BUILDINGS = ['All', 'Serdal Tower', 'Dareen Building', 'Areen Residence', 'Castle Garden', 'The Village'];
const STATUSES: (ApartmentStatus | 'All')[] = ['All', 'Completed', 'In Progress', 'Overdue', 'Vacant'];

const statusDot: Record<string, string> = {
  'Completed': 'bg-emerald-500',
  'In Progress': 'bg-indigo-400',
  'Overdue': 'bg-red-400',
  'Vacant': 'bg-gray-300',
};

const statusText: Record<string, string> = {
  'Completed': 'text-emerald-700',
  'In Progress': 'text-indigo-600',
  'Overdue': 'text-red-600',
  'Vacant': 'text-gray-500',
};

type SortKey = 'name' | 'building' | 'type' | 'status' | 'progress' | 'budget';
type SortDir = 'asc' | 'desc';

export function PropertiesHub() {
  const [search, setSearch] = useState('');
  const [buildingFilter, setBuildingFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState<ApartmentStatus | 'All'>('All');
  const [sortKey, setSortKey] = useState<SortKey>('building');
  const [sortDir, setSortDir] = useState<SortDir>('asc');
  const [selectedUnit, setSelectedUnit] = useState<Apartment | null>(null);
  const [showImport, setShowImport] = useState(false);
  const [apartments, setApartments] = useState<Apartment[]>(mockApartments);
  const [suggest, setSuggest] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === '/' && document.activeElement?.tagName !== 'INPUT') {
        e.preventDefault();
        searchRef.current?.focus();
        setSuggest(true);
      }
      if (e.key === 'Escape') { setSuggest(false); searchRef.current?.blur(); }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  const filtered = useMemo(() => {
    let data = apartments;
    if (search.trim()) {
      const q = search.toLowerCase();
      data = data.filter(a =>
        a.name.toLowerCase().includes(q) || a.building.toLowerCase().includes(q) ||
        a.shortCode?.toLowerCase().includes(q) || a.type.toLowerCase().includes(q) ||
        a.tenantName?.toLowerCase().includes(q)
      );
    }
    if (buildingFilter !== 'All') data = data.filter(a => a.building === buildingFilter);
    if (statusFilter !== 'All') data = data.filter(a => a.status === statusFilter);

    return [...data].sort((a, b) => {
      let va: string | number = '', vb: string | number = '';
      if (sortKey === 'name') { va = a.name; vb = b.name; }
      else if (sortKey === 'building') { va = a.building; vb = b.building; }
      else if (sortKey === 'type') { va = a.type; vb = b.type; }
      else if (sortKey === 'status') { va = a.status; vb = b.status; }
      else if (sortKey === 'progress') { va = a.progress; vb = b.progress; }
      else if (sortKey === 'budget') { va = a.budget.spent / a.budget.total || 0; vb = b.budget.spent / b.budget.total || 0; }
      if (va < vb) return sortDir === 'asc' ? -1 : 1;
      if (va > vb) return sortDir === 'asc' ? 1 : -1;
      return 0;
    });
  }, [apartments, search, buildingFilter, statusFilter, sortKey, sortDir]);

  const suggestions = useMemo(() => {
    if (!search.trim() || search.length < 2) return {};
    const q = search.toLowerCase();
    const hits = apartments.filter(a =>
      a.shortCode?.toLowerCase().includes(q) || a.name.toLowerCase().includes(q) || a.tenantName?.toLowerCase().includes(q)
    ).slice(0, 12);
    const grouped: Record<string, Apartment[]> = {};
    hits.forEach(a => { if (!grouped[a.building]) grouped[a.building] = []; grouped[a.building].push(a); });
    return grouped;
  }, [search, apartments]);

  const handleSort = useCallback((key: SortKey) => {
    setSortKey(prev => { if (prev === key) { setSortDir(d => d === 'asc' ? 'desc' : 'asc'); return prev; } setSortDir('asc'); return key; });
  }, []);

  const exportToExcel = () => {
    const rows = filtered.map(a => ({
      'Short Code': a.shortCode ?? '', Building: a.building, 'Unit Name': a.name,
      Type: a.type, Status: a.status, 'Progress (%)': a.progress, Floor: a.floor,
      'Budget (QAR)': a.budget.total, 'Spent (QAR)': a.budget.spent,
      'Tenant Name': a.tenantName ?? '', 'Move-In Date': a.moveInDate ?? '',
    }));
    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Apartments');
    XLSX.writeFile(wb, `renovation-hub-export-${new Date().toISOString().slice(0, 10)}.xlsx`);
  };

  const SortIcon = ({ k }: { k: SortKey }) => sortKey === k
    ? (sortDir === 'asc' ? <ChevronUp className="w-3 h-3 inline ml-0.5 text-indigo-500" /> : <ChevronDown className="w-3 h-3 inline ml-0.5 text-indigo-500" />)
    : null;

  const counts = useMemo(() => ({
    total: filtered.length,
    completed: filtered.filter(a => a.status === 'Completed').length,
    inProgress: filtered.filter(a => a.status === 'In Progress').length,
    overdue: filtered.filter(a => a.status === 'Overdue').length,
    vacant: filtered.filter(a => a.status === 'Vacant').length,
  }), [filtered]);

  return (
    <div className="flex flex-col h-full min-h-screen">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-xl font-semibold text-gray-900">Properties Hub</h1>
            <p className="text-sm text-gray-400 mt-0.5">
              {apartments.length} units across 5 buildings · press{' '}
              <kbd className="font-mono-data bg-gray-100 border border-gray-200 text-gray-500 px-1 py-0.5 rounded text-xs">/</kbd> to search
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setShowImport(true)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-gray-200 bg-white text-sm text-gray-600 hover:bg-gray-50 hover:border-gray-300 transition-all">
              <Upload className="w-3.5 h-3.5" /> Import
            </button>
            <button onClick={exportToExcel}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-gray-900 text-white text-sm hover:bg-gray-800 transition-all">
              <Download className="w-3.5 h-3.5" /> Export
            </button>
          </div>
        </div>

        {/* Count bar */}
        <div className="flex gap-5 mt-3">
          {[
            { label: 'Total', val: counts.total, cls: 'text-gray-700' },
            { label: 'Completed', val: counts.completed, cls: 'text-emerald-600' },
            { label: 'In Progress', val: counts.inProgress, cls: 'text-indigo-600' },
            { label: 'Overdue', val: counts.overdue, cls: 'text-red-500' },
            { label: 'Vacant', val: counts.vacant, cls: 'text-gray-400' },
          ].map(s => (
            <div key={s.label} className="flex items-center gap-1.5 text-sm">
              <span className={`font-semibold tabular-nums ${s.cls}`}>{s.val}</span>
              <span className="text-gray-400 text-xs">{s.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white border-b border-gray-200 px-6 py-3 flex flex-wrap gap-3 items-center">
        {/* Search */}
        <div className="relative flex-1 min-w-56">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input ref={searchRef} type="text" placeholder="Search units, codes, tenants…"
            value={search} onChange={e => { setSearch(e.target.value); setSuggest(true); }}
            onFocus={() => setSuggest(true)}
            className="w-full pl-9 pr-8 py-2 border border-gray-200 rounded-lg text-sm bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all placeholder:text-gray-400"
          />
          {search && (
            <button onClick={() => { setSearch(''); setSuggest(false); }} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
              <X className="w-3.5 h-3.5" />
            </button>
          )}
          <AnimatePresence>
            {suggest && search.length >= 2 && Object.keys(suggestions).length > 0 && (
              <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }}
                className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg z-50 overflow-hidden max-h-72 overflow-y-auto scrollbar-thin">
                {Object.entries(suggestions).map(([building, units]) => (
                  <div key={building}>
                    <div className="px-3 py-1.5 bg-gray-50 text-xs font-medium text-gray-500">{building}</div>
                    {units.map(u => (
                      <button key={u.id} onClick={() => { setSelectedUnit(u); setSuggest(false); setSearch(''); }}
                        className="w-full px-4 py-2.5 text-left hover:bg-gray-50 flex items-center justify-between transition-colors">
                        <div>
                          <span className="font-mono-data text-sm text-gray-800 font-medium">{u.shortCode}</span>
                          {u.tenantName && <span className="text-gray-400 text-xs ml-2">— {u.tenantName}</span>}
                        </div>
                        <span className={`text-xs flex items-center gap-1 ${statusText[u.status]}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${statusDot[u.status]}`} />
                          {u.status}
                        </span>
                      </button>
                    ))}
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Building filter */}
        <div className="flex gap-1.5 flex-wrap">
          {BUILDINGS.map(b => (
            <button key={b} onClick={() => setBuildingFilter(b)}
              className={`px-2.5 py-1.5 rounded-md text-xs font-medium transition-all ${
                buildingFilter === b
                  ? 'bg-gray-900 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}>{b}</button>
          ))}
        </div>

        {/* Status filter */}
        <div className="flex gap-1.5 flex-wrap">
          {STATUSES.map(s => (
            <button key={s} onClick={() => setStatusFilter(s)}
              className={`px-2.5 py-1.5 rounded-md text-xs font-medium transition-all flex items-center gap-1.5 ${
                statusFilter === s
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}>
              {s !== 'All' && <span className={`w-1.5 h-1.5 rounded-full ${statusFilter === s ? 'bg-white/70' : statusDot[s]}`} />}
              {s}
            </button>
          ))}
        </div>

        <span className="ml-auto text-xs text-gray-400">{filtered.length} of {apartments.length}</span>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto scrollbar-thin px-6 py-4">
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                {([
                  ['shortCode', 'Code'], ['name', 'Unit'], ['building', 'Building'],
                  ['type', 'Type'], ['status', 'Status'], ['progress', 'Progress'],
                  ['budget', 'Budget']
                ] as [SortKey, string][]).map(([k, label]) => (
                  <th key={k} onClick={() => handleSort(k)}
                    className="text-left px-4 py-3 font-medium text-gray-500 text-xs cursor-pointer hover:text-gray-700 select-none whitespace-nowrap">
                    {label}<SortIcon k={k} />
                  </th>
                ))}
                <th className="text-left px-4 py-3 font-medium text-gray-500 text-xs">Tenant</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500 text-xs">Move-In</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              <AnimatePresence initial={false}>
                {filtered.map((apt, i) => (
                  <motion.tr key={apt.id}
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    transition={{ delay: Math.min(i * 0.015, 0.25) }}
                    onClick={() => setSelectedUnit(apt)}
                    className="hover:bg-gray-50 cursor-pointer transition-colors"
                  >
                    <td className="px-4 py-3">
                      <span className="font-mono-data text-xs text-indigo-600 font-medium">{apt.shortCode ?? '—'}</span>
                    </td>
                    <td className="px-4 py-3 font-medium text-gray-900">{apt.name}</td>
                    <td className="px-4 py-3 text-gray-500 text-xs">{apt.building}</td>
                    <td className="px-4 py-3 text-gray-400 text-xs">{apt.type}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1.5 text-xs font-medium ${statusText[apt.status]}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${statusDot[apt.status]}`} />
                        {apt.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 w-32">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-1 bg-gray-100 rounded-full overflow-hidden">
                          <div className={`h-full rounded-full ${
                            apt.status === 'Overdue' ? 'bg-red-400' : apt.progress === 100 ? 'bg-emerald-500' : 'bg-indigo-500'
                          }`} style={{ width: `${apt.progress}%` }} />
                        </div>
                        <span className="font-mono-data text-xs text-gray-400 w-8 text-right tabular-nums">{apt.progress}%</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 w-40">
                      {apt.budget.total > 0 ? (
                        <div className="text-xs">
                          <div className="flex justify-between mb-1">
                            <span className="text-gray-400">QAR</span>
                            <span className="font-mono-data text-gray-600 tabular-nums">{apt.budget.spent.toLocaleString()}</span>
                          </div>
                          <div className="h-1 bg-gray-100 rounded-full overflow-hidden">
                            <div className={`h-full rounded-full ${apt.budget.spent > apt.budget.total * 0.9 ? 'bg-red-400' : 'bg-emerald-500'}`}
                              style={{ width: `${Math.min((apt.budget.spent / apt.budget.total) * 100, 100)}%` }} />
                          </div>
                        </div>
                      ) : <span className="text-gray-300 text-xs">—</span>}
                    </td>
                    <td className="px-4 py-3 text-gray-500 text-xs">{apt.tenantName || <span className="text-gray-300">—</span>}</td>
                    <td className="px-4 py-3 font-mono-data text-xs text-gray-400">{apt.moveInDate || '—'}</td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="py-16 text-center text-gray-400">
              <Search className="w-8 h-8 mx-auto mb-2 opacity-30" />
              <p className="text-sm">No units match your filters</p>
            </div>
          )}
        </div>
      </div>

      <AnimatePresence>
        {selectedUnit && (
          <UnitDetailPanel
            apartment={selectedUnit}
            onClose={() => setSelectedUnit(null)}
            onUpdate={updated => { setApartments(prev => prev.map(a => a.id === updated.id ? updated : a)); setSelectedUnit(updated); }}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showImport && (
          <ImportDialog
            onClose={() => setShowImport(false)}
            onImport={newApts => { setApartments(prev => [...prev, ...newApts]); setShowImport(false); }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
