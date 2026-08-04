"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useUser } from '../app/context/UserContext';

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, logout, setUser } = useUser();
  const dashboardHref = user?.role === 'doctor' ? '/doctorProfile' : '/patient';
  const firstName = user?.name?.split(' ')[0] || 'User';
  const userInitial = firstName.charAt(0).toUpperCase();

  useEffect(() => {
    console.log('[Nav] useEffect user:', user);
    if (!user && typeof document !== 'undefined') {
      const cookiePair = document.cookie
        .split('; ')
        .find((cookie) => cookie.startsWith('user='));

      console.log('[Nav] user cookiePair:', cookiePair);

      if (cookiePair) {
        try {
          let cookieValue = cookiePair.split('=')[1];
          try {
            cookieValue = decodeURIComponent(cookieValue);
          } catch (decodeErr) {
            console.warn('[Nav] first decode failed', decodeErr);
          }

          let parsedUser = JSON.parse(cookieValue);
          console.log('[Nav] parsed user cookie:', parsedUser);
          if (!parsedUser?.name || !parsedUser?.role) {
            cookieValue = decodeURIComponent(cookieValue);
            parsedUser = JSON.parse(cookieValue);
            console.log('[Nav] parsed user cookie after second decode:', parsedUser);
          }
          if (parsedUser?.name && parsedUser?.role) {
            setUser({ name: parsedUser.name, role: parsedUser.role });
            return;
          }
        } catch (err) {
          console.error('[Nav] failed parsing user cookie', err);
          // fallback to API fetch if cookie parsing fails
        }
      }

      fetch('/api/me', { credentials: 'include' })
        .then((res) => {
          console.log('[Nav] /api/me response status:', res.status);
          if (!res.ok) throw new Error('Not authenticated');
          return res.json();
        })
        .then((data) => {
          console.log('[Nav] /api/me data:', data);
          setUser({ name: data.name, role: data.role });
        })
        .catch((err) => {
          console.error('[Nav] /api/me fetch failed', err);
        });
    }
  }, [user, setUser]);

  return (
    <header className="sticky top-0 z-50 border-b border-slate-800 bg-slate-950/80 backdrop-blur-xl transition-all">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8 py-4">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-lg font-black text-slate-950 shadow-lg shadow-emerald-500/20 transition-transform group-hover:scale-105">
            E
          </div>
          <div>
            <p className="text-lg font-extrabold text-white tracking-tight">EThealth</p>
            <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-emerald-400">Care Anywhere</p>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden flex-1 md:block">
          <ul className="flex items-center justify-center gap-8 text-sm font-medium text-slate-300">
            <li>
              <a href="#services" className="transition-colors hover:text-emerald-400">Services</a>
            </li>
            <li>
              <a href="#doctors" className="transition-colors hover:text-emerald-400">Doctors</a>
            </li>
            <li>
              <a href="#reviews" className="transition-colors hover:text-emerald-400">Reviews</a>
            </li>
            <li>
              <a href="#contact" className="transition-colors hover:text-emerald-400">Contact</a>
            </li>
          </ul>
        </nav>

        {/* Desktop Call to Action */}
        <div className="hidden items-center gap-3 md:flex">
          {user ? (
            <>
              <Link
                href={dashboardHref}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500 text-sm font-semibold text-slate-950 shadow-md shadow-emerald-500/20 transition-all hover:bg-emerald-400"
                aria-label={`Go to ${user.role === 'doctor' ? 'doctor' : 'patient'} dashboard`}
              >
                {firstName.charAt(0).toUpperCase()}
              </Link>
              <button
                onClick={() => logout()}
                className="rounded-full bg-red-500 px-4 py-2 text-sm font-semibold text-white hover:bg-red-400"
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              href="/"
              className="rounded-full bg-emerald-500 px-6 py-2.5 text-sm font-semibold text-slate-950 shadow-md shadow-emerald-500/20 transition-all hover:bg-emerald-400 hover:scale-105 active:scale-95"
            >
              Login
            </Link>
          )}
        </div>

        {/* Mobile Menu Toggle Button */}
        <button
          className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-800 bg-slate-900 text-slate-300 shadow-sm transition-colors hover:border-slate-700 hover:bg-slate-800 hover:text-white md:hidden"
          onClick={() => setMenuOpen((prev) => !prev)}
          aria-label="Toggle navigation menu"
        >
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {menuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Menu Drawer */}
      {menuOpen && (
        <nav className="border-t border-slate-800 bg-slate-950/95 px-6 py-5 backdrop-blur-xl md:hidden">
          <ul className="flex flex-col gap-3 text-sm font-medium text-slate-300">
            <li>
              <a 
                href="#services" 
                onClick={() => setMenuOpen(false)}
                className="block rounded-xl px-4 py-3 transition-colors hover:bg-slate-900 hover:text-emerald-400"
              >
                Services
              </a>
            </li>
            <li>
              <a 
                href="#doctors" 
                onClick={() => setMenuOpen(false)}
                className="block rounded-xl px-4 py-3 transition-colors hover:bg-slate-900 hover:text-emerald-400"
              >
                Doctors
              </a>
            </li>
            <li>
              <a 
                href="#reviews" 
                onClick={() => setMenuOpen(false)}
                className="block rounded-xl px-4 py-3 transition-colors hover:bg-slate-900 hover:text-emerald-400"
              >
                Reviews
              </a>
            </li>
            <li>
              <a 
                href="#contact" 
                onClick={() => setMenuOpen(false)}
                className="block rounded-xl px-4 py-3 transition-colors hover:bg-slate-900 hover:text-emerald-400"
              >
                Contact
              </a>
            </li>
            <li className="pt-2">
              {user ? (
                <Link
                  href={dashboardHref}
                  onClick={() => setMenuOpen(false)}
                  className="block rounded-full bg-emerald-500 px-4 py-3 text-center text-sm font-semibold text-slate-950 transition hover:bg-emerald-400"
                  aria-label={`Go to ${user.role === 'doctor' ? 'doctor' : 'patient'} dashboard`}
                >
                  {userInitial}
                </Link>
              ) : (
                <Link 
                  href="/" 
                  onClick={() => setMenuOpen(false)}
                  className="block rounded-full bg-emerald-500 px-4 py-3 text-center text-sm font-semibold text-slate-950 transition hover:bg-emerald-400"
                >
                  Login
                </Link>
              )}
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
}