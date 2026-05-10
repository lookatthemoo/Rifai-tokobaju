import { createContext, useContext, useState, useCallback } from 'react';
import { Auth } from '../js/auth.js';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [loggedIn, setLoggedIn] = useState(Auth.isLoggedIn());

  const login = useCallback(async (password) => {
    const ok = await Auth.login(password);
    if (ok) setLoggedIn(true);
    return ok;
  }, []);

  const logout = useCallback(() => {
    Auth.logout();
    setLoggedIn(false);
  }, []);

  return (
    <AuthContext.Provider value={{ loggedIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be inside AuthProvider');
  return ctx;
}
