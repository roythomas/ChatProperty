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
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={onClose} className="fixed inset-0 bg-black/20 backdrop-blur-[2px] z-40" />

      <motion.aside
        initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
        transition={{ type: 'spring', stiffness: 320, damping: 32 }}
        className="fixed right-0 top-0 h-screen w-full max-w-lg bg-white shadow-2xl z-50 flex flex-col overflow-hidden border-l border-gray-200"
      >
        {/* Header */}
        <div className="px-5 py-4 border-b border-gray-200 flex-shrink-0">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="font-mono-data text-xs text-indigo-600 font-medium">{apartment.shortCode}</span>
                <span className={`text-xs font-medium flex items-center gap-1 ${statusText[apartment.status]}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${statusDot[apartment.status]}`} />
                  {apartment.status}
                </span>
              </div>
              <h2 className="font-semibold text-gray-900 text-base font-display" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                {apartment.building} · Unit {apartment.name}
              </h2>
              <p className="text-sm text-gray-400 mt-0.5">{apartment.type} · Floor {apartment.floor}</p>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1.5 rounded-lg hover:bg-gray-100 transition-all">
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Quick stats */}
          <div className="grid grid-cols-4 gap-2 mt-4">
            {[
              { icon: Home, label: 'Beds', value: apartment.bedrooms === 0 ? 'Studio' : `${apartment.bedrooms} BR` },
              { icon: Wind, label: 'Furnished', value: apartment.furnished ? 'Yes' : 'No' },
              { icon: DollarSign, label: 'Budget', value: apartment.budget.total > 0 ? `${(apartment.budget.total / 1000).toFixed(0)}K` : '—' },
              { icon: CheckSquare, label: 'Spend', value: `${budgetPct}%` },
            ].map(s => (
              <div key={s.label} className="bg-gray-50 rounded-lg p-2.5 text-center border border-gray-200">
                <s.icon className="w-3.5 h-3.5 text-gray-400 mx-auto mb-1" />
                <p className="font-mono-data text-gray-900 font-semibold text-sm tabular-nums">{s.value}</p>
                <p className="text-gray-400 text-xs">{s.label}</p>
              </div>
            ))}
          </div>

          {/* Tenant */}
          {apartment.tenantName && (
            <div className="mt-3 flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2 border border-gray-200">
              <User className="w-3.5 h-3.5 text-gray-400" />
              <span className="text-gray-700 text-sm font-medium">{apartment.tenantName}</span>
              {apartment.moveInDate && (
                <span className="ml-auto font-mono-data text-xs text-gray-400 flex items-center gap-1">
                  <Calendar className="w-3 h-3" />{apartment.moveInDate}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 flex-shrink-0">
          {tabs.map(t => (
            <button key={t.key} onClick={() => { if (t.key === 'config') setShowConfig(true); else setTab(t.key); }}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-medium transition-all ${
                tab === t.key && t.key !== 'config'
                  ? 'text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50/50'
                  : 'text-gray-400 hover:text-gray-700'
              }`}>
              <t.icon className="w-3.5 h-3.5" />{t.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto scrollbar-thin">
          {tab === 'checklist' && <HandoverChecklist apartment={apartment} onUpdate={onUpdate} />}
          {tab === 'budget' && <BudgetTracker apartment={apartment} onUpdate={onUpdate} />}
          {tab === 'floorplan' && <FloorPlanPins apartment={apartment} onUpdate={onUpdate} />}
        </div>

        {/* Progress footer */}
        <div className="flex-shrink-0 border-t border-gray-200 px-5 py-3">
          <div className="flex justify-between text-xs text-gray-400 mb-1.5">
            <span>Overall progress</span>
            <span className="font-mono-data font-semibold text-gray-700 tabular-nums">{apartment.progress}%</span>
          </div>
          <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <motion.div initial={{ width: 0 }} animate={{ width: `${apartment.progress}%` }} transition={{ duration: 0.6, ease: 'easeOut' }}
              className={`h-full rounded-full ${apartment.status === 'Overdue' ? 'bg-red-400' : apartment.progress === 100 ? 'bg-emerald-500' : 'bg-indigo-500'}`} />
          </div>
        </div>
      </motion.aside>

      {showConfig && (
        <AdminConfigModal apartment={apartment} onClose={() => setShowConfig(false)}
          onSave={updated => { onUpdate(updated); setShowConfig(false); }} />
      )}
    </>
  );
}
