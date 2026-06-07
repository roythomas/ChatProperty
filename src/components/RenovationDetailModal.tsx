import { X, Building, Hash, User, Phone, FileText, DollarSign, Calendar, CheckCircle2, Clock, Circle } from 'lucide-react';
import { Renovation } from '../types';
import { StatusBadge } from './StatusBadge';
import { ProgressBar } from './ProgressBar';

interface RenovationDetailModalProps {
  renovation: Renovation;
  onClose: () => void;
}

const scopeStatusIcon = (status: string) => {
  if (status === 'Completed') return <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />;
  if (status === 'In Progress') return <Clock className="w-4 h-4 text-blue-500 flex-shrink-0" />;
  return <Circle className="w-4 h-4 text-gray-300 flex-shrink-0" />;
};

export function RenovationDetailModal({ renovation, onClose }: RenovationDetailModalProps) {
  const lpoTotal = renovation.lpo.items.reduce((s, i) => s + i.total, 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-start justify-between px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-blue-800 to-blue-700">
          <div>
            <h2 className="text-xl font-bold text-white">{renovation.type}</h2>
            <p className="text-blue-200 text-sm mt-0.5">
              {renovation.propertyName} · Unit {renovation.unitNumber}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <StatusBadge status={renovation.status} />
            <button onClick={onClose} className="text-blue-300 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="overflow-y-auto flex-1">
          <div className="p-6 space-y-6">
            {/* Progress & Key Dates */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
                <p className="text-xs text-gray-500 mb-1">Progress</p>
                <p className="text-2xl font-bold text-blue-700">{renovation.progress}%</p>
                <ProgressBar value={renovation.progress} showLabel={false} />
              </div>
              <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                <p className="text-xs text-gray-500 mb-1">Start Date</p>
                <p className="text-sm font-semibold text-gray-900">{renovation.startDate}</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                <p className="text-xs text-gray-500 mb-1">Planned Completion</p>
                <p className="text-sm font-semibold text-gray-900">{renovation.completionDate}</p>
              </div>
              <div className={`rounded-xl p-4 border ${renovation.actualCompletionDate ? 'bg-green-50 border-green-100' : 'bg-gray-50 border-gray-100'}`}>
                <p className="text-xs text-gray-500 mb-1">Actual Completion</p>
                <p className="text-sm font-semibold text-gray-900">{renovation.actualCompletionDate ?? '—'}</p>
              </div>
            </div>

            {/* Contractor & Property Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                <h4 className="text-sm font-semibold text-slate-800 mb-3 flex items-center gap-2">
                  <User className="w-4 h-4" /> Contractor
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex gap-2"><User className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" /><span className="font-medium text-gray-900">{renovation.contractor}</span></div>
                  <div className="flex gap-2"><Phone className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" /><span className="text-gray-700">{renovation.contractorPhone}</span></div>
                </div>
              </div>
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                <h4 className="text-sm font-semibold text-slate-800 mb-3 flex items-center gap-2">
                  <Building className="w-4 h-4" /> Property Details
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between"><span className="text-gray-500">Property</span><span className="font-medium text-gray-900">{renovation.propertyName}</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">Unit</span><span className="font-medium text-gray-900">{renovation.unitNumber}</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">Type</span><span className="font-medium text-gray-900">{renovation.type}</span></div>
                </div>
              </div>
            </div>

            {/* Scope of Work */}
            <div>
              <h4 className="text-sm font-semibold text-gray-800 mb-2 flex items-center gap-2">
                <FileText className="w-4 h-4" /> Scope of Work
              </h4>
              <p className="text-sm text-gray-700 bg-gray-50 rounded-xl p-4 border border-gray-100 leading-relaxed">{renovation.scopeOfWork}</p>
              {renovation.notes && (
                <p className="mt-2 text-xs text-gray-500 italic pl-1">Note: {renovation.notes}</p>
              )}
            </div>

            {/* Scope Items Checklist */}
            <div>
              <h4 className="text-sm font-semibold text-gray-800 mb-3">Work Items</h4>
              <div className="space-y-2">
                {renovation.items.map(item => (
                  <div key={item.id} className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 border border-gray-100">
                    {scopeStatusIcon(item.status)}
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{item.description}</p>
                      {item.area && <p className="text-xs text-gray-500">Area: {item.area}</p>}
                      {item.notes && <p className="text-xs text-gray-500 italic">{item.notes}</p>}
                    </div>
                    <StatusBadge status={item.status} size="sm" />
                  </div>
                ))}
              </div>
            </div>

            {/* LPO Details */}
            <div>
              <h4 className="text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <Hash className="w-4 h-4" /> Local Purchase Order (LPO)
              </h4>
              <div className="bg-amber-50 rounded-xl p-4 border border-amber-100 mb-3">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
                  <div><p className="text-xs text-gray-500">LPO Number</p><p className="font-semibold text-gray-900">{renovation.lpo.lpoNumber}</p></div>
                  <div><p className="text-xs text-gray-500">Issued Date</p><p className="font-semibold text-gray-900">{renovation.lpo.issuedDate}</p></div>
                  <div><p className="text-xs text-gray-500">Valid Until</p><p className="font-semibold text-gray-900">{renovation.lpo.validUntil}</p></div>
                  <div><p className="text-xs text-gray-500">Vendor</p><p className="font-semibold text-gray-900">{renovation.lpo.vendorName}</p></div>
                  <div><p className="text-xs text-gray-500">Vendor Contact</p><p className="font-semibold text-gray-900">{renovation.lpo.vendorContact}</p></div>
                  <div><p className="text-xs text-gray-500">LPO Amount</p><p className="font-semibold text-gray-900 text-amber-700">AED {renovation.lpo.amount.toLocaleString()}</p></div>
                </div>
              </div>

              {/* LPO Line Items */}
              <div className="overflow-x-auto rounded-xl border border-gray-200">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200">
                      <th className="text-left px-4 py-3 font-semibold text-gray-700">Description</th>
                      <th className="text-right px-4 py-3 font-semibold text-gray-700">Qty</th>
                      <th className="text-center px-4 py-3 font-semibold text-gray-700">Unit</th>
                      <th className="text-right px-4 py-3 font-semibold text-gray-700">Unit Price</th>
                      <th className="text-right px-4 py-3 font-semibold text-gray-700">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {renovation.lpo.items.map(item => (
                      <tr key={item.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-gray-800">{item.description}</td>
                        <td className="px-4 py-3 text-right text-gray-600">{item.quantity.toLocaleString()}</td>
                        <td className="px-4 py-3 text-center text-gray-600">{item.unit}</td>
                        <td className="px-4 py-3 text-right text-gray-600">AED {item.unitPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                        <td className="px-4 py-3 text-right font-medium text-gray-900">AED {item.total.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="bg-gray-50 border-t-2 border-gray-200">
                      <td colSpan={4} className="px-4 py-3 font-bold text-gray-900 text-right">Total</td>
                      <td className="px-4 py-3 text-right font-bold text-gray-900">AED {lpoTotal.toLocaleString()}</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>

            {/* Cost Summary */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 text-center">
                <DollarSign className="w-5 h-5 text-gray-400 mx-auto mb-1" />
                <p className="text-lg font-bold text-gray-900">AED {renovation.estimatedCost.toLocaleString()}</p>
                <p className="text-xs text-gray-500">Estimated Cost</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 text-center">
                <Calendar className="w-5 h-5 text-gray-400 mx-auto mb-1" />
                <p className="text-lg font-bold text-gray-900">AED {renovation.lpo.amount.toLocaleString()}</p>
                <p className="text-xs text-gray-500">LPO Value</p>
              </div>
              <div className={`rounded-xl p-4 border text-center ${renovation.actualCost ? 'bg-green-50 border-green-100' : 'bg-gray-50 border-gray-100'}`}>
                <CheckCircle2 className={`w-5 h-5 mx-auto mb-1 ${renovation.actualCost ? 'text-green-500' : 'text-gray-400'}`} />
                <p className={`text-lg font-bold ${renovation.actualCost ? 'text-green-700' : 'text-gray-400'}`}>
                  {renovation.actualCost ? `AED ${renovation.actualCost.toLocaleString()}` : '—'}
                </p>
                <p className="text-xs text-gray-500">Actual Cost</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
