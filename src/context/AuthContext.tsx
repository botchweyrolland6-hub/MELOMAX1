import React, { createContext, useContext, useState, useEffect } from 'react';
import type { User } from '../types';
import { storageEngine } from '../services/storage';

interface AuthContextType {
  currentUser: User | null;
  isAdmin: boolean;
  login: (email: string, password_hash: string) => Promise<{ success: boolean; message: string }>;
  register: (fullName: string, email: string, phone: string, password_hash: string) => Promise<{ success: boolean; message: string }>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const SESSION_KEY = 'melomax_current_session';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    try {
      const savedSession = localStorage.getItem(SESSION_KEY);
      if (savedSession) {
        const user: User = JSON.parse(savedSession);
        const currentUsers = storageEngine.getUsers();
        const validUser = currentUsers.find(u => u.id === user.id);

        if (validUser && validUser.status === 'active') {
          setCurrentUser(validUser);
        } else {
          localStorage.removeItem(SESSION_KEY);
        }
      }
    } catch (err) {
      console.error('Session restore error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const login = async (email: string, password_hash: string): Promise<{ success: boolean; message: string }> => {
    const cleanEmail = email.trim().toLowerCase();
    const users = storageEngine.getUsers();

    const foundUser = users.find(u => u.email.toLowerCase() === cleanEmail);

    if (!foundUser) {
      return { success: false, message: 'Invalid email or password. Please try again.' };
    }

    if (foundUser.status === 'disabled') {
      return { success: false, message: 'Your account has been disabled. Please contact MeloMax Support.' };
    }

    if (foundUser.role === 'admin' && password_hash !== 'maxwell123') {
      return { success: false, message: 'Incorrect administrator password.' };
    }

    setCurrentUser(foundUser);
    localStorage.setItem(SESSION_KEY, JSON.stringify(foundUser));
    storageEngine.addAuditLog('USER_LOGIN', foundUser.email, `Logged in as ${foundUser.role.toUpperCase()}`);

    return { success: true, message: `Welcome back, ${foundUser.full_name}!` };
  };

  const register = async (
    fullName: string,
    email: string,
    phone: string,
    password_hash: string
  ): Promise<{ success: boolean; message: string }> => {
    const cleanEmail = email.trim().toLowerCase();
    const users = storageEngine.getUsers();

    if (users.some(u => u.email.toLowerCase() === cleanEmail)) {
      return { success: false, message: 'An account with this email address already exists.' };
    }

    const newUser: User = {
      id: `usr-${Date.now()}`,
      full_name: fullName.trim(),
      email: cleanEmail,
      phone: phone.trim(),
      role: 'user',
      status: 'active',
      created_at: new Date().toISOString(),
    };

    users.push(newUser);
    localStorage.setItem('melomax_users_db', JSON.stringify(users));

    setCurrentUser(newUser);
    localStorage.setItem(SESSION_KEY, JSON.stringify(newUser));
    storageEngine.addAuditLog('USER_REGISTERED', newUser.email, `New user registered: ${newUser.full_name}`);

    return { success: true, message: 'Registration successful! Welcome to MeloMax Ventures.' };
  };

  const logout = () => {
    if (currentUser) {
      storageEngine.addAuditLog('USER_LOGOUT', currentUser.email, 'Logged out of session');
    }
    setCurrentUser(null);
    localStorage.removeItem(SESSION_KEY);
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isAdmin: currentUser?.role === 'admin',
        login,
        register,
        logout,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
