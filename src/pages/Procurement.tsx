import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area, Legend } from 'recharts';
import { ShoppingCart, FileText, Clock, Download, Search, ChevronDown, ChevronRight, X } from 'lucide-react';
import { mockProcurement, mockGanttTasks } from '../data/hubMockData';
import { ProcurementRecord, GanttTask } from '../types/hub';
import * as XLSX from 'xlsx';

const statusStyle: Record<string, string> = {
  Draft: 'text-gray-500',
  Approved: 'text-indigo-600',
  Ordered: 'text-amber-600',
  Delivered: 'text-violet-600',
  Closed: 'text-emerald-600',
};

const statusDot: Record<string, string> = {
  Draft: 'bg-gray-300',
  Approved: 'bg-indigo-400',
  Ordered: 'bg-amber-400',
  Delivered: 'bg-violet-400',
  Closed: 'bg-emerald-500',
};

const typeStyle: Record<string, string> = {
  PR: 'bg-gray-100 text-gray-600',
  PO: 'bg-indigo-50 text-indigo-700',
  LPO: 'bg-violet-50 text-violet-700',
};

const GANTT_START = new Date('2024-03-01');
const GANTT_END = new Date('2024-05-15');
const totalDays = Math.round((GANTT_END.getTime() - GANTT_START.getTime()) / 86400000);

function dateToX(dateStr: string) {
  const d = new Date(dateStr);
  const days = Math.round((d.getTime() - GANTT_START.getTime()) / 86400000);
  return Math.max(0, Math.min(100, (days / totalDays) * 100));
}

function GanttRow({ task, onUpdate }: { task: GanttTask; onUpdate: (t: GanttTask) => void }) {
  const left = dateToX(task.startDate);
  const right = dateToX(task.endDate);
  const width = right - left;
  const [hovered, setHovered] = useState(false);

  return (
    <div className="flex items-center gap-3 py-1.5 hover:bg-gray-50 rounded-lg px-2 transition-colors">
      <div className="w-36 flex-shrink-0">
        <p className="text-xs font-medium text-gray-800 truncate">{task.unitName}</p>
        <p className="text-xs text-gray-400 truncate">{task.taskName}</p>
      </div>
      <div className="flex-1 relative h-7">
        <div className="absolute inset-y-0 left-0 right-0 flex">
          {Array.from({ length: 11 }).map((_, i) => (
            <div key={i} className="flex-1 border-l border-gray-100" />
          ))}
        </div>
        <div className="absolute inset-y-1 rounded-md overflow-hidden border"
          style={{ left: `${left}%`, width: `${width}%`, backgroundColor: task.overdue ? '#FEF2F2' : '#F5F3FF', borderColor: task.overdue ? '#FCA5A5' : '#C4B5FD' }}
          onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
        >
          <motion.div className="h-full rounded-md" style={{ width: `${task.progress}%`, backgroundColor: task.overdue ? '#F87171' : '#818CF8' }} />
          <div className="absolute inset-0 flex items-center px-1.5">
            <span className="text-xs font-medium truncate" style={{ color: task.overdue ? '#DC2626' : '#4F46E5' }}>{task.progress}%</span>
          </div>
        </div>
        {hovered && (
          <div className="absolute top-8 z-20 bg-gray-900 text-white text-xs rounded-lg px-3 py-1.5 shadow-lg whitespace-nowrap"
            style={{ left: `${left}%` }}>
            {task.contractor} · {task.startDate} → {task.endDate}
            {task.overdue && <span className="ml-2 text-red-300">⚠ Overdue</span>}
          </div>
        )}
      </div>
      <input type="range" min={0} max={100} value={task.progress}
        onChange={e => onUpdate({ ...task, progress: +e.target.value })}
        className="w-16 accent-indigo-600 flex-shrink-0" />
      <span className="font-mono-data text-xs text-gray-400 w-8 text-right tabular-nums">{task.progress}%</span>
    </div>
  );
}

function PRDetail({ record, onClose }: { record: ProcurementRecord; onClose: () => void }) {
  const lpoTotal = record.items.reduce((s, i) => s + i.total, 0);
  return (
    <>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={onClose} className="fixed inset-0 bg-black/25 backdrop-blur-[2px] z-50" />
      <motion.div initial={{ scale: 0.97, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.97, opacity: 0 }}
        className="fixed inset-0 flex items-center justify-center z-[60] p-4">
        <div className="bg-white rounded-2xl border border-gray-200 shadow-xl w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className={`text-xs px-2 py-0.5 rounded font-medium ${typeStyle[record.type]}`}>{record.type}</span>
                <span className="font-mono-data text-indigo-600 text-sm font-medium">{record.refCode}</span>
              </div>
              <h3 className="text-gray-900 font-semibold text-sm">{record.description}</h3>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1.5 rounded-lg hover:bg-gray-100 transition-all">
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="overflow-y-auto flex-1 p-5 space-y-4 scrollbar-thin">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {[
                ['Vendor', record.vendor], ['Manager', record.manager], ['Type', record.capex ? 'CAPEX' : 'OPEX'],
                ['Raised', record.raisedDate], ['Approved', record.approvedDate ?? '—'], ['Delivered', record.deliveryDate ?? '—'],
              ].map(([k, v]) => (
                <div key={k} className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                  <p className="text-xs text-gray-400 mb-0.5">{k}</p>
                  <p className="font-medium text-gray-800 text-sm">{v}</p>
                </div>
              ))}
            </div>
            <div className="overflow-x-auto rounded-xl border border-gray-200">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50">
                    {['Description', 'Qty', 'Unit', 'Unit Price', 'Total'].map(h => (
                      <th key={h} className={`px-4 py-2.5 text-xs font-medium text-gray-400 ${h === 'Description' ? 'text-left' : 'text-right'}`}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {record.items.map(item => (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-gray-800">{item.description}</td>
                      <td className="px-4 py-3 text-right font-mono-data text-gray-600 tabular-nums">{item.quantity.toLocaleString()}</td>
                      <td className="px-4 py-3 text-right text-gray-400 text-xs">{item.unit}</td>
                      <td className="px-4 py-3 text-right font-mono-data text-gray-700 tabular-nums">QAR {item.unitPrice.toLocaleString()}</td>
                      <td className="px-4 py-3 text-right font-mono-data font-semibold text-gray-900 tabular-nums">QAR {item.total.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="border-t border-gray-200 bg-gray-50">
                    <td colSpan={4} className="px-4 py-3 font-semibold text-gray-900 text-right text-sm">Total</td>
                    <td className="px-4 py-3 text-right font-mono-data font-bold text-gray-900 tabular-nums">QAR {lpoTotal.toLocaleString()}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
            {record.notes && <p className="text-sm text-gray-500 bg-gray-50 rounded-lg p-3 border border-gray-200">{record.notes}</p>}
          </div>
        </div>
      </motion.div>
    </>
  );
}

export function Procurement() {
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState<'All' | 'PR' | 'PO' | 'LPO'>('All');
  const [filterStatus, setFilterStatus] = useState('All');
  const [filterCapex, setFilterCapex] = useState<'All' | 'CAPEX' | 'OPEX'>('All');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [selectedPR, setSelectedPR] = useState<ProcurementRecord | null>(null);
  const [ganttTasks, setGanttTasks] = useState<GanttTask[]>(mockGanttTasks);

  const filtered = useMemo(() => mockProcurement.filter(r => {
    if (search && !r.refCode.toLowerCase().includes(search.toLowerCase()) &&
      !r.description.toLowerCase().includes(search.toLowerCase()) &&
      !r.vendor.toLowerCase().includes(search.toLowerCase())) return false;
    if (filterType !== 'All' && r.type !== filterType) return false;
    if (filterStatus !== 'All' && r.status !== filterStatus) return false;
    if (filterCapex !== 'All' && (r.capex ? 'CAPEX' : 'OPEX') !== filterCapex) return false;
    return true;
  }), [search, filterType, filterStatus, filterCapex]);

  const totalValue = mockProcurement.reduce((s, r) => s + r.totalValue, 0);
  const capexVal = mockProcurement.filter(r => r.capex).reduce((s, r) => s + r.totalValue, 0);
  const opexVal = totalValue - capexVal;

  const buildingData = useMemo(() => {
    const map: Record<string, number> = {};
    mockProcurement.forEach(r => { map[r.buildingCode] = (map[r.buildingCode] ?? 0) + r.totalValue; });
    return Object.entries(map).map(([code, value]) => ({ name: code, value }));
  }, []);

  const cumulativeData = [
    { month: 'Jan', planned: 80000, actual: 65000 },
    { month: 'Feb', planned: 140000, actual: 115000 },
    { month: 'Mar', planned: 220000, actual: 195000 },
    { month: 'Apr', planned: 310000, actual: 280000 },
    { month: 'May', planned: 400000, actual: 320000 },
  ];

  const COLORS = ['#6366F1', '#10B981', '#F59E0B', '#06B6D4', '#8B5CF6'];
  const tooltipStyle = { borderRadius: 8, border: '1px solid #E5E7EB', boxShadow: 'none', fontSize: 12 };

  const exportLedger = () => {
    const rows = filtered.map(r => ({ Ref: r.refCode, Type: r.type, Description: r.description, Vendor: r.vendor, Manager: r.manager, Status: r.status, 'CAPEX/OPEX': r.capex ? 'CAPEX' : 'OPEX', 'Total (QAR)': r.totalValue, Raised: r.raisedDate }));
    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Procurement');
    XLSX.writeFile(wb, `procurement-ledger-${new Date().toISOString().slice(0, 10)}.xlsx`);
  };

  return (
    <div className="p-6 space-y-6 max-w-[1400px]">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Procurement</h1>
          <p className="text-sm text-gray-400 mt-0.5">PR · PO · LPO ledger, Gantt timeline, and budget analytics</p>
        </div>
        <button onClick={exportLedger}
          className="flex items-center gap-1.5 px-3 py-2 bg-gray-900 text-white rounded-lg text-sm hover:bg-gray-800 transition-all">
          <Download className="w-3.5 h-3.5" /> Export Ledger
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Procurement', val: `QAR ${(totalValue / 1000).toFixed(0)}K`, sub: `${mockProcurement.length} records`, icon: ShoppingCart },
          { label: 'CAPEX', val: `QAR ${(capexVal / 1000).toFixed(0)}K`, sub: `${Math.round((capexVal / totalValue) * 100)}% of total`, icon: FileText },
          { label: 'OPEX', val: `QAR ${(opexVal / 1000).toFixed(0)}K`, sub: `${Math.round((opexVal / totalValue) * 100)}% of total`, icon: FileText },
          { label: 'Active Tasks', val: ganttTasks.filter(t => t.progress < 100).length, sub: `${ganttTasks.filter(t => t.overdue).length} overdue`, icon: Clock },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-xl p-5 border border-gray-200">
            <div className="flex items-start justify-between mb-3">
              <p className="text-xs text-gray-500">{s.label}</p>
              <s.icon className="w-4 h-4 text-gray-400" />
            </div>
            <p className="font-mono-data font-semibold text-xl text-gray-900 tabular-nums">{s.val}</p>
            <p className="text-xs text-gray-400 mt-1">{s.sub}</p>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 bg-white rounded-xl p-5 border border-gray-200">
          <h3 className="font-medium text-gray-900 text-sm mb-0.5">Cumulative Spend vs Budget</h3>
          <p className="text-xs text-gray-400 mb-4">Actual vs planned (QAR)</p>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={cumulativeData}>
              <defs>
                <linearGradient id="planGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366F1" stopOpacity={0.1} /><stop offset="95%" stopColor="#6366F1" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="actGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.1} /><stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#9CA3AF' }} axisLine={false} tickLine={false} tickFormatter={v => `${(v / 1000).toFixed(0)}K`} />
              <Tooltip formatter={(v: number) => `QAR ${v.toLocaleString()}`} contentStyle={tooltipStyle} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Area type="monotone" dataKey="planned" name="Planned" stroke="#6366F1" strokeWidth={2} fill="url(#planGrad)" dot={false} />
              <Area type="monotone" dataKey="actual" name="Actual" stroke="#10B981" strokeWidth={2} fill="url(#actGrad)" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl p-5 border border-gray-200">
          <h3 className="font-medium text-gray-900 text-sm mb-0.5">Budget by Building</h3>
          <p className="text-xs text-gray-400 mb-3">Distribution</p>
          <ResponsiveContainer width="100%" height={150}>
            <PieChart>
              <Pie data={buildingData} cx="50%" cy="50%" outerRadius={62} paddingAngle={2} dataKey="value">
                {buildingData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip formatter={(v: number) => `QAR ${v.toLocaleString()}`} contentStyle={tooltipStyle} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-1.5 mt-2">
            {buildingData.map((d, i) => (
              <div key={d.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                  <span className="text-gray-500">{d.name}</span>
                </div>
                <span className="font-mono-data text-gray-700 tabular-nums">QAR {d.value.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Gantt */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-200">
          <h3 className="font-medium text-gray-900 text-sm">Work Timeline</h3>
          <p className="text-xs text-gray-400 mt-0.5">Mar 1 – May 15, 2024 · Drag slider to update</p>
        </div>
        <div className="px-4 py-3">
          <div className="flex mb-2 ml-40 pl-3">
            {['Mar', 'Apr', 'May'].map(m => (
              <div key={m} className="flex-1 text-xs text-gray-400 text-center">{m}</div>
            ))}
          </div>
          <div className="space-y-0.5">
            {ganttTasks.map(task => (
              <GanttRow key={task.id} task={task} onUpdate={t => setGanttTasks(prev => prev.map(g => g.id === t.id ? t : g))} />
            ))}
          </div>
          <div className="flex items-center gap-4 mt-3 pt-3 border-t border-gray-100">
            {[['On Track', '#818CF8'], ['Overdue', '#F87171']].map(([label, color]) => (
              <div key={label} className="flex items-center gap-1.5 text-xs text-gray-400">
                <div className="w-3 h-3 rounded" style={{ backgroundColor: color + '66', border: `1px solid ${color}` }} />
                {label}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Ledger */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-200 flex flex-wrap gap-2.5 items-center">
          <h3 className="font-medium text-gray-900 text-sm mr-1">PR / PO / LPO Ledger</h3>
          <div className="relative flex-1 min-w-44">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
            <input type="text" placeholder="Search ref, vendor…" value={search} onChange={e => setSearch(e.target.value)}
              className="w-full pl-8 pr-3 py-2 border border-gray-200 rounded-lg text-sm bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all placeholder:text-gray-400" />
          </div>
          <div className="flex gap-1.5">
            {(['All', 'PR', 'PO', 'LPO'] as const).map(t => (
              <button key={t} onClick={() => setFilterType(t)}
                className={`px-2.5 py-1.5 rounded-md text-xs font-medium transition-all ${filterType === t ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>{t}</button>
            ))}
          </div>
          <div className="flex gap-1.5">
            {(['All', 'CAPEX', 'OPEX'] as const).map(t => (
              <button key={t} onClick={() => setFilterCapex(t)}
                className={`px-2.5 py-1.5 rounded-md text-xs font-medium transition-all ${filterCapex === t ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>{t}</button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                {['', 'Reference', 'Description', 'Vendor', 'Manager', 'Type', 'Status', 'Value (QAR)', 'Raised'].map(h => (
                  <th key={h} className={`px-4 py-3 text-xs font-medium text-gray-400 whitespace-nowrap ${h === 'Value (QAR)' ? 'text-right' : 'text-left'}`}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              <AnimatePresence>
                {filtered.map(record => (
                  <>
                    <motion.tr key={record.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                      onClick={() => setSelectedPR(record)}
                      className="hover:bg-gray-50 cursor-pointer transition-colors">
                      <td className="px-4 py-3">
                        <button onClick={e => { e.stopPropagation(); setExpandedId(expandedId === record.id ? null : record.id); }}
                          className="text-gray-300 hover:text-gray-500 transition-colors">
                          {expandedId === record.id ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                        </button>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <span className={`text-xs px-1.5 py-0.5 rounded font-medium ${typeStyle[record.type]}`}>{record.type}</span>
                          <span className="font-mono-data text-indigo-600 text-xs font-medium">{record.refCode}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-gray-800 max-w-xs"><p className="truncate text-sm">{record.description}</p></td>
                      <td className="px-4 py-3 text-gray-500 text-xs">{record.vendor}</td>
                      <td className="px-4 py-3 text-gray-500 text-xs">{record.manager}</td>
                      <td className="px-4 py-3">
                        <span className={`text-xs font-medium ${record.capex ? 'text-indigo-600' : 'text-amber-600'}`}>{record.capex ? 'CAPEX' : 'OPEX'}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center gap-1.5 text-xs font-medium ${statusStyle[record.status]}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${statusDot[record.status]}`} />
                          {record.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right font-mono-data font-semibold text-gray-900 tabular-nums">{record.totalValue.toLocaleString()}</td>
                      <td className="px-4 py-3 font-mono-data text-xs text-gray-400 tabular-nums">{record.raisedDate}</td>
                    </motion.tr>
                    {expandedId === record.id && (
                      <tr key={`${record.id}-exp`} className="bg-gray-50/60">
                        <td colSpan={9} className="px-8 py-3">
                          <div className="space-y-1">
                            {record.items.map(item => (
                              <div key={item.id} className="flex items-center justify-between text-xs text-gray-500 py-1 border-b border-gray-100 last:border-0">
                                <span className="flex-1">{item.description}</span>
                                <span className="font-mono-data ml-4 tabular-nums">{item.quantity} {item.unit}</span>
                                <span className="font-mono-data ml-4 tabular-nums">× QAR {item.unitPrice.toLocaleString()}</span>
                                <span className="font-mono-data font-semibold text-gray-800 ml-4 tabular-nums">= QAR {item.total.toLocaleString()}</span>
                              </div>
                            ))}
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </div>

      <AnimatePresence>
        {selectedPR && <PRDetail record={selectedPR} onClose={() => setSelectedPR(null)} />}
      </AnimatePresence>
    </div>
  );
}
