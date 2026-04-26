import React, { createContext, useContext, useEffect, useState } from 'react';
import type { UserProfile } from '../types';

interface AuthContextType {
  user: any | null;
  userProfile: UserProfile | null;
  loading: boolean;
  login: (email: string, pass: string) => Promise<void>;
  signup: (name: string, email: string, pass: string) => Promise<void>;
  logout: () => void;
  updateUserStreak: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check session
    const activeUserId = localStorage.getItem('activeUserId');
    if (activeUserId) {
      const usersStr = localStorage.getItem('mock_users');
      if (usersStr) {
        const users = JSON.parse(usersStr);
        const activeUser = users.find((u: any) => u.uid === activeUserId);
        if (activeUser) {
          setUser({ uid: activeUser.uid, email: activeUser.email });
          setUserProfile({
            uid: activeUser.uid,
            displayName: activeUser.name,
            email: activeUser.email,
            streak: activeUser.streak || 0,
            lastCompletedDate: activeUser.lastCompletedDate,
          });
        }
      }
    }
    setLoading(false);
  }, []);

  const login = async (email: string, pass: string) => {
    return new Promise<void>((resolve, reject) => {
      setTimeout(() => {
        const usersStr = localStorage.getItem('mock_users');
        const users = usersStr ? JSON.parse(usersStr) : [];
        const found = users.find((u: any) => u.email === email && u.password === pass);
        
        if (found) {
          localStorage.setItem('activeUserId', found.uid);
          setUser({ uid: found.uid, email: found.email });
          setUserProfile({
            uid: found.uid,
            displayName: found.name,
            email: found.email,
            streak: found.streak || 0,
            lastCompletedDate: found.lastCompletedDate,
          });
          resolve();
        } else {
          reject(new Error("Invalid email or password"));
        }
      }, 500);
    });
  };

  const signup = async (name: string, email: string, pass: string) => {
    return new Promise<void>((resolve, reject) => {
      setTimeout(() => {
        const usersStr = localStorage.getItem('mock_users');
        const users = usersStr ? JSON.parse(usersStr) : [];
        
        if (users.find((u: any) => u.email === email)) {
          reject(new Error("Email already in use"));
          return;
        }

        const newUser = {
          uid: Math.random().toString(36).substr(2, 9),
          name,
          email,
          password: pass,
          streak: 0
        };

        users.push(newUser);
        localStorage.setItem('mock_users', JSON.stringify(users));
        localStorage.setItem('activeUserId', newUser.uid);

        setUser({ uid: newUser.uid, email: newUser.email });
        setUserProfile({
          uid: newUser.uid,
          displayName: newUser.name,
          email: newUser.email,
          streak: 0,
        });
        resolve();
      }, 500);
    });
  };

  const logout = () => {
    localStorage.removeItem('activeUserId');
    setUser(null);
    setUserProfile(null);
  };

  const updateUserStreak = () => {
    if (!userProfile) return;
    const today = new Date().toISOString().split('T')[0];
    let newStreak = userProfile.streak || 0;
    
    if (userProfile.lastCompletedDate === today) return; // Already completed today

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];

    if (userProfile.lastCompletedDate === yesterdayStr) {
      newStreak += 1;
    } else {
      newStreak = 1;
    }

    const updatedProfile = { ...userProfile, streak: newStreak, lastCompletedDate: today };
    setUserProfile(updatedProfile);

    // Update localStorage
    const usersStr = localStorage.getItem('mock_users');
    if (usersStr) {
      const users = JSON.parse(usersStr);
      const idx = users.findIndex((u: any) => u.uid === userProfile.uid);
      if (idx !== -1) {
        users[idx] = { ...users[idx], streak: newStreak, lastCompletedDate: today };
        localStorage.setItem('mock_users', JSON.stringify(users));
      }
    }
  };

  return (
    <AuthContext.Provider value={{ user, userProfile, loading, login, signup, logout, updateUserStreak }}>
      {!loading && children}
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
