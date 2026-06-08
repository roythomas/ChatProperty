import { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Save } from 'lucide-react';
import { Apartment, ApartmentStatus } from '../../types/hub';

interface Props { apartment: Apartment; onClose: () => void; onSave: (a: Apartment) => void; }

export function AdminConfigModal({ apartment, onClose, onSave }: Props) {
  const [form, setForm] = useState({ ...apartment });

  const inputCls = "w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all";
  const labelCls = "block text-xs font-medium text-gray-500 mb-1";

  const field = (label: string, key: keyof Apartment, type = 'text', options?: string[]) => (
    <div key={String(key)}>
      <label className={labelCls}>{label}</label>
      {options ? (
        <select value={String(form[key] ?? '')} onChange={e => setForm(p => ({ ...p, [key]: e.target.value }))} className={inputCls}>
          {options.map(o => <option key={o} value={o}>{o}</option>)}
        </select>
      ) : (
        <input type={type} value={String(form[key] ?? '')}
          onChange={e => setForm(p => ({ ...p, [key]: type === 'number' ? +e.target.value : e.target.value }))}
          className={inputCls} />
      )}
    </div>
  );

  return (
    <>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={onClose} className="fixed inset-0 bg-black/25 backdrop-blur-[2px] z-[60]" />
      <motion.div initial={{ scale: 0.97, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.97, opacity: 0 }}
        className="fixed inset-0 flex items-center justify-center z-[70] p-4">
        <div className="bg-white rounded-2xl border border-gray-200 shadow-xl w-full max-w-lg overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
            <div>
              <h3 className="font-semibold text-gray-900 text-sm">Unit Configuration</h3>
              <p className="text-gray-400 text-xs mt-0.5">{apartment.shortCode} · {apartment.building}</p>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1.5 rounded-lg hover:bg-gray-100 transition-all">
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="p-5 overflow-y-auto max-h-[65vh] space-y-4 scrollbar-thin">
            <div className="grid grid-cols-2 gap-3">
              {field('Short Code', 'shortCode')}
              {field('Unit Name', 'name')}
              {field('Building', 'building')}
              {field('Unit Type', 'type')}
              {field('Status', 'status', 'text', ['Completed', 'In Progress', 'Overdue', 'Vacant'])}
              {field('Progress (%)', 'progress', 'number')}
              {field('Floor', 'floor', 'number')}
              {field('Bedrooms', 'bedrooms', 'number')}
            </div>

            <div className="border-t border-gray-100 pt-4">
              <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-3">Budget</p>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelCls}>Total Budget (QAR)</label>
                  <input type="number" value={form.budget.total}
                    onChange={e => setForm(p => ({ ...p, budget: { ...p.budget, total: +e.target.value } }))}
                    className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>Spent (QAR)</label>
                  <input type="number" value={form.budget.spent}
                    onChange={e => setForm(p => ({ ...p, budget: { ...p.budget, spent: +e.target.value } }))}
                    className={inputCls} />
                </div>
              </div>
            </div>

            <div className="border-t border-gray-100 pt-4">
              <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-3">Tenant & Lease</p>
              <div className="grid grid-cols-2 gap-3">
                {field('Tenant Name', 'tenantName')}
                {field('Move-In Date', 'moveInDate', 'date')}
                {field('Handover Date', 'handoverDate', 'date')}
                {field('Last Renovated', 'lastRenovatedDate', 'date')}
              </div>
            </div>

            <div className="border-t border-gray-100 pt-4">
              <label className={labelCls}>Notes</label>
              <textarea value={form.notes ?? ''} rows={3}
                onChange={e => setForm(p => ({ ...p, notes: e.target.value }))}
                className={`${inputCls} resize-none`} />
            </div>
          </div>

          <div className="flex gap-3 px-5 py-4 border-t border-gray-200">
            <button onClick={onClose}
              className="flex-1 py-2.5 rounded-xl border border-gray-200 text-gray-600 text-sm font-medium hover:bg-gray-50 transition-all">
              Cancel
            </button>
            <motion.button whileTap={{ scale: 0.97 }}
              onClick={() => onSave({ ...form, status: form.status as ApartmentStatus })}
              className="flex-1 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 transition-all flex items-center justify-center gap-2">
              <Save className="w-3.5 h-3.5" /> Save Changes
            </motion.button>
          </div>
        </div>
      </motion.div>
    </>
  );
}
