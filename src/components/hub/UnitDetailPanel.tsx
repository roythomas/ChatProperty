import { useState } from 'react';
import { motion } from 'framer-motion';
import { X, MapPin, CheckSquare, DollarSign, Settings, Wind, Home, User, Calendar } from 'lucide-react';
import { Apartment } from '../../types/hub';
import { HandoverChecklist } from './HandoverChecklist';
import { BudgetTracker } from './BudgetTracker';
import { FloorPlanPins } from './FloorPlanPins';
import { AdminConfigModal } from './AdminConfigModal';

interface Props { apartment: Apartment; onClose: () => void; onUpdate: (a: Apartment) => void; }

type PanelTab = 'checklist' | 'budget' | 'floorplan' | 'config';

const statusColors: Record<string, string> = {
  'Completed': 'text-emerald-700 bg-emerald-50 border-emerald-200',
  'In Progress': 'text-amber-700 bg-amber-50 border-amber-200',
  'Overdue': 'text-red-700 bg-red-50 border-red-200',
  'Vacant': 'text-slate-600 bg-slate-100 border-slate-200',
};

export function UnitDetailPanel({ apartment, onClose, onUpdate }: Props) {
  const [tab, setTab] = useState<PanelTab>('checklist');
  const [showConfig, setShowConfig] = useState(false);

  const tabs: { key: PanelTab; label: string; icon: typeof CheckSquare }[] = [
    { key: 'checklist', label: 'Handover', icon: CheckSquare },
    { key: 'budget', label: 'Budget', icon: DollarSign },
    { key: 'floorplan', label: 'Floor Plan', icon: MapPin },
    { key: 'config', label: 'Config', icon: Settings },
  ];

  const budgetPct = apartment.budget.total > 0
    ? Math.round((apartment.budget.spent / apartment.budget.total) * 100) : 0;

  return (
    <>
      {/* Backdrop */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={onClose} className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40" />

      {/* Panel */}
      <motion.aside
        initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="fixed right-0 top-0 h-screen w-full max-w-xl bg-white shadow-2xl z-50 flex flex-col overflow-hidden"
      >
        {/* Header */}
        <div className="bg-slate-900 px-6 py-5 flex-shrink-0">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="font-mono-data text-indigo-300 text-xs font-medium"
                  style={{ fontFamily: "'JetBrains Mono', monospace" }}>{apartment.shortCode}</span>
                <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${statusColors[apartment.status]}`}>
                  {apartment.status}
                </span>
              </div>
              <h2 className="text-white font-semibold text-xl" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                {apartment.building} — Unit {apartment.name}
              </h2>
              <p className="text-slate-400 text-sm mt-0.5">{apartment.type} · Floor {apartment.floor}</p>
            </div>
            <button onClick={onClose} className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-white/10 transition-all">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick stats row */}
          <div className="grid grid-cols-4 gap-3 mt-4">
            {[
              { icon: Home, label: 'Beds', value: apartment.bedrooms === 0 ? 'Studio' : `${apartment.bedrooms} BR` },
              { icon: Wind, label: 'Furnished', value: apartment.furnished ? 'Yes' : 'No' },
              { icon: DollarSign, label: 'Budget', value: apartment.budget.total > 0 ? `QAR ${(apartment.budget.total / 1000).toFixed(0)}K` : '—' },
              { icon: CheckSquare, label: 'Done', value: `${budgetPct}%` },
            ].map(s => (
              <div key={s.label} className="bg-white/10 rounded-xl p-2.5 text-center">
                <s.icon className="w-4 h-4 text-slate-300 mx-auto mb-1" />
                <p className="font-mono-data text-white font-semibold text-sm" style={{ fontFamily: "'JetBrains Mono', monospace" }}>{s.value}</p>
                <p className="text-slate-400 text-xs">{s.label}</p>
              </div>
            ))}
          </div>

          {/* Tenant chip */}
          {apartment.tenantName && (
            <div className="mt-3 flex items-center gap-2 bg-white/10 rounded-xl px-3 py-2">
              <User className="w-4 h-4 text-slate-300" />
              <span className="text-white text-sm font-medium">{apartment.tenantName}</span>
              {apartment.moveInDate && (
                <span className="ml-auto font-mono-data text-xs text-slate-400 flex items-center gap-1"
                  style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                  <Calendar className="w-3 h-3" />{apartment.moveInDate}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-200 bg-slate-50 flex-shrink-0">
          {tabs.map(t => (
            <button key={t.key} onClick={() => { if (t.key === 'config') setShowConfig(true); else setTab(t.key); }}
              className={`flex-1 flex items-center justify-center gap-1.5 py-3 text-xs font-semibold transition-all ${
                tab === t.key && t.key !== 'config'
                  ? 'text-indigo-700 border-b-2 border-indigo-600 bg-white'
                  : 'text-slate-500 hover:text-slate-800'
              }`}>
              <t.icon className="w-4 h-4" />{t.label}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div className="flex-1 overflow-y-auto scrollbar-thin">
          {tab === 'checklist' && (
            <HandoverChecklist apartment={apartment} onUpdate={onUpdate} />
          )}
          {tab === 'budget' && (
            <BudgetTracker apartment={apartment} onUpdate={onUpdate} />
          )}
          {tab === 'floorplan' && (
            <FloorPlanPins apartment={apartment} onUpdate={onUpdate} />
          )}
        </div>

        {/* Progress bar at bottom */}
        <div className="flex-shrink-0 border-t border-slate-200 px-6 py-3 bg-slate-50">
          <div className="flex justify-between text-xs text-slate-500 mb-1.5">
            <span>Overall renovation progress</span>
            <span className="font-mono-data font-semibold text-slate-800" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
              {apartment.progress}%
            </span>
          </div>
          <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
            <motion.div initial={{ width: 0 }} animate={{ width: `${apartment.progress}%` }} transition={{ duration: 0.8, ease: 'easeOut' }}
              className={`h-full rounded-full ${apartment.status === 'Overdue' ? 'bg-red-500' : apartment.progress === 100 ? 'bg-emerald-500' : 'bg-amber-500'}`} />
          </div>
        </div>
      </motion.aside>

      {showConfig && (
        <AdminConfigModal apartment={apartment} onClose={() => setShowConfig(false)} onSave={updated => { onUpdate(updated); setShowConfig(false); }} />
      )}
    </>
  );
}
