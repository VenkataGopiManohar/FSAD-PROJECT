import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('edulib_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const login = (email, password, role) => {
    // In a real app, we'd verify credentials
    const newUser = { email, role, id: Math.random().toString(36).substr(2, 9) };
    setUser(newUser);
    localStorage.setItem('edulib_user', JSON.stringify(newUser));
    
    // Also save to users list if not exists
    const users = JSON.parse(localStorage.getItem('edulib_all_users') || '[]');
    if (!users.find(u => u.email === email)) {
      users.push({ ...newUser, joinedAt: new Date().toISOString(), status: 'active' });
      localStorage.setItem('edulib_all_users', JSON.stringify(users));
    }
    return true;
  };

  const register = (userData) => {
    const users = JSON.parse(localStorage.getItem('edulib_all_users') || '[]');
    if (users.find(u => u.email === userData.email)) {
      throw new Error('Email already registered');
    }
    const newUser = { 
      ...userData, 
      id: Math.random().toString(36).substr(2, 9),
      joinedAt: new Date().toISOString(),
      status: 'active'
    };
    users.push(newUser);
    localStorage.setItem('edulib_all_users', JSON.stringify(users));
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('edulib_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
