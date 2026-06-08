import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, DollarSign } from 'lucide-react';
import { Apartment } from '../../types/hub';

interface Props { apartment: Apartment; onUpdate: (a: Apartment) => void; }

export function BudgetTracker({ apartment }: Props) {
  const { total, spent } = apartment.budget;
  const remaining = total - spent;
  const pct = total > 0 ? Math.round((spent / total) * 100) : 0;
  const overBudget = spent > total;
  const variance = total - spent;

  const fmt = (v: number) => `QAR ${Math.abs(v).toLocaleString()}`;

  // Fake breakdown data
  const breakdown = [
    { label: 'Civil & Structural', spent: spent * 0.18, alloc: total * 0.20, color: 'bg-indigo-500' },
    { label: 'MEP (Mech/Elec/Plumb)', spent: spent * 0.25, alloc: total * 0.25, color: 'bg-blue-500' },
    { label: 'HVAC & AC Works', spent: spent * 0.20, alloc: total * 0.22, color: 'bg-cyan-500' },
    { label: 'Fit-Out & Carpentry', spent: spent * 0.22, alloc: total * 0.20, color: 'bg-amber-500' },
    { label: 'Painting & Finishing', spent: spent * 0.10, alloc: total * 0.08, color: 'bg-emerald-500' },
    { label: 'Contingency', spent: spent * 0.05, alloc: total * 0.05, color: 'bg-slate-400' },
  ];

  return (
    <div className="p-5 space-y-5">
      {/* Main budget card */}
      <div className={`rounded-2xl p-5 border ${overBudget ? 'bg-red-50 border-red-200' : 'bg-slate-50 border-slate-200'}`}>
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Total Budget</p>
            <p className="font-mono-data text-2xl font-bold text-slate-900 mt-0.5" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
              {total > 0 ? fmt(total) : '—'}
            </p>
          </div>
          <div className={`p-3 rounded-xl ${overBudget ? 'bg-red-100' : 'bg-white border border-slate-200'}`}>
            <DollarSign className={`w-6 h-6 ${overBudget ? 'text-red-600' : 'text-slate-500'}`} />
          </div>
        </div>

        <div className="h-3 bg-slate-200 rounded-full overflow-hidden mb-3">
          <motion.div animate={{ width: `${Math.min(pct, 100)}%` }} transition={{ duration: 0.8, ease: 'easeOut' }}
            className={`h-full rounded-full ${overBudget ? 'bg-red-500' : pct > 85 ? 'bg-amber-500' : 'bg-emerald-500'}`} />
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white rounded-xl p-3 border border-slate-200">
            <p className="text-xs text-slate-400 mb-1">Spent</p>
            <p className="font-mono-data font-semibold text-slate-800 text-sm" style={{ fontFamily: "'JetBrains Mono', monospace" }}>{fmt(spent)}</p>
            <p className="text-xs text-slate-500 mt-0.5">{pct}%</p>
          </div>
          <div className={`rounded-xl p-3 border ${remaining >= 0 ? 'bg-white border-slate-200' : 'bg-red-50 border-red-200'}`}>
            <p className="text-xs text-slate-400 mb-1">Remaining</p>
            <p className={`font-mono-data font-semibold text-sm ${remaining >= 0 ? 'text-emerald-700' : 'text-red-600'}`}
              style={{ fontFamily: "'JetBrains Mono', monospace" }}>
              {total > 0 ? fmt(remaining) : '—'}
            </p>
            <p className="text-xs text-slate-500 mt-0.5">{remaining >= 0 ? 'available' : 'over'}</p>
          </div>
          <div className={`rounded-xl p-3 border ${variance >= 0 ? 'bg-emerald-50 border-emerald-200' : 'bg-red-50 border-red-200'}`}>
            <p className="text-xs text-slate-400 mb-1">Variance</p>
            <div className="flex items-center gap-1">
              {variance >= 0 ? <TrendingDown className="w-3.5 h-3.5 text-emerald-600" /> : <TrendingUp className="w-3.5 h-3.5 text-red-600" />}
              <p className={`font-mono-data font-semibold text-sm ${variance >= 0 ? 'text-emerald-700' : 'text-red-600'}`}
                style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                {total > 0 ? `${Math.abs(Math.round((variance / total) * 100))}%` : '—'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Cost breakdown */}
      {total > 0 && (
        <div>
          <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide mb-3">Cost Breakdown by Category</p>
          <div className="space-y-3">
            {breakdown.map(item => {
              const itemPct = item.alloc > 0 ? Math.round((item.spent / item.alloc) * 100) : 0;
              return (
                <div key={item.label}>
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${item.color}`} />
                      <span className="text-slate-700 font-medium">{item.label}</span>
                    </div>
                    <div className="flex items-center gap-2 font-mono-data" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                      <span className="text-slate-500">{fmt(item.spent)}</span>
                      <span className="text-slate-300">/</span>
                      <span className="text-slate-400">{fmt(item.alloc)}</span>
                    </div>
                  </div>
                  <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <motion.div animate={{ width: `${Math.min(itemPct, 100)}%` }} transition={{ duration: 0.6, delay: 0.1 }}
                      className={`h-full rounded-full ${item.color}`} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* CAPEX vs OPEX */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-4">
          <p className="text-xs font-semibold text-indigo-600 uppercase tracking-wide mb-1">CAPEX</p>
          <p className="font-mono-data font-bold text-indigo-900 text-lg" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
            {fmt(spent * 0.70)}
          </p>
          <p className="text-xs text-indigo-400 mt-1">70% of spend</p>
        </div>
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
          <p className="text-xs font-semibold text-amber-600 uppercase tracking-wide mb-1">OPEX</p>
          <p className="font-mono-data font-bold text-amber-900 text-lg" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
            {fmt(spent * 0.30)}
          </p>
          <p className="text-xs text-amber-400 mt-1">30% of spend</p>
        </div>
      </div>
    </div>
  );
}
