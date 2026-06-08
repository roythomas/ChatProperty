import { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Save } from 'lucide-react';
import { Apartment, ApartmentStatus } from '../../types/hub';

interface Props { apartment: Apartment; onClose: () => void; onSave: (a: Apartment) => void; }

export function AdminConfigModal({ apartment, onClose, onSave }: Props) {
  const [form, setForm] = useState({ ...apartment });

  const field = (label: string, key: keyof Apartment, type = 'text', options?: string[]) => (
    <div key={String(key)}>
      <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">{label}</label>
      {options ? (
        <select value={String(form[key] ?? '')} onChange={e => setForm(p => ({ ...p, [key]: e.target.value }))}
          className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-400">
          {options.map(o => <option key={o} value={o}>{o}</option>)}
        </select>
      ) : (
        <input type={type} value={String(form[key] ?? '')} onChange={e => setForm(p => ({ ...p, [key]: type === 'number' ? +e.target.value : e.target.value }))}
          className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-400" />
      )}
    </div>
  );

  return (
    <>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={onClose} className="fixed inset-0 bg-black/60 z-[60]" />
      <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
        className="fixed inset-0 flex items-center justify-center z-[70] p-4">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 bg-slate-900 border-b border-slate-700">
            <div>
              <h3 className="text-white font-semibold" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Admin Configuration</h3>
              <p className="text-slate-400 text-xs mt-0.5">{apartment.shortCode} — {apartment.building}</p>
            </div>
            <button onClick={onClose} className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-white/10 transition-all">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6 overflow-y-auto max-h-[70vh] space-y-4 scrollbar-thin">
            <div className="grid grid-cols-2 gap-4">
              {field('Short Code', 'shortCode')}
              {field('Unit Name', 'name')}
              {field('Building', 'building')}
              {field('Unit Type', 'type')}
              {field('Status', 'status', 'text', ['Completed', 'In Progress', 'Overdue', 'Vacant'])}
              {field('Progress (%)', 'progress', 'number')}
              {field('Floor', 'floor', 'number')}
              {field('Bedrooms', 'bedrooms', 'number')}
            </div>

            <div className="border-t border-slate-100 pt-4">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">Budget</p>
              <div className="grid grid-cols-2 gap-4">
                {field('Total Budget (QAR)', 'budget' as keyof Apartment, 'number')}
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">Spent (QAR)</label>
                  <input type="number" value={form.budget.spent}
                    onChange={e => setForm(p => ({ ...p, budget: { ...p.budget, spent: +e.target.value } }))}
                    className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-400" />
                </div>
              </div>
            </div>

            <div className="border-t border-slate-100 pt-4">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">Tenant & Lease</p>
              <div className="grid grid-cols-2 gap-4">
                {field('Tenant Name', 'tenantName')}
                {field('Move-In Date', 'moveInDate', 'date')}
                {field('Handover Date', 'handoverDate', 'date')}
                {field('Last Renovated', 'lastRenovatedDate', 'date')}
              </div>
            </div>

            <div className="border-t border-slate-100 pt-4">
              <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">Notes</label>
              <textarea value={form.notes ?? ''} rows={3}
                onChange={e => setForm(p => ({ ...p, notes: e.target.value }))}
                className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-400 resize-none" />
            </div>
          </div>

          <div className="flex gap-3 px-6 py-4 border-t border-slate-200 bg-slate-50">
            <button onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-slate-300 text-slate-700 text-sm font-medium hover:bg-white transition-all">
              Cancel
            </button>
            <motion.button whileTap={{ scale: 0.97 }} onClick={() => onSave({ ...form, status: form.status as ApartmentStatus })}
              className="flex-1 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 transition-all flex items-center justify-center gap-2">
              <Save className="w-4 h-4" /> Save Changes
            </motion.button>
          </div>
        </div>
      </motion.div>
    </>
  );
}
