import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, SlidersHorizontal, Download, Upload, X, ChevronUp, ChevronDown, Building2 } from 'lucide-react';
import { mockApartments } from '../data/hubMockData';
import { Apartment, ApartmentStatus } from '../types/hub';
import { UnitDetailPanel } from '../components/hub/UnitDetailPanel';
import { ImportDialog } from '../components/hub/ImportDialog';
import * as XLSX from 'xlsx';

const BUILDINGS = ['All', 'Serdal Tower', 'Dareen Building', 'Areen Residence', 'Castle Garden', 'The Village'];
const STATUSES: (ApartmentStatus | 'All')[] = ['All', 'Completed', 'In Progress', 'Overdue', 'Vacant'];

const statusStyle: Record<string, string> = {
  'Completed': 'bg-emerald-50 text-emerald-700 border border-emerald-200',
  'In Progress': 'bg-amber-50 text-amber-700 border border-amber-200',
  'Overdue': 'bg-red-50 text-red-700 border border-red-200',
  'Vacant': 'bg-slate-100 text-slate-600 border border-slate-200',
};

const statusDot: Record<string, string> = {
  'Completed': 'bg-emerald-500',
  'In Progress': 'bg-amber-500',
  'Overdue': 'bg-red-500',
  'Vacant': 'bg-slate-400',
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

  // Keyboard shortcut: press / to focus search
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === '/' && document.activeElement?.tagName !== 'INPUT') {
        e.preventDefault();
        searchRef.current?.focus();
        setSuggest(true);
      }
      if (e.key === 'Escape') {
        setSuggest(false);
        searchRef.current?.blur();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  const filtered = useMemo(() => {
    let data = apartments;
    if (search.trim()) {
      const q = search.toLowerCase();
      data = data.filter(a =>
        a.name.toLowerCase().includes(q) ||
        a.building.toLowerCase().includes(q) ||
        a.shortCode?.toLowerCase().includes(q) ||
        a.type.toLowerCase().includes(q) ||
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

  // Suggest: top matches grouped by building
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
    ? (sortDir === 'asc' ? <ChevronUp className="w-3 h-3 inline ml-0.5" /> : <ChevronDown className="w-3 h-3 inline ml-0.5" />)
    : null;

  const counts = useMemo(() => ({
    total: filtered.length,
    completed: filtered.filter(a => a.status === 'Completed').length,
    inProgress: filtered.filter(a => a.status === 'In Progress').length,
    overdue: filtered.filter(a => a.status === 'Overdue').length,
    vacant: filtered.filter(a => a.status === 'Vacant').length,
  }), [filtered]);

  return (
    <div className="flex flex-col h-full min-h-screen bg-[#F8FAFC]">
      {/* ─── Header ─── */}
      <div className="bg-white border-b border-slate-200 px-6 py-5">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h1 className="font-display text-2xl font-700 text-slate-900 font-semibold" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              Properties & Renovation Hub
            </h1>
            <p className="text-slate-500 text-sm mt-0.5">
              {apartments.length} units across 5 buildings · Press <kbd className="font-mono-data bg-slate-100 border border-slate-300 text-slate-600 px-1.5 py-0.5 rounded text-xs">/</kbd> to search
            </p>
          </div>
          <div className="flex items-center gap-2">
            <motion.button whileTap={{ scale: 0.96 }} onClick={() => setShowImport(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 bg-white text-slate-700 text-sm font-medium hover:border-indigo-300 hover:text-indigo-700 transition-all">
              <Upload className="w-4 h-4" /> Import CSV
            </motion.button>
            <motion.button whileTap={{ scale: 0.96 }} onClick={exportToExcel}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 text-white text-sm font-medium hover:bg-slate-800 transition-all">
              <Download className="w-4 h-4" /> Export
            </motion.button>
          </div>
        </div>

        {/* Status bar */}
        <div className="flex gap-4 mt-4 flex-wrap">
          {[
            { label: 'Total', val: counts.total, color: 'text-slate-700' },
            { label: 'Completed', val: counts.completed, color: 'text-emerald-600' },
            { label: 'In Progress', val: counts.inProgress, color: 'text-amber-600' },
            { label: 'Overdue', val: counts.overdue, color: 'text-red-600' },
            { label: 'Vacant', val: counts.vacant, color: 'text-slate-500' },
          ].map(s => (
            <div key={s.label} className="flex items-center gap-1.5 text-sm">
              <span className={`font-mono-data font-semibold text-base ${s.color}`} style={{ fontFamily: "'JetBrains Mono', monospace" }}>{s.val}</span>
              <span className="text-slate-400">{s.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ─── Filters ─── */}
      <div className="bg-white border-b border-slate-200 px-6 py-3 flex flex-wrap gap-3 items-center">
        {/* Search */}
        <div className="relative flex-1 min-w-64">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input ref={searchRef} type="text" placeholder="Search units, codes, tenants…"
            value={search} onChange={e => { setSearch(e.target.value); setSuggest(true); }}
            onFocus={() => setSuggest(true)}
            className="w-full pl-10 pr-9 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-all bg-slate-50"
          />
          {search && (
            <button onClick={() => { setSearch(''); setSuggest(false); }} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
              <X className="w-3.5 h-3.5" />
            </button>
          )}
          {/* Autocomplete suggestions */}
          <AnimatePresence>
            {suggest && search.length >= 2 && Object.keys(suggestions).length > 0 && (
              <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }}
                className="absolute top-full left-0 right-0 mt-1.5 bg-white border border-slate-200 rounded-xl shadow-xl z-50 overflow-hidden max-h-80 overflow-y-auto scrollbar-thin">
                {Object.entries(suggestions).map(([building, units]) => (
                  <div key={building}>
                    <div className="px-3 py-1.5 bg-slate-50 text-xs font-semibold text-slate-500 uppercase tracking-wide">{building}</div>
                    {units.map(u => (
                      <button key={u.id} onClick={() => { setSelectedUnit(u); setSuggest(false); setSearch(''); }}
                        className="w-full px-4 py-2.5 text-left hover:bg-indigo-50 flex items-center justify-between group transition-colors">
                        <div>
                          <span className="font-mono-data text-sm text-slate-800 font-medium" style={{ fontFamily: "'JetBrains Mono', monospace" }}>{u.shortCode}</span>
                          {u.tenantName && <span className="text-slate-400 text-xs ml-2">— {u.tenantName}</span>}
                        </div>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${statusStyle[u.status]}`}>{u.status}</span>
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
            <motion.button key={b} whileTap={{ scale: 0.96 }}
              onClick={() => setBuildingFilter(b)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all border ${
                buildingFilter === b
                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                  : 'bg-white text-slate-600 border-slate-200 hover:border-indigo-300 hover:text-indigo-600'
              }`}>{b}</motion.button>
          ))}
        </div>

        {/* Status filter */}
        <div className="flex gap-1.5 flex-wrap">
          {STATUSES.map(s => (
            <motion.button key={s} whileTap={{ scale: 0.96 }}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 border ${
                statusFilter === s
                  ? 'bg-slate-900 text-white border-slate-900'
                  : 'bg-white text-slate-600 border-slate-200 hover:border-slate-400'
              }`}>
              {s !== 'All' && <span className={`w-1.5 h-1.5 rounded-full ${statusDot[s]}`} />}
              {s}
            </motion.button>
          ))}
        </div>

        <div className="ml-auto flex items-center gap-2 text-xs text-slate-400">
          <SlidersHorizontal className="w-4 h-4" />
          <span>{filtered.length} of {apartments.length} units</span>
        </div>
      </div>

      {/* ─── Table ─── */}
      <div className="flex-1 overflow-auto scrollbar-thin px-6 py-4">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                {([
                  ['shortCode', 'Code'], ['name', 'Unit'], ['building', 'Building / Compound'],
                  ['type', 'Unit Type'], ['status', 'Status'], ['progress', 'Progress'],
                  ['budget', 'Budget vs Spend']
                ] as [SortKey, string][]).map(([k, label]) => (
                  <th key={k} onClick={() => handleSort(k)}
                    className="text-left px-4 py-3 font-semibold text-slate-600 text-xs uppercase tracking-wide cursor-pointer hover:text-slate-900 select-none whitespace-nowrap">
                    {label}<SortIcon k={k} />
                  </th>
                ))}
                <th className="text-left px-4 py-3 font-semibold text-slate-600 text-xs uppercase tracking-wide">Tenant</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-600 text-xs uppercase tracking-wide">Move-In</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <AnimatePresence initial={false}>
                {filtered.map((apt, i) => (
                  <motion.tr key={apt.id}
                    initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: Math.min(i * 0.02, 0.3) }}
                    onClick={() => setSelectedUnit(apt)}
                    className="hover:bg-indigo-50/50 cursor-pointer transition-colors group"
                  >
                    <td className="px-4 py-3">
                      <span className="font-mono-data text-xs text-indigo-700 bg-indigo-50 px-2 py-1 rounded-lg border border-indigo-100 font-medium"
                        style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                        {apt.shortCode ?? '—'}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-semibold text-slate-800">{apt.name}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-lg bg-slate-800 flex items-center justify-center flex-shrink-0">
                          <Building2 className="w-3.5 h-3.5 text-white" />
                        </div>
                        <span className="text-slate-700">{apt.building}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-slate-600 text-xs">{apt.type}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${statusStyle[apt.status]}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${statusDot[apt.status]}`} />
                        {apt.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 w-36">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div className={`h-full rounded-full transition-all ${
                            apt.status === 'Overdue' ? 'bg-red-500' : apt.progress === 100 ? 'bg-emerald-500' : 'bg-amber-500'
                          }`} style={{ width: `${apt.progress}%` }} />
                        </div>
                        <span className="font-mono-data text-xs text-slate-500 w-8 text-right flex-shrink-0"
                          style={{ fontFamily: "'JetBrains Mono', monospace" }}>{apt.progress}%</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 w-44">
                      <div className="text-xs">
                        <div className="flex justify-between mb-1">
                          <span className="text-slate-400">Spent</span>
                          <span className="font-mono-data font-medium text-slate-700"
                            style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                            {apt.budget.total > 0 ? `QAR ${apt.budget.spent.toLocaleString()}` : '—'}
                          </span>
                        </div>
                        {apt.budget.total > 0 && (
                          <div className="h-1 bg-slate-100 rounded-full overflow-hidden">
                            <div className={`h-full rounded-full ${apt.budget.spent > apt.budget.total * 0.9 ? 'bg-red-400' : 'bg-emerald-500'}`}
                              style={{ width: `${Math.min((apt.budget.spent / apt.budget.total) * 100, 100)}%` }} />
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-slate-600 text-xs">{apt.tenantName || <span className="text-slate-300">—</span>}</td>
                    <td className="px-4 py-3 font-mono-data text-xs text-slate-500"
                      style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                      {apt.moveInDate || '—'}
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="py-16 text-center text-slate-400">
              <Search className="w-10 h-10 mx-auto mb-2 opacity-30" />
              <p className="text-sm">No units match your filters</p>
            </div>
          )}
        </div>
      </div>

      {/* ─── Unit Detail Panel ─── */}
      <AnimatePresence>
        {selectedUnit && (
          <UnitDetailPanel
            apartment={selectedUnit}
            onClose={() => setSelectedUnit(null)}
            onUpdate={updated => {
              setApartments(prev => prev.map(a => a.id === updated.id ? updated : a));
              setSelectedUnit(updated);
            }}
          />
        )}
      </AnimatePresence>

      {/* ─── Import Dialog ─── */}
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
