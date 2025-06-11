'use client';

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useRef,
  ReactNode,
} from 'react';

const LOCAL_KEY = 'bookingCountdownTarget';

type CountdownContextType = {
  countdown: number | null;
  setCountdownTarget: (target: Date) => void;
  clearCountdown: () => void;
};

const CountdownContext = createContext<CountdownContextType | undefined>(undefined);

export const CountdownProvider = ({ children }: { children: ReactNode }) => {
  const [countdown, setCountdown] = useState<number | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const updateCountdown = (target: Date) => {
    const now = new Date();
    const diff = Math.floor((target.getTime() - now.getTime()) / 1000);
    if (diff <= 0) {
      setCountdown(0);
      localStorage.removeItem(LOCAL_KEY);
      if (intervalRef.current) clearInterval(intervalRef.current);
    } else {
      setCountdown(diff);
    }
  };

  const setCountdownTarget = (target: Date) => {
    localStorage.setItem(LOCAL_KEY, target.toISOString());
    updateCountdown(target);

    // Clear existing interval if any
    if (intervalRef.current) clearInterval(intervalRef.current);

    // Start a new interval
    intervalRef.current = setInterval(() => updateCountdown(target), 1000);
  };

  const clearCountdown = () => {
    setCountdown(null);
    localStorage.removeItem(LOCAL_KEY);
    if (intervalRef.current) clearInterval(intervalRef.current);
  };

  useEffect(() => {
    const storedTarget = localStorage.getItem(LOCAL_KEY);
    if (storedTarget) {
      const target = new Date(storedTarget);
      updateCountdown(target);

      intervalRef.current = setInterval(() => updateCountdown(target), 1000);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  return (
    <CountdownContext.Provider value={{ countdown, setCountdownTarget, clearCountdown }}>
      {children}
    </CountdownContext.Provider>
  );
};

export const useCountdown = () => {
  const context = useContext(CountdownContext);
  if (!context) throw new Error('useCountdown must be used within CountdownProvider');
  return context;
};
