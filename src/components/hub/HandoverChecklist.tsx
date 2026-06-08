import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Circle, Key, Zap, Package, Paintbrush, Sparkles, ClipboardCheck } from 'lucide-react';
import { Apartment, ChecklistItem } from '../../types/hub';

const categoryIcon: Record<ChecklistItem['category'], typeof Key> = {
  Keys: Key, Utilities: Zap, Appliances: Package, Paint: Paintbrush, Cleaning: Sparkles, Inspection: ClipboardCheck,
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
      <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
        <div className="flex items-end justify-between mb-2">
          <div>
            <p className="text-sm font-medium text-gray-700">Handover Checklist</p>
            <p className="text-xs text-gray-400 mt-0.5">{done} of {items.length} items complete</p>
          </div>
          <span className="font-mono-data text-2xl font-semibold text-gray-900 tabular-nums">{pct}%</span>
        </div>
        <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
          <motion.div animate={{ width: `${pct}%` }} transition={{ duration: 0.6 }}
            className={`h-full rounded-full ${pct === 100 ? 'bg-emerald-500' : pct > 60 ? 'bg-indigo-500' : 'bg-amber-400'}`} />
        </div>
      </div>

      {/* Grouped items */}
      {(Object.entries(grouped) as [ChecklistItem['category'], ChecklistItem[]][]).map(([cat, catItems]) => {
        const Icon = categoryIcon[cat];
        const catDone = catItems.filter(i => i.done).length;
        return (
          <div key={cat}>
            <div className="flex items-center gap-2 mb-2">
              <Icon className="w-3.5 h-3.5 text-gray-400" />
              <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">{cat}</span>
              <span className="ml-auto text-xs text-gray-400 tabular-nums">{catDone}/{catItems.length}</span>
            </div>
            <div className="space-y-1">
              <AnimatePresence>
                {catItems.map(item => (
                  <motion.button key={item.id} layout
                    onClick={() => toggle(item.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg border text-left transition-all ${
                      item.done
                        ? 'bg-emerald-50 border-emerald-200'
                        : 'bg-white border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    {item.done
                      ? <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                      : <Circle className="w-4 h-4 text-gray-300 flex-shrink-0" />
                    }
                    <span className={`text-sm ${item.done ? 'line-through text-gray-400' : 'text-gray-700'}`}>{item.label}</span>
                  </motion.button>
                ))}
              </AnimatePresence>
            </div>
          </div>
        );
      })}

      {pct === 100 && (
        <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
          className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-center">
          <CheckCircle2 className="w-7 h-7 text-emerald-500 mx-auto mb-2" />
          <p className="font-medium text-emerald-800 text-sm">Handover Complete</p>
          <p className="text-emerald-600 text-xs mt-0.5">All checklist items verified</p>
        </motion.div>
      )}
    </div>
  );
}
