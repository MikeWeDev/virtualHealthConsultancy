'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FaUser, FaLock, FaUserMd } from 'react-icons/fa';

export default function RegisterPage() {
  const [form, setForm] = useState({ name: '', password: '', role: 'patient' });
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState('');
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage('');
    setStatus('loading');

    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        setStatus('error');
        setMessage(data.error || 'Registration failed');
      } else {
        setStatus('success');
        setMessage('Registration successful! Redirecting...');
        setForm({ name: '', password: '', role: 'patient' });
        setTimeout(() => router.push('/'), 2000);
      }
    } catch (err) {
      setStatus('error');
      setMessage('Something went wrong');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-100 to-teal-200">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white p-10 rounded-3xl shadow-2xl w-full max-w-md"
      >
        <motion.h1
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.4 }}
          className="text-4xl font-extrabold text-center text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-teal-500 mb-6"
        >
          Create Account
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
              className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-full focus:outline-none focus:border-green-400 transition"
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
              className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-full focus:outline-none focus:border-green-400 transition"
              required
            />
          </div>

          <div className="relative">
            <FaUserMd className="absolute left-3 top-3 text-gray-400" />
            <select
              name="role"
              value={form.role}
              onChange={handleChange}
              className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-full focus:outline-none focus:border-green-400 transition"
            >
              <option value="patient">Patient</option>
              <option value="doctor">Doctor</option>
            </select>
          </div>

          {message && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className={`text-center text-sm ${
                status === 'success' ? 'text-green-600' : status === 'error' ? 'text-red-600' : 'text-gray-600'
              }`}
            >
              {message}
            </motion.p>
          )}

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            disabled={status === 'loading'}
            className="w-full py-3 bg-gradient-to-r from-green-600 to-teal-500 text-white font-bold rounded-full shadow-lg hover:shadow-xl transition"
          >
            {status === 'loading' ? 'Registering...' : 'Register'}
          </motion.button>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-center mt-4"
          >
            <p className="text-gray-600">
              Already have an account?{' '}
              <Link href="/" className="text-green-600 font-semibold hover:underline">
                Login
              </Link>
            </p>
          </motion.div>
        </form>
      </motion.div>
    </div>
  );
}
