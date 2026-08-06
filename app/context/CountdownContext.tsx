'use client';

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useRef,
  ReactNode,
} from 'react';

const LOCAL_KEY = 'bookingCountdown';

type CountdownContextType = {
  countdown: number | null;
  storedBookingId: string | null;
  setCountdownTarget: (target: Date, bookingId?: string | null) => void;
  clearCountdown: () => void;
};

const CountdownContext = createContext<CountdownContextType | undefined>(undefined);

export const CountdownProvider = ({ children }: { children: ReactNode }) => {
  const [countdown, setCountdown] = useState<number | null>(null);
  const [storedBookingId, setStoredBookingId] = useState<string | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const updateCountdown = (target: Date) => {
    const now = new Date();
    const diff = Math.floor((target.getTime() - now.getTime()) / 1000);
    if (diff <= 0) {
      setCountdown(0);
      localStorage.removeItem(LOCAL_KEY);
      setStoredBookingId(null);
      if (intervalRef.current) clearInterval(intervalRef.current);
    } else {
      setCountdown(diff);
    }
  };

  const setCountdownTarget = (target: Date, bookingId?: string | null) => {
    const payload = { bookingId: bookingId ?? null, appointmentTime: target.toISOString() };
    localStorage.setItem(LOCAL_KEY, JSON.stringify(payload));
    setStoredBookingId(payload.bookingId);
    updateCountdown(target);

    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => updateCountdown(target), 1000);
  };

  const clearCountdown = () => {
    setCountdown(null);
    setStoredBookingId(null);
    localStorage.removeItem(LOCAL_KEY);
    if (intervalRef.current) clearInterval(intervalRef.current);
  };

  useEffect(() => {
    const stored = localStorage.getItem(LOCAL_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (parsed?.appointmentTime) {
          const target = new Date(parsed.appointmentTime);
          setStoredBookingId(parsed.bookingId ?? null);
          updateCountdown(target);
          intervalRef.current = setInterval(() => updateCountdown(target), 1000);
        }
      } catch (err) {
        localStorage.removeItem(LOCAL_KEY);
      }
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  return (
    <CountdownContext.Provider value={{ countdown, storedBookingId, setCountdownTarget, clearCountdown }}>
      {children}
    </CountdownContext.Provider>
  );
};

export const useCountdown = () => {
  const context = useContext(CountdownContext);
  if (!context) throw new Error('useCountdown must be used within CountdownProvider');
  return context;
};
