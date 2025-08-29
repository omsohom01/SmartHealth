'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
  role?: 'doctor' | 'patient';
  location?: string;
  specialization?: string;
  experience?: number;
  achievements?: string[];
  profilePicture?: string; // base64 data URL or remote URL
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; message: string }>;
  register: (userData: {
    name: string;
    email: string;
    password: string;
    role: 'doctor' | 'patient';
    location: string;
    specialization?: string;
    experience?: number;
    achievements?: string[];
    profilePicture?: string; // base64 data URL
  }) => Promise<{ success: boolean; message: string }>;
  logout: () => Promise<{ success: boolean; message: string }>;
  checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Check authentication on app load
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/auth/verify', {
        method: 'GET',
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.data?.user) {
          setUser(data.data.user);
          setIsAuthenticated(true);
        } else {
          setUser(null);
          setIsAuthenticated(false);
        }
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error('Auth check error:', error);
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      if (!email || !password) {
        return { success: false, message: 'Email and password are required' };
      }

      const response = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setUser(data.data.user);
        setIsAuthenticated(true);
        
        // Store credentials for auto re-signin feature
        localStorage.setItem('userCredentials', JSON.stringify({ email, password }));
        
        return { success: true, message: data.message };
      } else {
        return { success: false, message: data.message || 'Login failed' };
      }
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, message: 'Login failed. Please try again.' };
    }
  };

  const register = async (userData: {
    name: string;
    email: string;
    password: string;
    role: 'doctor' | 'patient';
    location: string;
    specialization?: string;
    experience?: number;
    achievements?: string[];
    profilePicture?: string;
  }) => {
    try {
      if (!userData.name || !userData.email || !userData.password) {
        return { success: false, message: 'Name, email and password are required' };
      }
      if (!userData.role) {
        return { success: false, message: 'Role is required' };
      }
      if (!userData.location) {
        return { success: false, message: 'Location is required' };
      }
      if (userData.role === 'doctor') {
        if (!userData.specialization) {
          return { success: false, message: 'Specialization is required for doctors' };
        }
        const exp = userData.experience ?? 0;
        if (isNaN(exp) || exp < 0) {
          return { success: false, message: 'Experience must be a non-negative number' };
        }
      }

      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setUser(data.data.user);
        setIsAuthenticated(true);
        
        // Store credentials for auto re-signin feature
        localStorage.setItem('userCredentials', JSON.stringify({ 
          email: userData.email, 
          password: userData.password 
        }));
        
        return { success: true, message: data.message };
      } else {
        return { success: false, message: data.message || 'Registration failed' };
      }
    } catch (error) {
      console.error('Registration error:', error);
      return { success: false, message: 'Registration failed. Please try again.' };
    }
  };

  const logout = async () => {
    try {
      // Call logout API
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });

      const data = await response.json();

      // Clear local state
      setUser(null);
      setIsAuthenticated(false);
      // Clear any stored credentials to prevent unintended auto sign-in
      try {
        localStorage.removeItem('userCredentials');
      } catch {}

      if (response.ok && data.success) {
        return { success: true, message: data.message };
      } else {
        return { success: false, message: data.message || 'Logout failed' };
      }
    } catch (error) {
      console.error('Logout error:', error);
      setUser(null);
      setIsAuthenticated(false);
      return { success: false, message: 'Logout failed. Please try again.' };
    }
  };

  const value: AuthContextType = {
    user,
    isAuthenticated,
    isLoading,
    login,
    register,
    logout,
    checkAuth,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
