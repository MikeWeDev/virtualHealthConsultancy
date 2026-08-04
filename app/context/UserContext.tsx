"use client";
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import apiFetch from '../../lib/apiClient';

type User = { name: string; role: string } | null;

const UserContext = createContext<{
  user: User;
  setUser: (u: User) => void;
  initialized: boolean;
  logout: () => Promise<void>;
}>({ user: null, setUser: () => {}, initialized: false, logout: async () => {} });

export function useUser() {
  return useContext(UserContext);
}

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User>(null);
  const [initialized, setInitialized] = useState(false);
  const router = useRouter();

  useEffect(() => {
    async function initializeUser() {
      console.log('[UserContext] initializeUser started');
      try {
        const res = await apiFetch('/api/me');
        console.log('[UserContext] /api/me response status:', res.status);
        if (!res.ok) {
          setUser(null);
          return;
        }
        const data = await res.json();
        console.log('[UserContext] /api/me data:', data);
        setUser({ name: data.name, role: data.role });
      } catch (err) {
        console.error('[UserContext] /api/me fetch failed', err);
        setUser(null);
      } finally {
        setInitialized(true);
      }
    }

    initializeUser();
  }, []);

  async function logout() {
    try {
      await apiFetch('/api/logout', { method: 'POST' });
    } catch (err) {
      // ignore
    }
    setUser(null);
    // redirect to homepage after logout
    router.push('/');
  }

  return (
    <UserContext.Provider value={{ user, setUser, initialized, logout }}>{children}</UserContext.Provider>
  );
}
