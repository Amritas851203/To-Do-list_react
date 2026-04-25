import React, { createContext, useContext, useState } from 'react';
import type { UserProfile } from '../types';

interface AuthContextType {
  user: any | null;
  userProfile: UserProfile | null;
  loading: boolean;
  isFirebaseConfigured: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Hardcode a guest user to bypass the login system
  const [user] = useState<any>({ uid: 'guest-user', email: 'guest@example.com', displayName: 'Guest Student' });
  const [userProfile] = useState<UserProfile>({
    uid: 'guest-user',
    displayName: 'Guest Student',
    email: 'guest@example.com',
    streak: 0,
  });
  const loading = false;

  return (
    <AuthContext.Provider value={{ user, userProfile, loading, isFirebaseConfigured: true }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
