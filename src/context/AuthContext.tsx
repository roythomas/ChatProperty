import { createContext, useContext, useState, ReactNode } from 'react';

interface User {
  name: string;
  email: string;
  role: string;
  initials: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

const VALID_USERS: Record<string, { password: string; user: User }> = {
  'admin@propmanager.ae': {
    password: 'admin123',
    user: { name: 'Property Admin', email: 'admin@propmanager.ae', role: 'Administrator', initials: 'PA' },
  },
  'manager@propmanager.ae': {
    password: 'manager123',
    user: { name: 'Sara Al Nasser', email: 'manager@propmanager.ae', role: 'Property Manager', initials: 'SN' },
  },
  'viewer@propmanager.ae': {
    password: 'viewer123',
    user: { name: 'Ahmed Khalid', email: 'viewer@propmanager.ae', role: 'Viewer', initials: 'AK' },
  },
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const stored = sessionStorage.getItem('pm_user');
    return stored ? JSON.parse(stored) : null;
  });

  const login = (email: string, password: string): boolean => {
    const entry = VALID_USERS[email.toLowerCase()];
    if (entry && entry.password === password) {
      setUser(entry.user);
      sessionStorage.setItem('pm_user', JSON.stringify(entry.user));
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    sessionStorage.removeItem('pm_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
