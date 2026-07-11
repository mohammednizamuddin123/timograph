import React, { createContext, useState } from 'react';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [theme, setTheme] = useState('light');
  const [role, setRole] = useState(localStorage.getItem('userRole') || null);
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    message: '',
    onConfirm: null,
  });

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const showConfirm = (message, onConfirm) => {
    setConfirmDialog({
      isOpen: true,
      message,
      onConfirm,
    });
  };

  const closeConfirm = () => {
    setConfirmDialog({
      isOpen: false,
      message: '',
      onConfirm: null,
    });
  };

  const logout = () => {
    localStorage.removeItem('userRole');
    setRole(null);
    // You could also call an API to clear the http-only cookie if you have a logout route
  };

  return (
    <AppContext.Provider value={{ theme, toggleTheme, confirmDialog, showConfirm, closeConfirm, role, setRole, logout }}>
      {children}
    </AppContext.Provider>
  );
};
