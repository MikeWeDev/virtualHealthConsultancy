"use client";
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import apiFetch from '../../lib/apiClient';

type User = { name: string; role: string } | null;

const UserContext = createContext<{
  user: User;
  setUser: (u: User) => void;
  logout: () => Promise<void>;
}>({ user: null, setUser: () => {}, logout: async () => {} });

export function useUser() {
  return useContext(UserContext);
}

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User>(null);
  const router = useRouter();

  useEffect(() => {
    async function initializeUser() {
      console.log('[UserContext] initializeUser started');
      if (typeof document !== 'undefined') {
        const cookiePair = document.cookie
          .split('; ')
          .find((cookie) => cookie.startsWith('user='));

        console.log('[UserContext] cookiePair:', cookiePair);

        if (cookiePair) {
          try {
            let cookieValue = cookiePair.split('=')[1];
            try {
              cookieValue = decodeURIComponent(cookieValue);
            } catch (decodeErr) {
              console.warn('[UserContext] first decode failed', decodeErr);
            }

            let parsedUser = JSON.parse(cookieValue);
            console.log('[UserContext] parsed user cookie:', parsedUser);
            if (!parsedUser?.name || !parsedUser?.role) {
              cookieValue = decodeURIComponent(cookieValue);
              parsedUser = JSON.parse(cookieValue);
              console.log('[UserContext] parsed user cookie after second decode:', parsedUser);
            }
            if (parsedUser?.name && parsedUser?.role) {
              setUser({ name: parsedUser.name, role: parsedUser.role });
              return;
            }
          } catch (err) {
            console.error('[UserContext] failed parsing user cookie', err);
            // ignore and fall back to API fetch
          }
        }
      }

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
    <UserContext.Provider value={{ user, setUser, logout }}>{children}</UserContext.Provider>
  );
}
