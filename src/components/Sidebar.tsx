import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Building2, Wrench, BarChart3, ShoppingCart, Home, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const navItems = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/hub', icon: Home, label: 'Properties Hub' },
  { to: '/properties', icon: Building2, label: 'Properties' },
  { to: '/renovations', icon: Wrench, label: 'Renovations' },
  { to: '/procurement', icon: ShoppingCart, label: 'Procurement' },
  { to: '/analytics', icon: BarChart3, label: 'Analytics' },
];

export function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate('/login', { replace: true }); };

  return (
    <aside className="w-60 min-h-screen flex flex-col flex-shrink-0 border-r border-gray-800"
      style={{ background: '#111827' }}>
      {/* Logo */}
      <div className="px-4 py-5 border-b border-gray-800">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center flex-shrink-0">
            <Building2 className="w-4 h-4 text-white" />
          </div>
          <div>
            <p className="text-white font-semibold text-sm font-display" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>PropManager</p>
            <p className="text-gray-500 text-xs">Renovation Hub</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-2 py-4 space-y-0.5">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink key={to} to={to} end={to === '/'}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all ${
                isActive
                  ? 'bg-indigo-600 text-white'
                  : 'text-gray-400 hover:bg-gray-800 hover:text-gray-200'
              }`
            }
          >
            <Icon className="w-4 h-4 flex-shrink-0" />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="px-2 py-3 border-t border-gray-800">
        <button onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2 w-full rounded-lg text-sm text-gray-400 hover:bg-gray-800 hover:text-red-400 transition-all">
          <LogOut className="w-4 h-4" /> Sign out
        </button>

        {user && (
          <div className="mt-2 px-3 pt-3 border-t border-gray-800">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-full bg-indigo-600 flex items-center justify-center text-white text-xs font-semibold flex-shrink-0">
                {user.initials}
              </div>
              <div className="min-w-0">
                <p className="text-gray-200 text-xs font-medium truncate">{user.name}</p>
                <p className="text-gray-500 text-xs truncate">{user.role}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
