import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Building2, MapPin, Calendar, Maximize, Wind, TreePine, Layers,
  Home, User, DollarSign, Wrench, Hash
} from 'lucide-react';
import { properties, renovations } from '../data/mockData';
import { Unit } from '../types';
import { StatusBadge } from '../components/StatusBadge';
import { ProgressBar } from '../components/ProgressBar';
import { UnitDetailModal } from '../components/UnitDetailModal';
import { RenovationDetailModal } from '../components/RenovationDetailModal';
import { Renovation } from '../types';

type Tab = 'overview' | 'units' | 'renovations';

export function PropertyDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [selectedUnit, setSelectedUnit] = useState<Unit | null>(null);
  const [selectedRenovation, setSelectedRenovation] = useState<Renovation | null>(null);

  const property = properties.find(p => p.id === id);
  if (!property) {
    return (
      <div className="p-6 text-center text-gray-500">
        <Building2 className="w-12 h-12 mx-auto mb-2 opacity-30" />
        <p>Property not found</p>
        <button onClick={() => navigate('/properties')} className="mt-4 text-blue-600 hover:underline">Back to Properties</button>
      </div>
    );
  }

  const propertyRenovations = renovations.filter(r => r.propertyId === id);
  const occupied = property.units.filter(u => u.status === 'Occupied').length;
  const vacant = property.units.filter(u => u.status === 'Vacant').length;
  const renovating = property.units.filter(u => u.status === 'Under Renovation').length;
  const reserved = property.units.filter(u => u.status === 'Reserved').length;
  const occupancyRate = Math.round((occupied / property.totalUnits) * 100);
  const monthlyRevenue = property.units.filter(u => u.status === 'Occupied').reduce((s, u) => s + u.monthlyRent, 0);

  const tabs: { key: Tab; label: string; count?: number }[] = [
    { key: 'overview', label: 'Overview' },
    { key: 'units', label: 'Units', count: property.totalUnits },
    { key: 'renovations', label: 'Renovations', count: propertyRenovations.length },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Back + Header */}
      <div>
        <button
          onClick={() => navigate('/properties')}
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 mb-4 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Properties
        </button>

        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 bg-slate-800 rounded-2xl flex items-center justify-center flex-shrink-0">
              <Building2 className="w-7 h-7 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-2xl font-bold text-gray-900">{property.name}</h1>
                <StatusBadge status={property.type} />
              </div>
              <div className="flex items-center gap-1.5 text-gray-500 text-sm mt-1">
                <MapPin className="w-4 h-4" />
                {property.address}
              </div>
              {property.description && <p className="text-sm text-gray-500 mt-1">{property.description}</p>}
            </div>
          </div>

          {/* Quick revenue */}
          <div className="bg-green-50 border border-green-100 rounded-xl px-5 py-3 text-center flex-shrink-0">
            <p className="text-2xl font-bold text-green-700">AED {monthlyRevenue.toLocaleString()}</p>
            <p className="text-xs text-gray-500">Monthly Revenue</p>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm text-center">
          <p className="text-2xl font-bold text-green-600">{occupied}</p>
          <p className="text-xs text-gray-500">Occupied</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm text-center">
          <p className="text-2xl font-bold text-gray-500">{vacant}</p>
          <p className="text-xs text-gray-500">Vacant</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm text-center">
          <p className="text-2xl font-bold text-amber-500">{renovating}</p>
          <p className="text-xs text-gray-500">Under Renovation</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm text-center">
          <p className="text-2xl font-bold text-blue-500">{reserved}</p>
          <p className="text-xs text-gray-500">Reserved</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <div className="flex gap-6">
          {tabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`pb-3 text-sm font-medium flex items-center gap-1.5 border-b-2 transition-all ${
                activeTab === tab.key
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-900'
              }`}
            >
              {tab.label}
              {tab.count !== undefined && (
                <span className={`rounded-full px-1.5 py-0.5 text-xs ${activeTab === tab.key ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-500'}`}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* OVERVIEW TAB */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Property Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Building2 className="w-4 h-4 text-slate-600" /> Property Information
              </h3>
              <div className="space-y-3 text-sm">
                {[
                  { label: 'Property Type', value: property.type },
                  { label: 'Year Built', value: property.yearBuilt },
                  { label: 'Total Units', value: property.totalUnits },
                  { label: 'Total Area', value: `${property.totalArea.toLocaleString()} m²` },
                  { label: 'Occupancy Rate', value: `${occupancyRate}%` },
                ].map(item => (
                  <div key={item.label} className="flex justify-between items-center py-1 border-b border-gray-50">
                    <span className="text-gray-500">{item.label}</span>
                    <span className="font-medium text-gray-900">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Home className="w-4 h-4 text-slate-600" /> Property Features
              </h3>
              <div className="space-y-3">
                <div className={`flex items-center gap-3 p-3 rounded-xl ${property.totalACUnits > 0 ? 'bg-cyan-50 border border-cyan-100' : 'bg-gray-50'}`}>
                  <Wind className={`w-5 h-5 ${property.totalACUnits > 0 ? 'text-cyan-600' : 'text-gray-400'}`} />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Air Conditioning</p>
                    <p className="text-xs text-gray-500">{property.totalACUnits} total AC units across all villas</p>
                  </div>
                </div>
                <div className={`flex items-center gap-3 p-3 rounded-xl ${property.backGarden ? 'bg-green-50 border border-green-100' : 'bg-gray-50'}`}>
                  <TreePine className={`w-5 h-5 ${property.backGarden ? 'text-green-600' : 'text-gray-400'}`} />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Back Garden</p>
                    <p className="text-xs text-gray-500">{property.backGarden ? `${property.backGardenArea} m² total garden area` : 'Not available'}</p>
                  </div>
                </div>
                <div className={`flex items-center gap-3 p-3 rounded-xl ${property.interlockWorks ? 'bg-amber-50 border border-amber-100' : 'bg-gray-50'}`}>
                  <Layers className={`w-5 h-5 ${property.interlockWorks ? 'text-amber-600' : 'text-gray-400'}`} />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Interlock Works</p>
                    <p className="text-xs text-gray-500">
                      {property.interlockWorks ? `Status: ${property.interlockStatus}` : 'Not installed'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Occupancy breakdown */}
          <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
            <h3 className="font-semibold text-gray-900 mb-4">Occupancy Overview</h3>
            <div className="mb-3">
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-500">Overall Occupancy</span>
                <span className="font-semibold">{occupied}/{property.totalUnits} units ({occupancyRate}%)</span>
              </div>
              <ProgressBar value={occupancyRate} />
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
              {[
                { label: 'Occupied', count: occupied, color: 'text-green-700', bg: 'bg-green-50' },
                { label: 'Vacant', count: vacant, color: 'text-gray-700', bg: 'bg-gray-50' },
                { label: 'Renovating', count: renovating, color: 'text-amber-700', bg: 'bg-amber-50' },
                { label: 'Reserved', count: reserved, color: 'text-blue-700', bg: 'bg-blue-50' },
              ].map(item => (
                <div key={item.label} className={`${item.bg} rounded-xl p-3 text-center`}>
                  <p className={`text-2xl font-bold ${item.color}`}>{item.count}</p>
                  <p className="text-xs text-gray-500">{item.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* UNITS TAB */}
      {activeTab === 'units' && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {property.units.map(unit => (
            <div
              key={unit.id}
              onClick={() => setSelectedUnit(unit)}
              className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md hover:border-blue-200 transition-all cursor-pointer p-5 group"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="font-bold text-gray-900 text-lg">Unit {unit.unitNumber}</p>
                  <p className="text-sm text-gray-500">{unit.type} · Floor {unit.floor === 0 ? 'G' : unit.floor}</p>
                </div>
                <StatusBadge status={unit.status} />
              </div>

              <div className="grid grid-cols-2 gap-2 mb-3 text-sm">
                <div className="bg-gray-50 rounded-lg p-2">
                  <p className="text-xs text-gray-400">Internal</p>
                  <p className="font-semibold text-gray-800">{unit.internalArea} m²</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-2">
                  <p className="text-xs text-gray-400">External</p>
                  <p className="font-semibold text-gray-800">{unit.externalArea} m²</p>
                </div>
              </div>

              <div className="flex gap-3 text-xs text-gray-500 mb-3">
                <span className="flex items-center gap-1"><Home className="w-3.5 h-3.5" />{unit.rooms.length} rooms</span>
                <span className="flex items-center gap-1"><Wind className="w-3.5 h-3.5 text-cyan-500" />{unit.acUnits} AC</span>
                {unit.backGarden && <span className="flex items-center gap-1"><TreePine className="w-3.5 h-3.5 text-green-500" />{unit.backGardenArea}m²</span>}
                {unit.interlockWorks && <span className="flex items-center gap-1"><Layers className="w-3.5 h-3.5 text-amber-500" />ILW</span>}
              </div>

              {unit.tenant && (
                <div className="pt-3 border-t border-gray-100 flex items-center gap-2 text-sm">
                  <User className="w-3.5 h-3.5 text-gray-400" />
                  <span className="text-gray-700 truncate">{unit.tenant.name}</span>
                </div>
              )}
              {unit.lease && (
                <div className="flex items-center gap-2 text-sm mt-1">
                  <DollarSign className="w-3.5 h-3.5 text-green-500" />
                  <span className="text-green-700 font-semibold">AED {unit.monthlyRent.toLocaleString()}/mo</span>
                  <span className="text-gray-400 text-xs ml-auto">Expires {unit.lease.endDate}</span>
                </div>
              )}
              {!unit.tenant && (
                <div className="pt-3 border-t border-gray-100 text-sm text-gray-400 flex items-center gap-2">
                  <Calendar className="w-3.5 h-3.5" />
                  {unit.status === 'Under Renovation' ? 'Under renovation' : 'Available for lease'}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* RENOVATIONS TAB */}
      {activeTab === 'renovations' && (
        <div className="space-y-4">
          {propertyRenovations.length === 0 ? (
            <div className="bg-white rounded-xl p-12 text-center text-gray-400 border border-gray-100 shadow-sm">
              <Wrench className="w-12 h-12 mx-auto mb-2 opacity-30" />
              <p>No renovations for this property</p>
            </div>
          ) : (
            propertyRenovations.map(renovation => (
              <div
                key={renovation.id}
                onClick={() => setSelectedRenovation(renovation)}
                className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md hover:border-blue-200 transition-all cursor-pointer p-5"
              >
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                  <div className="flex items-start gap-4 flex-1">
                    <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Wrench className="w-5 h-5 text-amber-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-semibold text-gray-900">{renovation.type}</p>
                        <StatusBadge status={renovation.status} size="sm" />
                      </div>
                      <p className="text-sm text-gray-500 mt-0.5">Unit {renovation.unitNumber} · {renovation.contractor}</p>
                      <p className="text-sm text-gray-600 mt-1 line-clamp-2">{renovation.scopeOfWork}</p>
                    </div>
                  </div>

                  <div className="sm:text-right flex-shrink-0 space-y-1">
                    <div className="flex items-center gap-2 sm:justify-end text-sm">
                      <Hash className="w-3.5 h-3.5 text-gray-400" />
                      <span className="text-gray-600">{renovation.lpo.lpoNumber}</span>
                    </div>
                    <p className="font-semibold text-gray-900 text-sm">AED {renovation.estimatedCost.toLocaleString()}</p>
                    <p className="text-xs text-gray-500">Due: {renovation.completionDate}</p>
                  </div>
                </div>

                <div className="mt-3 pt-3 border-t border-gray-100">
                  <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
                    <Calendar className="w-3.5 h-3.5" />
                    {renovation.startDate} → {renovation.completionDate}
                  </div>
                  <ProgressBar value={renovation.progress} />
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Modals */}
      {selectedUnit && (
        <UnitDetailModal
          unit={selectedUnit}
          renovations={renovations}
          onClose={() => setSelectedUnit(null)}
        />
      )}
      {selectedRenovation && (
        <RenovationDetailModal
          renovation={selectedRenovation}
          onClose={() => setSelectedRenovation(null)}
        />
      )}
    </div>
  );
}
