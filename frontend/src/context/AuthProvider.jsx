import { useEffect, useState } from 'react';
import { AuthContext } from './AuthContext';


const DEMO_USER = { id: 'demo', name: 'Demo User', email: 'demo@omind.ai' };

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem('omind_user');
    if (stored) setUser(JSON.parse(stored));
  }, []);

  const login = (email, password) => {
    if (email === 'demo@omind.ai' && password === 'password') {
      setUser(DEMO_USER);
      localStorage.setItem('omind_user', JSON.stringify(DEMO_USER));
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('omind_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
