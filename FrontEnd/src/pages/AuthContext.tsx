import React, { createContext, useState, useContext, useEffect } from 'react';
import type { ReactNode } from 'react';
import { loginUser, verifyUser } from '../api/api';

interface User {
  id: string;
  username: string;
  email?: string;
}

interface AuthContextType {
  currentUser: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
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
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Check for stored auth token on mount
  useEffect(() => {
    const checkAuthStatus = async () => {
      const token = localStorage.getItem('authToken');
      
      if (token) {
        try {
          // Verify token with backend
          const response = await verifyUser({ token });
          
          if (response.data.success) {
            setCurrentUser({
              id: response.data.userId,
              username: response.data.username,
              email: response.data.email
            });
            setIsAuthenticated(true);
          } else {
            // Token invalid, clear storage
            localStorage.removeItem('authToken');
          }
        } catch (error) {
          console.error('Auth verification error:', error);
          localStorage.removeItem('authToken');
        }
      }
      
      setIsLoading(false);
    };

    checkAuthStatus();
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    
    try {
      const response = await loginUser({ email, password });
      
      if (response.data.success) {
        // Save auth token
        localStorage.setItem('authToken', response.data.token);
        
        // Set user data
        setCurrentUser({
          id: response.data.userId,
          username: response.data.username,
          email: response.data.email
        });
        
        setIsAuthenticated(true);
      } else {
        throw new Error(response.data.message || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    setCurrentUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isAuthenticated,
        isLoading,
        login,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;