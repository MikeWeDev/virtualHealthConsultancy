"use client";
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import apiFetch from '../../lib/apiClient';
import newDatas from '../doctor/ProductPage';

type User = { name: string; role: string; doctorId?: number } | null;

const UserContext = createContext<{
  user: User;
  setUser: (u: User) => void;
  initialized: boolean;
  logout: () => Promise<void>;
}>({ user: null, setUser: () => {}, initialized: false, logout: async () => {} });

function normalizeName(value = '') {
  return value
    .toString()
    .trim()
    .replace(/^dr\.??\s*/i, '')
    .replace(/\s+/g, ' ')
    .toLowerCase();
}

export function getDoctorIdForName(name: string) {
  const normalized = normalizeName(name);
  const doctor = newDatas.find((item) => normalizeName(item.Name) === normalized);
  return doctor?.id;
}

export function createUserSession(data: { name: string; role: string; doctorId?: number }) {
  return {
    name: data.name,
    role: data.role,
    doctorId:
      data.role === 'doctor'
        ? data.doctorId ?? getDoctorIdForName(data.name)
        : undefined,
  };
}

export function useUser() {
  return useContext(UserContext);
}

function parseUserCookie() {
  if (typeof window === 'undefined') return null;
  const cookiePair = document.cookie.split('; ').find((cookie) => cookie.startsWith('user='));
  if (!cookiePair) return null;

  try {
    const cookieValue = decodeURIComponent(cookiePair.split('=')[1]);
    return JSON.parse(cookieValue);
  } catch (err) {
    console.warn('[UserContext] failed to parse user cookie', err);
    return null;
  }
}

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User>(null);
  const [initialized, setInitialized] = useState(false);
  const router = useRouter();

  useEffect(() => {
    async function initializeUser() {
      const fallbackUser = parseUserCookie();
      console.log('[UserContext] initializeUser started');
      try {
        const res = await apiFetch('/api/me');
        console.log('[UserContext] /api/me response status:', res.status);
        if (!res.ok) {
          if (fallbackUser?.name && fallbackUser?.role) {
            setUser(createUserSession({ name: fallbackUser.name, role: fallbackUser.role }));
          } else {
            setUser(null);
          }
          return;
        }
        const data = await res.json();
        console.log('[UserContext] /api/me data:', data);
        setUser(createUserSession({ name: data.name, role: data.role }));
      } catch (err) {
        console.error('[UserContext] /api/me fetch failed', err);
        if (fallbackUser?.name && fallbackUser?.role) {
          setUser(createUserSession({ name: fallbackUser.name, role: fallbackUser.role }));
        } else {
          setUser(null);
        }
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
