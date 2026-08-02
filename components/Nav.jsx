'use client';
import { useState } from 'react';
import Link from 'next/link';

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur-xl shadow-sm shadow-slate-200">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-4">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-3xl bg-gradient-to-r from-emerald-600 to-cyan-500 text-lg font-black text-white shadow-lg">
            E
          </div>
          <div>
            <p className="text-lg font-semibold text-slate-900">EThealth</p>
            <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Care Anywhere</p>
          </div>
        </Link>

        <nav className="hidden flex-1 md:block">
          <ul className="flex items-center justify-center gap-8 text-sm font-medium text-slate-700">
            <li>
              <a href="#services" className="transition hover:text-emerald-600">Services</a>
            </li>
            <li>
              <a href="#doctors" className="transition hover:text-emerald-600">Doctors</a>
            </li>
            <li>
              <a href="#reviews" className="transition hover:text-emerald-600">Reviews</a>
            </li>
            <li>
              <a href="#contact" className="transition hover:text-emerald-600">Contact</a>
            </li>
          </ul>
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <Link href="/patient" className="rounded-full bg-slate-900 px-5 py-2 text-sm font-semibold text-white shadow-sm shadow-slate-400 transition hover:bg-slate-800">
            Patient Login
          </Link>
        </div>

        <button
          className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:bg-slate-100 md:hidden"
          onClick={() => setMenuOpen((prev) => !prev)}
          aria-label="Toggle navigation menu"
        >
          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {menuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {menuOpen && (
        <nav className="border-t border-slate-200 bg-white/95 px-6 py-5 md:hidden">
          <ul className="flex flex-col gap-4 text-sm font-medium text-slate-700">
            <li>
              <a href="#services" className="block rounded-3xl px-4 py-3 transition hover:bg-slate-100">Services</a>
            </li>
            <li>
              <a href="#doctors" className="block rounded-3xl px-4 py-3 transition hover:bg-slate-100">Doctors</a>
            </li>
            <li>
              <a href="#reviews" className="block rounded-3xl px-4 py-3 transition hover:bg-slate-100">Reviews</a>
            </li>
            <li>
              <a href="#contact" className="block rounded-3xl px-4 py-3 transition hover:bg-slate-100">Contact</a>
            </li>
            <li>
              <Link href="/patient" className="block rounded-3xl bg-slate-900 px-4 py-3 text-center text-sm font-semibold text-white transition hover:bg-slate-800">
                Patient Login
              </Link>
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
}
