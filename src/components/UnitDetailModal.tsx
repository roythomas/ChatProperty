import { X, Wind, TreePine, Layers, Home, User, Calendar, DollarSign, Maximize } from 'lucide-react';
import { Unit, Renovation } from '../types';
import { StatusBadge } from './StatusBadge';

interface UnitDetailModalProps {
  unit: Unit;
  renovations: Renovation[];
  onClose: () => void;
}

export function UnitDetailModal({ unit, renovations, onClose }: UnitDetailModalProps) {
  const unitRenovations = renovations.filter(r => r.unitId === unit.id);
  const totalInternalArea = unit.rooms.reduce((sum, r) => sum + r.area, 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-slate-800 to-slate-700">
          <div>
            <h2 className="text-xl font-bold text-white">Unit {unit.unitNumber}</h2>
            <p className="text-slate-300 text-sm mt-0.5">{unit.type} — Floor {unit.floor === 0 ? 'Ground' : unit.floor}</p>
          </div>
          <div className="flex items-center gap-3">
            <StatusBadge status={unit.status} />
            <button onClick={onClose} className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="overflow-y-auto flex-1">
          {/* Quick stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-6 border-b border-gray-100">
            <div className="text-center">
              <div className="flex justify-center mb-1"><Maximize className="w-5 h-5 text-blue-500" /></div>
              <p className="text-xl font-bold text-gray-900">{unit.internalArea} m²</p>
              <p className="text-xs text-gray-500">Internal Area</p>
            </div>
            <div className="text-center">
              <div className="flex justify-center mb-1"><Layers className="w-5 h-5 text-indigo-500" /></div>
              <p className="text-xl font-bold text-gray-900">{unit.externalArea} m²</p>
              <p className="text-xs text-gray-500">External Area</p>
            </div>
            <div className="text-center">
              <div className="flex justify-center mb-1"><Wind className="w-5 h-5 text-cyan-500" /></div>
              <p className="text-xl font-bold text-gray-900">{unit.acUnits}</p>
              <p className="text-xs text-gray-500">AC Units</p>
            </div>
            <div className="text-center">
              <div className="flex justify-center mb-1"><DollarSign className="w-5 h-5 text-green-500" /></div>
              <p className="text-xl font-bold text-gray-900">AED {unit.monthlyRent.toLocaleString()}</p>
              <p className="text-xs text-gray-500">Monthly Rent</p>
            </div>
          </div>

          <div className="p-6 space-y-6">
            {/* Features Row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className={`rounded-xl p-4 flex items-center gap-3 ${unit.acUnits > 0 ? 'bg-cyan-50 border border-cyan-100' : 'bg-gray-50 border border-gray-100'}`}>
                <Wind className={`w-5 h-5 ${unit.acUnits > 0 ? 'text-cyan-600' : 'text-gray-400'}`} />
                <div>
                  <p className="text-sm font-medium text-gray-900">Air Conditioning</p>
                  <p className="text-xs text-gray-500">{unit.acUnits} split unit{unit.acUnits !== 1 ? 's' : ''} installed</p>
                </div>
              </div>
              <div className={`rounded-xl p-4 flex items-center gap-3 ${unit.backGarden ? 'bg-green-50 border border-green-100' : 'bg-gray-50 border border-gray-100'}`}>
                <TreePine className={`w-5 h-5 ${unit.backGarden ? 'text-green-600' : 'text-gray-400'}`} />
                <div>
                  <p className="text-sm font-medium text-gray-900">Back Garden</p>
                  <p className="text-xs text-gray-500">{unit.backGarden ? `${unit.backGardenArea} m² private garden` : 'Not available'}</p>
                </div>
              </div>
              <div className={`rounded-xl p-4 flex items-center gap-3 ${unit.interlockWorks ? 'bg-amber-50 border border-amber-100' : 'bg-gray-50 border border-gray-100'}`}>
                <Layers className={`w-5 h-5 ${unit.interlockWorks ? 'text-amber-600' : 'text-gray-400'}`} />
                <div>
                  <p className="text-sm font-medium text-gray-900">Interlock Works</p>
                  <p className="text-xs text-gray-500">{unit.interlockWorks ? unit.interlockStatus : 'Not available'}</p>
                </div>
              </div>
            </div>

            {/* Rooms */}
            <div>
              <h3 className="text-base font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Home className="w-4 h-4 text-slate-600" />
                Room Measurements
                <span className="ml-auto text-sm font-normal text-gray-500">Total calculated: {totalInternalArea.toFixed(1)} m²</span>
              </h3>
              <div className="overflow-x-auto rounded-xl border border-gray-200">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200">
                      <th className="text-left px-4 py-3 font-semibold text-gray-700">Room</th>
                      <th className="text-right px-4 py-3 font-semibold text-gray-700">W (m)</th>
                      <th className="text-right px-4 py-3 font-semibold text-gray-700">L (m)</th>
                      <th className="text-right px-4 py-3 font-semibold text-gray-700">H (m)</th>
                      <th className="text-right px-4 py-3 font-semibold text-gray-700">Area (m²)</th>
                      <th className="text-center px-4 py-3 font-semibold text-gray-700">Flooring</th>
                      <th className="text-center px-4 py-3 font-semibold text-gray-700">Condition</th>
                      <th className="text-center px-4 py-3 font-semibold text-gray-700">AC</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {unit.rooms.map(room => (
                      <tr key={room.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-3 font-medium text-gray-900">{room.name}</td>
                        <td className="px-4 py-3 text-right text-gray-600">{room.width}</td>
                        <td className="px-4 py-3 text-right text-gray-600">{room.length}</td>
                        <td className="px-4 py-3 text-right text-gray-600">{room.height}</td>
                        <td className="px-4 py-3 text-right font-medium text-gray-900">{room.area.toFixed(1)}</td>
                        <td className="px-4 py-3 text-center">
                          <span className="text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full">{room.flooringType}</span>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <StatusBadge status={room.condition} size="sm" />
                        </td>
                        <td className="px-4 py-3 text-center">
                          {room.hasAC ? (
                            <span className="inline-flex items-center justify-center w-5 h-5 bg-cyan-100 text-cyan-700 rounded-full text-xs">✓</span>
                          ) : (
                            <span className="inline-flex items-center justify-center w-5 h-5 bg-gray-100 text-gray-400 rounded-full text-xs">—</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {unit.rooms.some(r => r.notes) && (
                <div className="mt-2 space-y-1">
                  {unit.rooms.filter(r => r.notes).map(r => (
                    <p key={r.id} className="text-xs text-gray-500 ml-2">• <span className="font-medium">{r.name}:</span> {r.notes}</p>
                  ))}
                </div>
              )}
            </div>

            {/* Tenant & Lease */}
            {unit.tenant && unit.lease && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
                  <h4 className="text-sm font-semibold text-blue-900 mb-3 flex items-center gap-2">
                    <User className="w-4 h-4" /> Tenant Information
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between"><span className="text-gray-600">Name</span><span className="font-medium text-gray-900">{unit.tenant.name}</span></div>
                    <div className="flex justify-between"><span className="text-gray-600">Phone</span><span className="font-medium text-gray-900">{unit.tenant.phone}</span></div>
                    <div className="flex justify-between"><span className="text-gray-600">Email</span><span className="font-medium text-gray-900 text-xs">{unit.tenant.email}</span></div>
                    <div className="flex justify-between"><span className="text-gray-600">Nationality</span><span className="font-medium text-gray-900">{unit.tenant.nationality}</span></div>
                    <div className="flex justify-between"><span className="text-gray-600">ID No.</span><span className="font-medium text-gray-900 text-xs">{unit.tenant.idNumber}</span></div>
                  </div>
                </div>
                <div className="bg-green-50 rounded-xl p-4 border border-green-100">
                  <h4 className="text-sm font-semibold text-green-900 mb-3 flex items-center gap-2">
                    <Calendar className="w-4 h-4" /> Lease Details
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between"><span className="text-gray-600">Start Date</span><span className="font-medium text-gray-900">{unit.lease.startDate}</span></div>
                    <div className="flex justify-between"><span className="text-gray-600">End Date</span><span className="font-medium text-gray-900">{unit.lease.endDate}</span></div>
                    <div className="flex justify-between"><span className="text-gray-600">Monthly Rent</span><span className="font-medium text-gray-900">AED {unit.lease.monthlyRent.toLocaleString()}</span></div>
                    <div className="flex justify-between"><span className="text-gray-600">Security Deposit</span><span className="font-medium text-gray-900">AED {unit.lease.securityDeposit.toLocaleString()}</span></div>
                    <div className="flex justify-between"><span className="text-gray-600">Status</span><StatusBadge status={unit.lease.status} size="sm" /></div>
                  </div>
                </div>
              </div>
            )}

            {/* Active Renovations */}
            {unitRenovations.length > 0 && (
              <div>
                <h3 className="text-base font-semibold text-gray-900 mb-3">Active Renovations</h3>
                <div className="space-y-2">
                  {unitRenovations.map(r => (
                    <div key={r.id} className="bg-amber-50 rounded-xl p-4 border border-amber-100 flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900 text-sm">{r.type}</p>
                        <p className="text-xs text-gray-500">{r.contractor} · LPO: {r.lpo.lpoNumber}</p>
                      </div>
                      <div className="text-right">
                        <StatusBadge status={r.status} size="sm" />
                        <p className="text-xs text-gray-500 mt-1">Due: {r.completionDate}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
