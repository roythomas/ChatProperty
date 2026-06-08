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
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.address.toLowerCase().includes(search.toLowerCase());
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

  return (
    <div className="p-6 space-y-5 max-w-[1400px]">
      {/* Header */}
      <div>
        <h1 className="text-xl font-semibold text-gray-900">Properties</h1>
        <p className="text-sm text-gray-400 mt-0.5">{properties.length} properties · {properties.reduce((s, p) => s + p.totalUnits, 0)} total units</p>
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search properties…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all placeholder:text-gray-400"
          />
        </div>
        <div className="flex gap-1.5 flex-wrap">
          {(['All', 'Occupied', 'Vacant', 'Under Renovation'] as FilterStatus[]).map(f => (
            <button key={f} onClick={() => setFilterStatus(f)}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                filterStatus === f ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}>{f}</button>
          ))}
        </div>
        <div className="flex gap-1 bg-gray-100 rounded-lg p-0.5">
          <button onClick={() => setViewMode('grid')}
            className={`p-2 rounded-md transition-all ${viewMode === 'grid' ? 'bg-white shadow-sm text-gray-700' : 'text-gray-400 hover:text-gray-600'}`}>
            <Grid className="w-4 h-4" />
          </button>
          <button onClick={() => setViewMode('list')}
            className={`p-2 rounded-md transition-all ${viewMode === 'list' ? 'bg-white shadow-sm text-gray-700' : 'text-gray-400 hover:text-gray-600'}`}>
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Grid */}
      {viewMode === 'grid' && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredProperties.map(property => {
            const stats = getPropertyStats(property);
            return (
              <div key={property.id} onClick={() => navigate(`/properties/${property.id}`)}
                className="bg-white rounded-xl border border-gray-200 hover:border-indigo-300 hover:shadow-sm transition-all cursor-pointer">
                {/* Header */}
                <div className="h-36 bg-gray-900 rounded-t-xl relative overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Building2 className="w-20 h-20 text-white opacity-10" />
                  </div>
                  <div className="absolute top-3 right-3">
                    <StatusBadge status={property.type} />
                  </div>
                  <div className="absolute bottom-3 left-4">
                    <p className="text-white font-semibold">{property.name}</p>
                  </div>
                </div>

                <div className="p-4">
                  <div className="flex items-center gap-1.5 text-gray-400 text-xs mb-3">
                    <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                    <span className="truncate">{property.address}</span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 mb-3">
                    {[
                      { val: stats.occupied, label: 'Occupied', cls: 'text-emerald-600' },
                      { val: stats.vacant, label: 'Vacant', cls: 'text-gray-500' },
                      { val: stats.renovating, label: 'Reno', cls: 'text-amber-500' },
                    ].map(s => (
                      <div key={s.label} className="text-center bg-gray-50 rounded-lg py-2 border border-gray-100">
                        <p className={`text-base font-semibold tabular-nums ${s.cls}`}>{s.val}</p>
                        <p className="text-xs text-gray-400">{s.label}</p>
                      </div>
                    ))}
                  </div>

                  <div className="mb-3">
                    <div className="flex justify-between text-xs text-gray-400 mb-1">
                      <span>Occupancy</span>
                      <span className="font-medium text-gray-600 tabular-nums">{stats.occupancyRate}%</span>
                    </div>
                    <ProgressBar value={stats.occupancyRate} showLabel={false} />
                  </div>

                  <div className="flex items-center gap-3 text-xs text-gray-400">
                    {property.totalACUnits > 0 && (
                      <span className="flex items-center gap-1"><Wind className="w-3 h-3" />{property.totalACUnits} AC</span>
                    )}
                    {property.backGarden && (
                      <span className="flex items-center gap-1"><TreePine className="w-3 h-3" />{property.backGardenArea}m²</span>
                    )}
                    {property.interlockWorks && (
                      <span className="flex items-center gap-1"><Layers className="w-3 h-3" />Interlock</span>
                    )}
                  </div>

                  <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-xs text-gray-400">
                      <Home className="w-3.5 h-3.5" />
                      <span>{property.totalUnits} units</span>
                    </div>
                    <span className="text-sm font-semibold text-emerald-700 tabular-nums">AED {stats.revenue.toLocaleString()}/mo</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* List */}
      {viewMode === 'list' && (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                {['Property', 'Type', 'Units', 'Occupied', 'Reno', 'Revenue', 'Features'].map(h => (
                  <th key={h} className={`px-5 py-3 font-medium text-gray-400 text-xs ${h === 'Property' ? 'text-left' : 'text-center'}`}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredProperties.map(property => {
                const stats = getPropertyStats(property);
                return (
                  <tr key={property.id} onClick={() => navigate(`/properties/${property.id}`)}
                    className="hover:bg-gray-50 cursor-pointer transition-colors">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gray-900 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Building2 className="w-4 h-4 text-white" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{property.name}</p>
                          <p className="text-gray-400 text-xs flex items-center gap-1"><MapPin className="w-2.5 h-2.5" />{property.address}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center"><StatusBadge status={property.type} /></td>
                    <td className="px-4 py-3 text-center font-medium text-gray-900 tabular-nums">{property.totalUnits}</td>
                    <td className="px-4 py-3">
                      <div className="flex flex-col items-center gap-1">
                        <span className="text-emerald-600 font-medium tabular-nums">{stats.occupied}/{property.totalUnits}</span>
                        <ProgressBar value={stats.occupancyRate} showLabel={false} height="thin" />
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center">
                      {stats.renovating > 0 ? (
                        <span className="flex items-center justify-center gap-1 text-amber-500 tabular-nums">
                          <Wrench className="w-3 h-3" />{stats.renovating}
                        </span>
                      ) : <span className="text-gray-300">—</span>}
                    </td>
                    <td className="px-4 py-3 text-center font-semibold text-emerald-700 tabular-nums">AED {stats.revenue.toLocaleString()}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-2 text-gray-400">
                        {property.totalACUnits > 0 && <Wind className="w-3.5 h-3.5" />}
                        {property.backGarden && <TreePine className="w-3.5 h-3.5" />}
                        {property.interlockWorks && <Layers className="w-3.5 h-3.5" />}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {filteredProperties.length === 0 && (
            <div className="py-12 text-center text-gray-400">
              <Building2 className="w-10 h-10 mx-auto mb-2 opacity-20" />
              <p className="text-sm">No properties found</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
