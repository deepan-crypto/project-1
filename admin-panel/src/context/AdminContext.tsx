import { createContext, useContext, ReactNode, useState, useEffect } from 'react';

interface AdminContextType {
  admin: { email: string } | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  loading: boolean;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

// Hardcoded admin credentials
const ADMIN_EMAIL = 'thoughtsadmin@mail.com';
const ADMIN_PASSWORD = 'admin@123';
const ADMIN_TOKEN_KEY = 'admin_token';

export function AdminProvider({ children }: { children: ReactNode }) {
  const [admin, setAdmin] = useState<{ email: string } | null>(null);
  const [loading, setLoading] = useState(true);

  // Check if already logged in on mount
  useEffect(() => {
    const token = localStorage.getItem(ADMIN_TOKEN_KEY);
    if (token === 'authenticated') {
      setAdmin({ email: ADMIN_EMAIL });
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Validate credentials
    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      localStorage.setItem(ADMIN_TOKEN_KEY, 'authenticated');
      setAdmin({ email: ADMIN_EMAIL });
      return true;
    }
    return false;
  };

  const logout = () => {
    localStorage.removeItem(ADMIN_TOKEN_KEY);
    setAdmin(null);
    window.location.reload();
  };

  return (
    <AdminContext.Provider value={{ admin, login, logout, loading }}>
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
}
