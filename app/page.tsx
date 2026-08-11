"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FaUser, FaLock } from 'react-icons/fa';
import apiFetch from '../lib/apiClient';
import { useUser, createUserSession } from './context/UserContext';

export default function LoginPage() {
  const [form, setForm] = useState({ name: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { user, initialized, setUser } = useUser();

 /* useEffect(() => {
    if (!initialized) return;
    if (user?.role === 'doctor') {
      router.push('/doctorProfile');
    } else if (user?.role === 'patient') {
      router.push('/home');
    }
  }, [initialized, user, router]);*/

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await apiFetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      let data: any = {};
      try {
        data = await res.json();
      } catch (jsonErr) {
        console.warn('[LoginPage] Unable to parse response body as JSON', jsonErr);
      }

      console.log('[LoginPage] api/login response status:', res.status);

      if (!res.ok) {
        setError(data.error || 'Login failed. Please check your credentials.');
        setLoading(false);
        return;
      }

      const session = createUserSession({ name: data.name, role: data.role });
      setUser(session);

      // Set client session cookie safely
      document.cookie = `user=${encodeURIComponent(
        JSON.stringify(session)
      )}; path=/; max-age=${60 * 60 * 24 * 7}`;

      const destination = data.role === 'doctor' ? '/doctorProfile' : '/home';
      router.push(destination);
    } catch (err) {
      console.error('[LoginPage] Login network exception:', err);
      setError('Unable to reach backend server. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  const createGuestAccount = async () => {
    setError('');
    setLoading(true);

    const guestName = `Guest-${Date.now()}`;
    const guestPassword = Math.random().toString(36).slice(2, 10);

    try {
      const registerRes = await apiFetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: guestName, password: guestPassword }),
      });

      if (!registerRes.ok) {
        let regData: any = {};
        try { regData = await registerRes.json(); } catch (_) {}
        setError(regData.error || 'Guest account creation failed');
        return;
      }

      const loginRes = await apiFetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: guestName, password: guestPassword }),
      });

      if (!loginRes.ok) {
        let loginData: any = {};
        try { loginData = await loginRes.json(); } catch (_) {}
        setError(loginData.error || 'Guest login failed');
        return;
      }

      const data = await loginRes.json();
      const session = createUserSession({ name: data.name, role: data.role });
      setUser(session);

      document.cookie = `user=${encodeURIComponent(
        JSON.stringify(session)
      )}; path=/; max-age=${60 * 60 * 24 * 7}`;

      router.push('/home');
    } catch (err) {
      console.error('[LoginPage] Guest creation failed:', err);
      setError('Failed to connect to backend for guest setup.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 to-blue-200">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="relative bg-white p-10 rounded-3xl shadow-2xl w-full max-w-lg"
      >
        <motion.h1
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.4 }}
          className="text-4xl font-extrabold text-center text-gradient bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-blue-600 mb-8"
        >
          Welcome Back
        </motion.h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <FaUser className="absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              name="name"
              placeholder="Username"
              value={form.name}
              onChange={handleChange}
              className="w-full text-black pl-10 pr-4 py-3 border-2 border-gray-200 rounded-full focus:outline-none focus:border-indigo-400 transition"
              required
            />
          </div>

          <div className="relative">
            <FaLock className="absolute left-3 top-3 text-gray-400" />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              className="w-full text-black pl-10 pr-4 py-3 border-2 border-gray-200 rounded-full focus:outline-none focus:border-indigo-400 transition"
              required
            />
          </div>

          {error && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center text-red-500 text-sm font-medium"
            >
              {error}
            </motion.p>
          )}

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-indigo-600 to-blue-500 text-white font-bold rounded-full shadow-lg hover:shadow-xl transition disabled:opacity-50"
          >
            {loading ? 'Logging in...' : 'Login'}
          </motion.button>

          <div className="grid gap-3 sm:grid-cols-2">
            <button
              type="button"
              onClick={createGuestAccount}
              disabled={loading}
              className="w-full rounded-full border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-900 shadow-sm transition hover:bg-slate-100 disabled:opacity-50"
            >
              Continue as Guest
            </button>
            <button
              type="button"
              onClick={() => router.push('/doctor-login')}
              className="w-full rounded-full bg-emerald-500 px-5 py-3 text-sm font-semibold text-slate-950 shadow-lg transition hover:bg-emerald-400"
            >
              Login as Doctor
            </button>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-center mt-4"
          >
            <p className="text-gray-600">
              Need a patient account?{' '}
              <Link href="/register">
                <span className="text-indigo-600 font-semibold hover:underline cursor-pointer">
                  Create one here
                </span>
              </Link>
            </p>
          </motion.div>
        </form>
      </motion.div>
    </div>
  );
}