import React, { createContext, useState, useContext, useEffect } from 'react';
import type { ReactNode } from 'react';
import { loginUser, verifyUser } from '../api/userApi';
import type { User } from '../interfaces/User';

interface AuthContextType {
  currentUser: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (userId: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuthStatus = async () => {
      const userId = localStorage.getItem('userId');
      const authToken = localStorage.getItem('authToken');

      if (userId && authToken) {
        try {
          setCurrentUser({
            id: userId,
            username: userId,
            email: '', // Si tienes email, guárdalo también
            balance: 0,
            isVerified: true,
            verificationCode: '',
          });
          setIsAuthenticated(true);
        } catch (error) {
          console.error('Auth verification error:', error);
          localStorage.removeItem('authToken');
          localStorage.removeItem('userId');
          setCurrentUser(null);
          setIsAuthenticated(false);
        }
      }
      setIsLoading(false);
    };

    checkAuthStatus();
  }, []);

  const login = async (userId: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await loginUser({ userId, password });
      if (response.data.success) {
        localStorage.setItem('authToken', response.data.token);
        localStorage.setItem('userId', response.data.userId);
        setCurrentUser({
          id: response.data.userId,
          username: response.data.username || response.data.userId,
          email: response.data.email || '',
          balance: response.data.balance || 0,
          isVerified: response.data.isVerified ?? true,
          verificationCode: response.data.verificationCode || '',
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
    localStorage.removeItem('userId');
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
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;