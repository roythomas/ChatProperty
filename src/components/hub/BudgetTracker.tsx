import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { Apartment } from '../../types/hub';

interface Props { apartment: Apartment; onUpdate: (a: Apartment) => void; }

export function BudgetTracker({ apartment }: Props) {
  const { total, spent } = apartment.budget;
  const remaining = total - spent;
  const pct = total > 0 ? Math.round((spent / total) * 100) : 0;
  const overBudget = spent > total;
  const variance = total - spent;

  const fmt = (v: number) => `QAR ${Math.abs(v).toLocaleString()}`;

  const breakdown = [
    { label: 'Civil & Structural', spent: spent * 0.18, alloc: total * 0.20, color: 'bg-indigo-500' },
    { label: 'MEP (Mech/Elec/Plumb)', spent: spent * 0.25, alloc: total * 0.25, color: 'bg-blue-400' },
    { label: 'HVAC & AC Works', spent: spent * 0.20, alloc: total * 0.22, color: 'bg-cyan-400' },
    { label: 'Fit-Out & Carpentry', spent: spent * 0.22, alloc: total * 0.20, color: 'bg-amber-400' },
    { label: 'Painting & Finishing', spent: spent * 0.10, alloc: total * 0.08, color: 'bg-emerald-400' },
    { label: 'Contingency', spent: spent * 0.05, alloc: total * 0.05, color: 'bg-gray-300' },
  ];

  return (
    <div className="p-5 space-y-5">
      {/* Main card */}
      <div className={`rounded-xl p-5 border ${overBudget ? 'bg-red-50 border-red-200' : 'bg-gray-50 border-gray-200'}`}>
        <div className="flex items-start justify-between mb-1">
          <p className="text-xs text-gray-400">Total Budget</p>
          {overBudget && <span className="text-xs text-red-500 font-medium">Over budget</span>}
        </div>
        <p className="font-mono-data text-2xl font-semibold text-gray-900 tabular-nums">
          {total > 0 ? fmt(total) : '—'}
        </p>

        <div className="h-2 bg-gray-200 rounded-full overflow-hidden my-4">
          <motion.div animate={{ width: `${Math.min(pct, 100)}%` }} transition={{ duration: 0.8, ease: 'easeOut' }}
            className={`h-full rounded-full ${overBudget ? 'bg-red-400' : pct > 85 ? 'bg-amber-400' : 'bg-indigo-500'}`} />
        </div>

        <div className="grid grid-cols-3 gap-3">
          {[
            { label: 'Spent', value: fmt(spent), sub: `${pct}%`, ok: true },
            { label: 'Remaining', value: total > 0 ? fmt(remaining) : '—', sub: remaining >= 0 ? 'available' : 'over', ok: remaining >= 0 },
            { label: 'Variance', value: total > 0 ? `${Math.abs(Math.round((variance / total) * 100))}%` : '—', sub: '', ok: variance >= 0 },
          ].map(item => (
            <div key={item.label} className="bg-white rounded-lg p-3 border border-gray-200">
              <p className="text-xs text-gray-400 mb-1">{item.label}</p>
              <div className="flex items-center gap-1">
                {item.label === 'Variance' && (variance >= 0
                  ? <TrendingDown className="w-3 h-3 text-emerald-500" />
                  : <TrendingUp className="w-3 h-3 text-red-400" />
                )}
                <p className={`font-mono-data font-semibold text-sm tabular-nums ${!item.ok ? 'text-red-500' : 'text-gray-800'}`}>
                  {item.value}
                </p>
              </div>
              {item.sub && <p className="text-xs text-gray-400 mt-0.5">{item.sub}</p>}
            </div>
          ))}
        </div>
      </div>

      {/* Breakdown */}
      {total > 0 && (
        <div>
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-3">Cost Breakdown</p>
          <div className="space-y-3">
            {breakdown.map(item => {
              const itemPct = item.alloc > 0 ? Math.round((item.spent / item.alloc) * 100) : 0;
              return (
                <div key={item.label}>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${item.color}`} />
                      <span className="text-gray-700">{item.label}</span>
                    </div>
                    <div className="flex items-center gap-2 font-mono-data text-gray-400 tabular-nums">
                      <span>{fmt(item.spent)}</span>
                      <span className="text-gray-200">/</span>
                      <span>{fmt(item.alloc)}</span>
                    </div>
                  </div>
                  <div className="h-1 bg-gray-100 rounded-full overflow-hidden">
                    <motion.div animate={{ width: `${Math.min(itemPct, 100)}%` }} transition={{ duration: 0.6, delay: 0.1 }}
                      className={`h-full rounded-full ${item.color}`} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* CAPEX / OPEX */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-4">
          <p className="text-xs text-indigo-400 mb-1 uppercase tracking-wide">CAPEX</p>
          <p className="font-mono-data font-semibold text-indigo-800 tabular-nums">{fmt(spent * 0.70)}</p>
          <p className="text-xs text-indigo-300 mt-1">70% of spend</p>
        </div>
        <div className="bg-amber-50 border border-amber-100 rounded-xl p-4">
          <p className="text-xs text-amber-400 mb-1 uppercase tracking-wide">OPEX</p>
          <p className="font-mono-data font-semibold text-amber-800 tabular-nums">{fmt(spent * 0.30)}</p>
          <p className="text-xs text-amber-300 mt-1">30% of spend</p>
        </div>
      </div>
    </div>
  );
}
