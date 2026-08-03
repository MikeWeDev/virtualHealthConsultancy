"use client";
import React, { createContext, useContext, useEffect, useState } from 'react';

type User = { name: string; role: string } | null;

const UserContext = createContext<{ user: User; setUser: (u: User) => void }>({ user: null, setUser: () => {} });

export function useUser() {
  return useContext(UserContext);
}

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User>(null);

  useEffect(() => {
    async function fetchMe() {
      try {
        const res = await fetch('/api/me', { credentials: 'include' });
        if (!res.ok) return setUser(null);
        const data = await res.json();
        setUser({ name: data.name, role: data.role });
      } catch (err) {
        setUser(null);
      }
    }

    fetchMe();
  }, []);

  return <UserContext.Provider value={{ user, setUser }}>{children}</UserContext.Provider>;
}
