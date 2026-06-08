import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Plus, X, CheckCircle2, Clock } from 'lucide-react';
import { Apartment, FloorPlanPin } from '../../types/hub';

interface Props { apartment: Apartment; onUpdate: (a: Apartment) => void; }

const catColors: Record<FloorPlanPin['category'], string> = {
  Electrical: 'bg-yellow-400 border-yellow-600',
  Plumbing: 'bg-blue-400 border-blue-600',
  Civil: 'bg-slate-400 border-slate-600',
  Finish: 'bg-pink-400 border-pink-600',
  HVAC: 'bg-cyan-400 border-cyan-600',
  Other: 'bg-purple-400 border-purple-600',
};
const catText: Record<FloorPlanPin['category'], string> = {
  Electrical: 'text-yellow-800 bg-yellow-50 border-yellow-200',
  Plumbing: 'text-blue-800 bg-blue-50 border-blue-200',
  Civil: 'text-slate-800 bg-slate-100 border-slate-200',
  Finish: 'text-pink-800 bg-pink-50 border-pink-200',
  HVAC: 'text-cyan-800 bg-cyan-50 border-cyan-200',
  Other: 'text-purple-800 bg-purple-50 border-purple-200',
};

export function FloorPlanPins({ apartment, onUpdate }: Props) {
  const pins = apartment.floorPlanPins ?? [];
  const [adding, setAdding] = useState(false);
  const [selectedPin, setSelectedPin] = useState<FloorPlanPin | null>(null);
  const [newPin, setNewPin] = useState<Partial<FloorPlanPin>>({ category: 'Other', status: 'Pending' });
  const [clickCoords, setClickCoords] = useState<{ x: number; y: number } | null>(null);

  const handleMapClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!adding) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.round(((e.clientX - rect.left) / rect.width) * 100);
    const y = Math.round(((e.clientY - rect.top) / rect.height) * 100);
    setClickCoords({ x, y });
    setNewPin(prev => ({ ...prev, x, y }));
  };

  const savePin = () => {
    if (!newPin.title || !clickCoords) return;
    const pin: FloorPlanPin = {
      id: `pin-${Date.now()}`,
      x: clickCoords.x, y: clickCoords.y,
      title: newPin.title!, description: newPin.description,
      status: newPin.status as FloorPlanPin['status'] ?? 'Pending',
      category: newPin.category as FloorPlanPin['category'] ?? 'Other',
    };
    onUpdate({ ...apartment, floorPlanPins: [...pins, pin] });
    setAdding(false); setClickCoords(null); setNewPin({ category: 'Other', status: 'Pending' });
  };

  const togglePin = (id: string) => {
    onUpdate({ ...apartment, floorPlanPins: pins.map(p => p.id === id ? { ...p, status: p.status === 'Done' ? 'Pending' : 'Done' } : p) });
    setSelectedPin(prev => prev?.id === id ? { ...prev, status: prev.status === 'Done' ? 'Pending' : 'Done' } : prev);
  };

  const removePin = (id: string) => {
    onUpdate({ ...apartment, floorPlanPins: pins.filter(p => p.id !== id) });
    if (selectedPin?.id === id) setSelectedPin(null);
  };

  return (
    <div className="p-5 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-slate-700">Interactive Floor Plan</p>
          <p className="text-xs text-slate-400">{pins.length} pin{pins.length !== 1 ? 's' : ''} · {pins.filter(p => p.status === 'Done').length} resolved</p>
        </div>
        <motion.button whileTap={{ scale: 0.95 }} onClick={() => { setAdding(v => !v); setClickCoords(null); }}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-medium transition-all ${
            adding ? 'bg-red-100 text-red-700 border border-red-200' : 'bg-indigo-600 text-white hover:bg-indigo-700'
          }`}>
          {adding ? <><X className="w-4 h-4" /> Cancel</> : <><Plus className="w-4 h-4" /> Add Pin</>}
        </motion.button>
      </div>

      {/* Floor plan mock */}
      <div
        onClick={handleMapClick}
        className={`relative bg-slate-100 rounded-2xl border-2 ${adding ? 'border-indigo-400 border-dashed cursor-crosshair' : 'border-slate-200'} overflow-hidden`}
        style={{ height: 280 }}
      >
        {/* Stylised floor plan drawing */}
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 75" preserveAspectRatio="none">
          {/* Outer wall */}
          <rect x="5" y="5" width="90" height="65" fill="none" stroke="#94A3B8" strokeWidth="1.5" rx="1" />
          {/* Rooms */}
          <rect x="5" y="5" width="40" height="30" fill="#E2E8F0" stroke="#94A3B8" strokeWidth="0.8" />
          <rect x="45" y="5" width="50" height="30" fill="#E2E8F0" stroke="#94A3B8" strokeWidth="0.8" />
          <rect x="5" y="35" width="55" height="35" fill="#EFF6FF" stroke="#94A3B8" strokeWidth="0.8" />
          <rect x="60" y="35" width="35" height="20" fill="#F0FDF4" stroke="#94A3B8" strokeWidth="0.8" />
          <rect x="60" y="55" width="35" height="15" fill="#FFFBEB" stroke="#94A3B8" strokeWidth="0.8" />
          {/* Labels */}
          <text x="25" y="22" textAnchor="middle" fontSize="4" fill="#64748B" fontFamily="Inter">Master Bed</text>
          <text x="70" y="22" textAnchor="middle" fontSize="4" fill="#64748B" fontFamily="Inter">Living Room</text>
          <text x="32" y="55" textAnchor="middle" fontSize="4" fill="#64748B" fontFamily="Inter">Bedroom 2</text>
          <text x="77" y="46" textAnchor="middle" fontSize="3.5" fill="#64748B" fontFamily="Inter">Kitchen</text>
          <text x="77" y="64" textAnchor="middle" fontSize="3.5" fill="#64748B" fontFamily="Inter">Bathroom</text>
          {/* Doors */}
          <path d="M 44 25 Q 50 25 50 19" fill="none" stroke="#CBD5E1" strokeWidth="0.6" />
          <path d="M 44 50 Q 44 56 50 56" fill="none" stroke="#CBD5E1" strokeWidth="0.6" />
        </svg>

        {/* Pins */}
        {pins.map(pin => (
          <motion.button key={pin.id} initial={{ scale: 0 }} animate={{ scale: 1 }}
            onClick={e => { e.stopPropagation(); setSelectedPin(selectedPin?.id === pin.id ? null : pin); }}
            className="absolute transform -translate-x-1/2 -translate-y-full z-10"
            style={{ left: `${pin.x}%`, top: `${pin.y}%` }}
          >
            <div className={`w-5 h-5 rounded-full border-2 shadow-md flex items-center justify-center ${catColors[pin.category]}`}>
              {pin.status === 'Done'
                ? <CheckCircle2 className="w-3 h-3 text-white" />
                : <Clock className="w-3 h-3 text-white" />
              }
            </div>
          </motion.button>
        ))}

        {/* Click preview */}
        {adding && clickCoords && (
          <div className="absolute transform -translate-x-1/2 -translate-y-1/2 pointer-events-none z-20"
            style={{ left: `${clickCoords.x}%`, top: `${clickCoords.y}%` }}>
            <div className="w-6 h-6 rounded-full bg-indigo-500 border-2 border-white shadow-lg animate-pulse" />
          </div>
        )}

        {adding && !clickCoords && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <p className="text-indigo-600 font-medium text-sm bg-white/90 px-3 py-1.5 rounded-xl shadow">Click anywhere to place a pin</p>
          </div>
        )}
      </div>

      {/* Add pin form */}
      <AnimatePresence>
        {adding && clickCoords && (
          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
            className="bg-indigo-50 border border-indigo-200 rounded-2xl p-4 space-y-3">
            <p className="text-sm font-semibold text-indigo-800">New Pin at ({clickCoords.x}%, {clickCoords.y}%)</p>
            <input value={newPin.title ?? ''} onChange={e => setNewPin(p => ({ ...p, title: e.target.value }))}
              placeholder="Issue title (e.g. Water leak under sink)" required
              className="w-full px-3 py-2 border border-indigo-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400" />
            <textarea value={newPin.description ?? ''} onChange={e => setNewPin(p => ({ ...p, description: e.target.value }))}
              placeholder="Description (optional)" rows={2}
              className="w-full px-3 py-2 border border-indigo-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400 resize-none" />
            <div className="grid grid-cols-2 gap-2">
              <select value={newPin.category} onChange={e => setNewPin(p => ({ ...p, category: e.target.value as FloorPlanPin['category'] }))}
                className="px-3 py-2 border border-indigo-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400">
                {(['Electrical', 'Plumbing', 'Civil', 'Finish', 'HVAC', 'Other'] as FloorPlanPin['category'][]).map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              <motion.button whileTap={{ scale: 0.96 }} onClick={savePin}
                className="bg-indigo-600 text-white rounded-xl text-sm font-semibold hover:bg-indigo-700 transition-all">
                Save Pin
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Selected pin detail */}
      <AnimatePresence>
        {selectedPin && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${catText[selectedPin.category]}`}>{selectedPin.category}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${selectedPin.status === 'Done' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>{selectedPin.status}</span>
                </div>
                <p className="font-semibold text-slate-800 text-sm">{selectedPin.title}</p>
                {selectedPin.description && <p className="text-slate-500 text-xs mt-1">{selectedPin.description}</p>}
                <p className="font-mono-data text-xs text-slate-400 mt-1" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                  Position: {selectedPin.x}%, {selectedPin.y}%
                </p>
              </div>
              <div className="flex gap-1 ml-3">
                <motion.button whileTap={{ scale: 0.95 }} onClick={() => togglePin(selectedPin.id)}
                  className={`p-2 rounded-lg text-xs font-medium transition-all ${selectedPin.status === 'Done' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'}`}>
                  {selectedPin.status === 'Done' ? <Clock className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
                </motion.button>
                <motion.button whileTap={{ scale: 0.95 }} onClick={() => removePin(selectedPin.id)}
                  className="p-2 rounded-lg bg-red-100 text-red-600 hover:bg-red-200 transition-all">
                  <X className="w-4 h-4" />
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Pins list */}
      {pins.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">All Pins</p>
          <div className="space-y-1.5">
            {pins.map(pin => (
              <motion.button key={pin.id} layout onClick={() => setSelectedPin(selectedPin?.id === pin.id ? null : pin)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl border text-left transition-all text-sm ${
                  selectedPin?.id === pin.id ? 'border-indigo-300 bg-indigo-50' : 'border-slate-200 bg-white hover:border-slate-300'
                }`}>
                <div className={`w-3 h-3 rounded-full border ${catColors[pin.category]} flex-shrink-0`} />
                <span className="flex-1 text-slate-700 truncate">{pin.title}</span>
                <MapPin className="w-3.5 h-3.5 text-slate-300" />
                {pin.status === 'Done'
                  ? <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  : <Clock className="w-4 h-4 text-amber-500 flex-shrink-0" />
                }
              </motion.button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
