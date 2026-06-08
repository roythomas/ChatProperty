import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area, Legend } from 'recharts';
import { ShoppingCart, FileText, CheckCircle2, Clock, Download, Search, ChevronDown, ChevronRight, X } from 'lucide-react';
import { mockProcurement, mockGanttTasks, mockApartments } from '../data/hubMockData';
import { ProcurementRecord, GanttTask } from '../types/hub';
import * as XLSX from 'xlsx';

const statusStyle: Record<string, string> = {
  Draft: 'bg-slate-100 text-slate-600 border-slate-200',
  Approved: 'bg-blue-50 text-blue-700 border-blue-200',
  Ordered: 'bg-amber-50 text-amber-700 border-amber-200',
  Delivered: 'bg-purple-50 text-purple-700 border-purple-200',
  Closed: 'bg-emerald-50 text-emerald-700 border-emerald-200',
};

const typeStyle: Record<string, string> = {
  PR: 'bg-slate-100 text-slate-700',
  PO: 'bg-indigo-100 text-indigo-700',
  LPO: 'bg-violet-100 text-violet-700',
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
    <div className="flex items-center gap-3 py-2 group hover:bg-slate-50 rounded-xl px-2 transition-colors">
      <div className="w-40 flex-shrink-0">
        <p className="text-xs font-semibold text-slate-800 truncate">{task.unitName}</p>
        <p className="text-xs text-slate-400 truncate">{task.taskName}</p>
      </div>
      <div className="flex-1 relative h-8">
        <div className="absolute inset-y-0 left-0 right-0 flex">
          {Array.from({ length: 11 }).map((_, i) => (
            <div key={i} className="flex-1 border-l border-slate-100" />
          ))}
        </div>
        <div className="absolute inset-y-1 rounded-lg overflow-hidden"
          style={{ left: `${left}%`, width: `${width}%`, backgroundColor: task.overdue ? '#FEF2F2' : '#EFF6FF', borderColor: task.color, borderWidth: 1 }}
          onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
        >
          <motion.div className="h-full rounded-lg" style={{ width: `${task.progress}%`, backgroundColor: task.color + 'CC' }} />
          <div className="absolute inset-0 flex items-center px-2">
            <span className="text-xs font-semibold truncate" style={{ color: task.color }}>{task.progress}%</span>
          </div>
        </div>
        {hovered && (
          <div className="absolute top-10 z-20 bg-slate-900 text-white text-xs rounded-xl px-3 py-2 shadow-lg whitespace-nowrap"
            style={{ left: `${left}%` }}>
            {task.contractor} · {task.startDate} → {task.endDate}
            {task.overdue && <span className="ml-2 text-red-300">⚠ Overdue</span>}
          </div>
        )}
      </div>
      <input type="range" min={0} max={100} value={task.progress}
        onChange={e => onUpdate({ ...task, progress: +e.target.value })}
        className="w-20 accent-indigo-600 flex-shrink-0" />
      <span className="font-mono-data text-xs text-slate-500 w-8 text-right" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
        {task.progress}%
      </span>
    </div>
  );
}

function PRDetail({ record, onClose }: { record: ProcurementRecord; onClose: () => void }) {
  const lpoTotal = record.items.reduce((s, i) => s + i.total, 0);
  return (
    <>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={onClose} className="fixed inset-0 bg-black/50 z-50" />
      <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
        className="fixed inset-0 flex items-center justify-center z-[60] p-4">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 bg-slate-900">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className={`text-xs px-2 py-0.5 rounded font-semibold ${typeStyle[record.type]}`}>{record.type}</span>
                <span className="font-mono-data text-indigo-300 text-sm font-medium" style={{ fontFamily: "'JetBrains Mono', monospace" }}>{record.refCode}</span>
              </div>
              <h3 className="text-white font-semibold" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{record.description}</h3>
            </div>
            <button onClick={onClose} className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-white/10 transition-all"><X className="w-5 h-5" /></button>
          </div>
          <div className="overflow-y-auto flex-1 p-6 space-y-5 scrollbar-thin">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-sm">
              {[
                ['Vendor', record.vendor], ['Manager', record.manager], ['Type', record.capex ? 'CAPEX' : 'OPEX'],
                ['Raised', record.raisedDate], ['Approved', record.approvedDate ?? '—'], ['Delivered', record.deliveryDate ?? '—'],
              ].map(([k, v]) => (
                <div key={k} className="bg-slate-50 rounded-xl p-3 border border-slate-200">
                  <p className="text-xs text-slate-400 mb-0.5">{k}</p>
                  <p className="font-semibold text-slate-800 text-sm">{v}</p>
                </div>
              ))}
            </div>
            <div className="overflow-x-auto rounded-xl border border-slate-200">
              <table className="w-full text-sm">
                <thead><tr className="bg-slate-50 border-b border-slate-200">
                  {['Description', 'Qty', 'Unit', 'Unit Price', 'Total'].map(h => (
                    <th key={h} className={`px-4 py-3 text-xs font-semibold text-slate-600 ${h === 'Description' ? 'text-left' : 'text-right'}`}>{h}</th>
                  ))}
                </tr></thead>
                <tbody className="divide-y divide-slate-100">
                  {record.items.map(item => (
                    <tr key={item.id} className="hover:bg-slate-50">
                      <td className="px-4 py-3 text-slate-800">{item.description}</td>
                      <td className="px-4 py-3 text-right font-mono-data text-slate-600" style={{ fontFamily: "'JetBrains Mono', monospace" }}>{item.quantity.toLocaleString()}</td>
                      <td className="px-4 py-3 text-right text-slate-500">{item.unit}</td>
                      <td className="px-4 py-3 text-right font-mono-data text-slate-700" style={{ fontFamily: "'JetBrains Mono', monospace" }}>QAR {item.unitPrice.toLocaleString()}</td>
                      <td className="px-4 py-3 text-right font-mono-data font-semibold text-slate-900" style={{ fontFamily: "'JetBrains Mono', monospace" }}>QAR {item.total.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot><tr className="bg-slate-50 border-t-2 border-slate-200">
                  <td colSpan={4} className="px-4 py-3 font-bold text-slate-900 text-right">Total</td>
                  <td className="px-4 py-3 text-right font-mono-data font-bold text-slate-900" style={{ fontFamily: "'JetBrains Mono', monospace" }}>QAR {lpoTotal.toLocaleString()}</td>
                </tr></tfoot>
              </table>
            </div>
            {record.notes && <p className="text-sm text-slate-500 bg-slate-50 rounded-xl p-3 border border-slate-200">{record.notes}</p>}
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

  const COLORS = ['#4F46E5', '#059669', '#D97706', '#0EA5E9', '#8B5CF6'];

  const exportLedger = () => {
    const rows = filtered.map(r => ({ Ref: r.refCode, Type: r.type, Description: r.description, Vendor: r.vendor, Manager: r.manager, Status: r.status, 'CAPEX/OPEX': r.capex ? 'CAPEX' : 'OPEX', 'Total (QAR)': r.totalValue, Raised: r.raisedDate }));
    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Procurement');
    XLSX.writeFile(wb, `procurement-ledger-${new Date().toISOString().slice(0, 10)}.xlsx`);
  };

  return (
    <div className="p-6 space-y-6 bg-[#F8FAFC] min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="font-semibold text-2xl text-slate-900" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Procurement & Financials</h1>
          <p className="text-slate-500 text-sm mt-0.5">PR · PO · LPO ledger, Gantt timeline, and budget analytics</p>
        </div>
        <motion.button whileTap={{ scale: 0.96 }} onClick={exportLedger}
          className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-xl text-sm font-medium hover:bg-slate-800 transition-all">
          <Download className="w-4 h-4" /> Export Ledger
        </motion.button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Procurement', val: `QAR ${(totalValue / 1000).toFixed(0)}K`, sub: `${mockProcurement.length} records`, icon: ShoppingCart, bg: 'bg-indigo-50', ic: 'text-indigo-600' },
          { label: 'CAPEX', val: `QAR ${(capexVal / 1000).toFixed(0)}K`, sub: `${Math.round((capexVal / totalValue) * 100)}% of total`, icon: FileText, bg: 'bg-blue-50', ic: 'text-blue-600' },
          { label: 'OPEX', val: `QAR ${(opexVal / 1000).toFixed(0)}K`, sub: `${Math.round((opexVal / totalValue) * 100)}% of total`, icon: FileText, bg: 'bg-amber-50', ic: 'text-amber-600' },
          { label: 'Active Tasks', val: ganttTasks.filter(t => t.progress < 100).length, sub: `${ganttTasks.filter(t => t.overdue).length} overdue`, icon: Clock, bg: 'bg-red-50', ic: 'text-red-600' },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex items-start gap-4">
            <div className={`p-3 rounded-xl ${s.bg} flex-shrink-0`}><s.icon className={`w-5 h-5 ${s.ic}`} /></div>
            <div>
              <p className="text-xs text-slate-500 mb-0.5">{s.label}</p>
              <p className="font-mono-data font-bold text-lg text-slate-900" style={{ fontFamily: "'JetBrains Mono', monospace" }}>{s.val}</p>
              <p className="text-xs text-slate-400 mt-0.5">{s.sub}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
          <h3 className="font-semibold text-slate-800 mb-1 text-sm">Cumulative Spend vs Budget</h3>
          <p className="text-xs text-slate-400 mb-4">Actual expenditure vs planned budget (QAR)</p>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={cumulativeData}>
              <defs>
                <linearGradient id="planGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#4F46E5" stopOpacity={0.12} /><stop offset="95%" stopColor="#4F46E5" stopOpacity={0} /></linearGradient>
                <linearGradient id="actGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#059669" stopOpacity={0.12} /><stop offset="95%" stopColor="#059669" stopOpacity={0} /></linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} tickFormatter={v => `${(v / 1000).toFixed(0)}K`} />
              <Tooltip formatter={(v: number) => `QAR ${v.toLocaleString()}`} />
              <Legend />
              <Area type="monotone" dataKey="planned" name="Planned" stroke="#4F46E5" strokeWidth={2} fill="url(#planGrad)" />
              <Area type="monotone" dataKey="actual" name="Actual" stroke="#059669" strokeWidth={2} fill="url(#actGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
          <h3 className="font-semibold text-slate-800 mb-1 text-sm">Budget by Building</h3>
          <p className="text-xs text-slate-400 mb-3">Procurement distribution</p>
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie data={buildingData} cx="50%" cy="50%" outerRadius={65} paddingAngle={3} dataKey="value">
                {buildingData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip formatter={(v: number) => `QAR ${v.toLocaleString()}`} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-1.5 mt-2">
            {buildingData.map((d, i) => (
              <div key={d.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                  <span className="text-slate-600">{d.name}</span>
                </div>
                <span className="font-mono-data font-semibold text-slate-800" style={{ fontFamily: "'JetBrains Mono', monospace" }}>QAR {d.value.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Gantt Timeline */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-200">
          <h3 className="font-semibold text-slate-800" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Work Timeline (Gantt)</h3>
          <p className="text-xs text-slate-400 mt-0.5">Mar 1 – May 15, 2024 · Drag slider to update completion</p>
        </div>
        <div className="px-5 py-3">
          {/* Month headers */}
          <div className="flex mb-2 ml-44 pl-3">
            {['Mar', 'Apr', 'May'].map(m => (
              <div key={m} className="flex-1 text-xs font-semibold text-slate-400 text-center">{m}</div>
            ))}
          </div>
          <div className="space-y-1">
            {ganttTasks.map(task => (
              <GanttRow key={task.id} task={task} onUpdate={t => setGanttTasks(prev => prev.map(g => g.id === t.id ? t : g))} />
            ))}
          </div>
          {/* Legend */}
          <div className="flex items-center gap-4 mt-4 pt-3 border-t border-slate-100">
            {[['On Track', '#059669'], ['Overdue', '#DC2626'], ['In Progress', '#4F46E5']].map(([label, color]) => (
              <div key={label} className="flex items-center gap-1.5 text-xs text-slate-500">
                <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: color + '66', borderColor: color, borderWidth: 1 }} />
                {label}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Procurement Ledger */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-200 flex flex-wrap gap-3 items-center">
          <h3 className="font-semibold text-slate-800 mr-2" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>PR / PO / LPO Ledger</h3>
          <div className="relative flex-1 min-w-48">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input type="text" placeholder="Search ref, vendor, description…" value={search} onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-xl text-sm bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-400" />
          </div>
          {(['All', 'PR', 'PO', 'LPO'] as const).map(t => (
            <button key={t} onClick={() => setFilterType(t)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${filterType === t ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-slate-600 border-slate-200 hover:border-indigo-300'}`}>{t}</button>
          ))}
          {(['All', 'CAPEX', 'OPEX'] as const).map(t => (
            <button key={t} onClick={() => setFilterCapex(t)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${filterCapex === t ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-600 border-slate-200'}`}>{t}</button>
          ))}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="bg-slate-50 border-b border-slate-200">
              {['', 'Reference', 'Description', 'Vendor', 'Manager', 'Type', 'Status', 'Value (QAR)', 'Raised'].map(h => (
                <th key={h} className={`px-4 py-3 text-xs font-semibold text-slate-600 ${h === 'Value (QAR)' ? 'text-right' : 'text-left'}`}>{h}</th>
              ))}
            </tr></thead>
            <tbody className="divide-y divide-slate-100">
              <AnimatePresence>
                {filtered.map(record => (
                  <>
                    <motion.tr key={record.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                      onClick={() => setSelectedPR(record)}
                      className="hover:bg-indigo-50/40 cursor-pointer transition-colors">
                      <td className="px-4 py-3">
                        <button onClick={e => { e.stopPropagation(); setExpandedId(expandedId === record.id ? null : record.id); }}
                          className="text-slate-400 hover:text-slate-700 transition-colors">
                          {expandedId === record.id ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                        </button>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <span className={`text-xs px-1.5 py-0.5 rounded font-semibold ${typeStyle[record.type]}`}>{record.type}</span>
                          <span className="font-mono-data text-indigo-700 text-xs font-medium" style={{ fontFamily: "'JetBrains Mono', monospace" }}>{record.refCode}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-slate-800 max-w-xs"><p className="truncate">{record.description}</p></td>
                      <td className="px-4 py-3 text-slate-600 text-xs">{record.vendor}</td>
                      <td className="px-4 py-3 text-slate-600 text-xs">{record.manager}</td>
                      <td className="px-4 py-3"><span className={`text-xs px-2 py-0.5 rounded-full font-medium ${record.capex ? 'bg-indigo-50 text-indigo-700' : 'bg-amber-50 text-amber-700'}`}>{record.capex ? 'CAPEX' : 'OPEX'}</span></td>
                      <td className="px-4 py-3"><span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${statusStyle[record.status]}`}>{record.status}</span></td>
                      <td className="px-4 py-3 text-right font-mono-data font-semibold text-slate-900" style={{ fontFamily: "'JetBrains Mono', monospace" }}>{record.totalValue.toLocaleString()}</td>
                      <td className="px-4 py-3 font-mono-data text-xs text-slate-500" style={{ fontFamily: "'JetBrains Mono', monospace" }}>{record.raisedDate}</td>
                    </motion.tr>
                    {expandedId === record.id && (
                      <tr key={`${record.id}-exp`} className="bg-slate-50/80">
                        <td colSpan={9} className="px-8 py-3">
                          <div className="space-y-1">
                            {record.items.map(item => (
                              <div key={item.id} className="flex items-center justify-between text-xs text-slate-600 py-1 border-b border-slate-100 last:border-0">
                                <span className="flex-1">{item.description}</span>
                                <span className="font-mono-data ml-4" style={{ fontFamily: "'JetBrains Mono', monospace" }}>{item.quantity} {item.unit}</span>
                                <span className="font-mono-data ml-4" style={{ fontFamily: "'JetBrains Mono', monospace" }}>× QAR {item.unitPrice.toLocaleString()}</span>
                                <span className="font-mono-data font-semibold text-slate-800 ml-4" style={{ fontFamily: "'JetBrains Mono', monospace" }}>= QAR {item.total.toLocaleString()}</span>
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
