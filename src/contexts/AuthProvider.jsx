import React, { createContext, useContext, useState, useEffect } from 'react';
import { generateKeyPair, generateUserId } from '@/lib/encryption';
import { toast } from '@/components/ui/use-toast';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const savedUser = localStorage.getItem('securechat-user');
      if (savedUser) {
        const userData = JSON.parse(savedUser);
        setUser(userData);
      }
    } catch (error) {
      console.error('Error checking auth status:', error);
    } finally {
      setLoading(false);
    }
  };

  const login = async (username, avatar) => {
    try {
      setLoading(true);
      
      // Generate encryption keys for the user
      const keyPair = await generateKeyPair();
      const userId = generateUserId();
      
      const userData = {
        id: userId,
        username,
        avatar,
        publicKey: keyPair.publicKey,
        privateKey: keyPair.privateKey,
        createdAt: new Date().toISOString(),
        status: 'online'
      };

      // Save user data to localStorage
      localStorage.setItem('securechat-user', JSON.stringify(userData));
      setUser(userData);
      
      return userData;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('securechat-user');
    localStorage.removeItem('securechat-chats');
    localStorage.removeItem('securechat-contacts');
    setUser(null);
    
    toast({
      title: "Signed Out",
      description: "You have been securely signed out"
    });
  };

  const updateUser = (updates) => {
    if (!user) return;
    
    const updatedUser = { ...user, ...updates };
    localStorage.setItem('securechat-user', JSON.stringify(updatedUser));
    setUser(updatedUser);
  };

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      login,
      logout,
      updateUser
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};