import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, MapPin, Home, Wrench, Search, Grid, List, Wind, TreePine, Layers } from 'lucide-react';
import { properties } from '../data/mockData';
import { StatusBadge } from '../components/StatusBadge';
import { ProgressBar } from '../components/ProgressBar';

type FilterStatus = 'All' | 'Occupied' | 'Vacant' | 'Under Renovation';
type ViewMode = 'grid' | 'list';

export function Properties() {
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('All');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const navigate = useNavigate();

  const filteredProperties = properties.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.address.toLowerCase().includes(search.toLowerCase());
    if (!matchesSearch) return false;
    if (filterStatus === 'All') return true;
    return p.units.some(u => u.status === filterStatus);
  });

  const getPropertyStats = (p: typeof properties[0]) => {
    const occupied = p.units.filter(u => u.status === 'Occupied').length;
    const vacant = p.units.filter(u => u.status === 'Vacant').length;
    const renovating = p.units.filter(u => u.status === 'Under Renovation').length;
    const revenue = p.units.filter(u => u.status === 'Occupied').reduce((s, u) => s + u.monthlyRent, 0);
    const occupancyRate = Math.round((occupied / p.totalUnits) * 100);
    return { occupied, vacant, renovating, revenue, occupancyRate };
  };

  const filterButtons: FilterStatus[] = ['All', 'Occupied', 'Vacant', 'Under Renovation'];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Properties</h1>
          <p className="text-gray-500 text-sm mt-1">{properties.length} properties · {properties.reduce((s, p) => s + p.totalUnits, 0)} total units</p>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search properties..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {filterButtons.map(f => (
            <button
              key={f}
              onClick={() => setFilterStatus(f)}
              className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                filterStatus === f
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-white text-gray-600 border border-gray-200 hover:border-blue-300'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
        <div className="flex gap-1 bg-white border border-gray-200 rounded-xl p-1">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-gray-600'}`}
          >
            <Grid className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-gray-600'}`}
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Grid View */}
      {viewMode === 'grid' && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {filteredProperties.map(property => {
            const stats = getPropertyStats(property);
            return (
              <div
                key={property.id}
                onClick={() => navigate(`/properties/${property.id}`)}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-blue-200 transition-all cursor-pointer group"
              >
                {/* Property image placeholder */}
                <div className="h-40 bg-gradient-to-br from-slate-700 to-slate-800 rounded-t-2xl relative overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center opacity-20">
                    <Building2 className="w-24 h-24 text-white" />
                  </div>
                  <div className="absolute top-3 right-3">
                    <StatusBadge status={property.type} />
                  </div>
                  <div className="absolute bottom-3 left-3">
                    <p className="text-white font-bold text-lg">{property.name}</p>
                  </div>
                </div>

                <div className="p-5">
                  {/* Address */}
                  <div className="flex items-center gap-1.5 text-gray-500 text-sm mb-4">
                    <MapPin className="w-4 h-4 flex-shrink-0" />
                    <span className="truncate">{property.address}</span>
                  </div>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-3 gap-2 mb-4">
                    <div className="text-center bg-green-50 rounded-xl py-2">
                      <p className="text-lg font-bold text-green-700">{stats.occupied}</p>
                      <p className="text-xs text-gray-500">Occupied</p>
                    </div>
                    <div className="text-center bg-gray-50 rounded-xl py-2">
                      <p className="text-lg font-bold text-gray-700">{stats.vacant}</p>
                      <p className="text-xs text-gray-500">Vacant</p>
                    </div>
                    <div className="text-center bg-amber-50 rounded-xl py-2">
                      <p className="text-lg font-bold text-amber-700">{stats.renovating}</p>
                      <p className="text-xs text-gray-500">Renovation</p>
                    </div>
                  </div>

                  {/* Occupancy */}
                  <div className="mb-3">
                    <div className="flex justify-between text-xs text-gray-500 mb-1">
                      <span>Occupancy Rate</span>
                      <span className="font-medium text-gray-900">{stats.occupancyRate}%</span>
                    </div>
                    <ProgressBar value={stats.occupancyRate} showLabel={false} />
                  </div>

                  {/* Features */}
                  <div className="flex gap-3 text-xs text-gray-500">
                    {property.totalACUnits > 0 && (
                      <span className="flex items-center gap-1"><Wind className="w-3.5 h-3.5 text-cyan-500" />{property.totalACUnits} AC</span>
                    )}
                    {property.backGarden && (
                      <span className="flex items-center gap-1"><TreePine className="w-3.5 h-3.5 text-green-500" />{property.backGardenArea}m² garden</span>
                    )}
                    {property.interlockWorks && (
                      <span className="flex items-center gap-1"><Layers className="w-3.5 h-3.5 text-amber-500" />Interlock</span>
                    )}
                  </div>

                  {/* Revenue & Units */}
                  <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-sm">
                      <Home className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-600">{property.totalUnits} units</span>
                    </div>
                    <span className="text-sm font-semibold text-green-700">AED {stats.revenue.toLocaleString()}/mo</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* List View */}
      {viewMode === 'list' && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-left px-6 py-4 font-semibold text-gray-700">Property</th>
                <th className="text-left px-4 py-4 font-semibold text-gray-700">Type</th>
                <th className="text-center px-4 py-4 font-semibold text-gray-700">Units</th>
                <th className="text-center px-4 py-4 font-semibold text-gray-700">Occupied</th>
                <th className="text-center px-4 py-4 font-semibold text-gray-700">Renovating</th>
                <th className="text-right px-4 py-4 font-semibold text-gray-700">Monthly Revenue</th>
                <th className="text-center px-6 py-4 font-semibold text-gray-700">Features</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredProperties.map(property => {
                const stats = getPropertyStats(property);
                return (
                  <tr
                    key={property.id}
                    onClick={() => navigate(`/properties/${property.id}`)}
                    className="hover:bg-blue-50 cursor-pointer transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-slate-800 rounded-xl flex items-center justify-center flex-shrink-0">
                          <Building2 className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{property.name}</p>
                          <p className="text-gray-500 text-xs flex items-center gap-1">
                            <MapPin className="w-3 h-3" />{property.address}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4"><StatusBadge status={property.type} /></td>
                    <td className="px-4 py-4 text-center font-medium text-gray-900">{property.totalUnits}</td>
                    <td className="px-4 py-4">
                      <div className="flex flex-col items-center gap-1">
                        <span className="font-medium text-green-700">{stats.occupied}/{property.totalUnits}</span>
                        <ProgressBar value={stats.occupancyRate} showLabel={false} height="thin" />
                      </div>
                    </td>
                    <td className="px-4 py-4 text-center">
                      {stats.renovating > 0 ? (
                        <span className="flex items-center justify-center gap-1 text-amber-700 font-medium">
                          <Wrench className="w-3.5 h-3.5" />{stats.renovating}
                        </span>
                      ) : <span className="text-gray-400">—</span>}
                    </td>
                    <td className="px-4 py-4 text-right font-semibold text-green-700">AED {stats.revenue.toLocaleString()}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        {property.totalACUnits > 0 && <Wind className="w-4 h-4 text-cyan-500" />}
                        {property.backGarden && <TreePine className="w-4 h-4 text-green-500" />}
                        {property.interlockWorks && <Layers className="w-4 h-4 text-amber-500" />}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {filteredProperties.length === 0 && (
            <div className="py-12 text-center text-gray-400">
              <Building2 className="w-12 h-12 mx-auto mb-2 opacity-30" />
              <p>No properties found</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
