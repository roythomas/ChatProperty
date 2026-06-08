import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Building2, Wrench, BarChart3, ShoppingCart, Home, LogOut, Settings } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const navItems = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/hub', icon: Home, label: 'Properties Hub' },
  { to: '/properties', icon: Building2, label: 'Properties' },
  { to: '/renovations', icon: Wrench, label: 'Renovation Tracker' },
  { to: '/procurement', icon: ShoppingCart, label: 'Procurement' },
  { to: '/analytics', icon: BarChart3, label: 'Analytics' },
];

export function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate('/login', { replace: true }); };

  return (
    <aside className="w-64 min-h-screen flex flex-col shadow-xl flex-shrink-0"
      style={{ background: '#0F172A' }}>
      {/* Logo */}
      <div className="px-5 py-5 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
            <Building2 className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="text-white font-bold text-base leading-tight" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>PropManager</p>
            <p className="text-slate-500 text-xs">Renovation Hub</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink key={to} to={to} end={to === '/'}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20'
                  : 'text-slate-400 hover:bg-white/8 hover:text-white'
              }`
            }
          >
            <Icon className="w-4.5 h-4.5 flex-shrink-0 w-4 h-4" />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* User & actions */}
      <div className="px-3 py-4 border-t border-white/10 space-y-0.5">
        <button className="flex items-center gap-3 px-3.5 py-2.5 w-full rounded-xl text-sm font-medium text-slate-400 hover:bg-white/8 hover:text-white transition-all">
          <Settings className="w-4 h-4" /> Settings
        </button>
        <button onClick={handleLogout}
          className="flex items-center gap-3 px-3.5 py-2.5 w-full rounded-xl text-sm font-medium text-slate-400 hover:bg-red-500/15 hover:text-red-400 transition-all">
          <LogOut className="w-4 h-4" /> Sign out
        </button>

        {user && (
          <div className="mt-3 px-3.5 pt-3 border-t border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-400 to-indigo-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                {user.initials}
              </div>
              <div className="min-w-0">
                <p className="text-white text-xs font-semibold truncate">{user.name}</p>
                <p className="text-slate-500 text-xs truncate">{user.role}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
