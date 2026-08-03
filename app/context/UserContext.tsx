"use client";
import React, { createContext, useContext, useEffect, useState } from 'react';
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

  useEffect(() => {
    async function fetchMe() {
      try {
        const res = await apiFetch('/api/me');
        if (!res.ok) return setUser(null);
        const data = await res.json();
        setUser({ name: data.name, role: data.role });
      } catch (err) {
        setUser(null);
      }
    }

    fetchMe();
  }, []);

  async function logout() {
    try {
      await apiFetch('/api/logout', { method: 'POST' });
    } catch (err) {
      // ignore
    }
    setUser(null);
    // optional: redirect handled by caller
  }

  return (
    <UserContext.Provider value={{ user, setUser, logout }}>{children}</UserContext.Provider>
  );
}
