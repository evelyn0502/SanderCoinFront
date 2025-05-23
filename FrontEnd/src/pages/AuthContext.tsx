import React, { createContext, useState, useContext, useEffect } from 'react';
import type { ReactNode } from 'react';
import { loginUser, verifyUser } from '../api/userApi';
import type { User } from '../interfaces/User';

interface AuthContextType {
  currentUser: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
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
      const code = localStorage.getItem('code'); // o como guardes el código

      if (userId && code) {
      try {
      const response = await verifyUser({ userId, code });
          if (response.data.success) {
            setCurrentUser({
              id: response.data.userId,
              username: response.data.username,
              email: response.data.email,
              balance: response.data.balance,
              isVerified: response.data.isVerified,
              verificationCode: response.data.verificationCode,
            });
            setIsAuthenticated(true);
          } else {
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
        localStorage.setItem('authToken', response.data.token);
        setCurrentUser({
          id: response.data.userId,
          username: response.data.username,
          email: response.data.email,
          balance: response.data.balance,
          isVerified: response.data.isVerified,
          verificationCode: response.data.verificationCode,
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
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;