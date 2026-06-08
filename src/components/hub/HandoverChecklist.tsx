import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Circle, Key, Zap, Package, Paintbrush, Sparkles, ClipboardCheck } from 'lucide-react';
import { Apartment, ChecklistItem } from '../../types/hub';

const categoryIcon: Record<ChecklistItem['category'], typeof Key> = {
  Keys: Key, Utilities: Zap, Appliances: Package, Paint: Paintbrush, Cleaning: Sparkles, Inspection: ClipboardCheck,
};
const categoryColor: Record<ChecklistItem['category'], string> = {
  Keys: 'text-amber-600 bg-amber-50', Utilities: 'text-blue-600 bg-blue-50',
  Appliances: 'text-purple-600 bg-purple-50', Paint: 'text-pink-600 bg-pink-50',
  Cleaning: 'text-cyan-600 bg-cyan-50', Inspection: 'text-emerald-600 bg-emerald-50',
};

interface Props { apartment: Apartment; onUpdate: (a: Apartment) => void; }

export function HandoverChecklist({ apartment, onUpdate }: Props) {
  const items = apartment.checklist ?? [];
  const done = items.filter(i => i.done).length;
  const pct = items.length > 0 ? Math.round((done / items.length) * 100) : 0;

  const toggle = (id: string) => {
    const updated: Apartment = {
      ...apartment,
      checklist: items.map(i => i.id === id ? { ...i, done: !i.done } : i),
    };
    const newDone = (updated.checklist ?? []).filter(i => i.done).length;
    updated.progress = Math.round((newDone / items.length) * 100);
    onUpdate(updated);
  };

  const grouped: Partial<Record<ChecklistItem['category'], ChecklistItem[]>> = {};
  items.forEach(i => { if (!grouped[i.category]) grouped[i.category] = []; grouped[i.category]!.push(i); });

  return (
    <div className="p-5 space-y-5">
      {/* Progress summary */}
      <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200">
        <div className="flex items-end justify-between mb-2">
          <div>
            <p className="text-sm font-semibold text-slate-700">Handover Checklist</p>
            <p className="text-xs text-slate-400 mt-0.5">{done} of {items.length} items complete</p>
          </div>
          <span className="font-mono-data text-2xl font-bold text-slate-900" style={{ fontFamily: "'JetBrains Mono', monospace" }}>{pct}%</span>
        </div>
        <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
          <motion.div animate={{ width: `${pct}%` }} transition={{ duration: 0.6 }}
            className={`h-full rounded-full ${pct === 100 ? 'bg-emerald-500' : pct > 60 ? 'bg-amber-500' : 'bg-red-400'}`} />
        </div>
      </div>

      {/* Grouped checklist */}
      {(Object.entries(grouped) as [ChecklistItem['category'], ChecklistItem[]][]).map(([cat, catItems]) => {
        const Icon = categoryIcon[cat];
        const color = categoryColor[cat];
        const catDone = catItems.filter(i => i.done).length;
        return (
          <div key={cat}>
            <div className="flex items-center gap-2 mb-2">
              <div className={`w-6 h-6 rounded-lg flex items-center justify-center ${color}`}>
                <Icon className="w-3.5 h-3.5" />
              </div>
              <span className="text-xs font-semibold text-slate-600 uppercase tracking-wide">{cat}</span>
              <span className="ml-auto text-xs text-slate-400 font-mono-data">{catDone}/{catItems.length}</span>
            </div>
            <div className="space-y-1.5">
              <AnimatePresence>
                {catItems.map(item => (
                  <motion.button key={item.id} layout
                    onClick={() => toggle(item.id)}
                    className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl border text-left transition-all ${
                      item.done
                        ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                        : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                    }`}
                  >
                    {item.done
                      ? <CheckCircle2 className="w-4.5 h-4.5 text-emerald-600 flex-shrink-0 w-4 h-4" />
                      : <Circle className="w-4 h-4 text-slate-300 flex-shrink-0" />
                    }
                    <span className={`text-sm ${item.done ? 'line-through text-emerald-600' : ''}`}>{item.label}</span>
                  </motion.button>
                ))}
              </AnimatePresence>
            </div>
          </div>
        );
      })}

      {pct === 100 && (
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
          className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 text-center">
          <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
          <p className="font-semibold text-emerald-800">Handover Complete</p>
          <p className="text-emerald-600 text-sm mt-1">All checklist items verified ✓</p>
        </motion.div>
      )}
    </div>
  );
}
