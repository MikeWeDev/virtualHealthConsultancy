"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useUser } from "../app/context/UserContext";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, logout, setUser } = useUser();

  const dashboardHref = user
    ? user.role === "doctor"
      ? "/doctorProfile"
      : "/patient"
    : "/";

  const firstName = user?.name?.split(" ")[0] || "User";
  const userInitial = firstName.charAt(0).toUpperCase();

  const rootPath = "/home";

  useEffect(() => {
    if (!user && typeof window !== "undefined") {
      const cookiePair = document.cookie
        .split("; ")
        .find((cookie) => cookie.startsWith("user="));

      if (cookiePair) {
        try {
          const cookieValue = cookiePair.split("=")[1];
          const parsedUser = JSON.parse(decodeURIComponent(cookieValue));

          if (parsedUser?.name && parsedUser?.role) {
            setUser({
              name: parsedUser.name,
              role: parsedUser.role,
            });

            return;
          }
        } catch (err) {
          console.warn(
            "[Nav] failed parsing user cookie, falling back to API",
            err
          );
        }
      }

      async function fetchUser() {
        try {
          const res = await fetch("/api/me", {
            credentials: "include",
          });

          if (!res.ok) {
            setUser(null);
            return;
          }

          const data = await res.json();

          if (data?.name && data?.role) {
            setUser({
              name: data.name,
              role: data.role,
            });
          } else {
            setUser(null);
          }
        } catch (err) {
          console.warn("[Nav] /api/me fetch failed", err);
          setUser(null);
        }
      }

      fetchUser();
    }
  }, [user, setUser]);

  const closeMenu = () => {
    setMenuOpen(false);
  };

  const handleLogout = () => {
    logout();
    closeMenu();
  };

  return (
    <header className="sticky top-0 z-50 border-b border-slate-800 bg-black transition-all">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <Link
          href="/"
          onClick={closeMenu}
          className="group flex items-center gap-3"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-lg font-black text-slate-950 shadow-lg shadow-emerald-500/20 transition-transform group-hover:scale-105">
            E
          </div>

          <div>
            <p className="text-lg font-extrabold tracking-tight text-white">
              EThealth
            </p>
            <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-emerald-400">
              Care Anywhere
            </p>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden flex-1 md:block">
          <ul className="flex items-center justify-center gap-8 text-sm font-medium text-slate-300">
            <li>
              <Link
                href={`${rootPath}#services`}
                className="transition-colors hover:text-emerald-400"
              >
                Services
              </Link>
            </li>

            <li>
              <Link
                href={`${rootPath}#doctors`}
                className="transition-colors hover:text-emerald-400"
              >
                Doctors
              </Link>
            </li>

            <li>
              <Link
                href={`${rootPath}#reviews`}
                className="transition-colors hover:text-emerald-400"
              >
                Reviews
              </Link>
            </li>

            <li>
              <Link
                href={`${rootPath}#contact`}
                className="transition-colors hover:text-emerald-400"
              >
                Contact
              </Link>
            </li>
          </ul>
        </nav>

        {/* Desktop Actions */}
        <div className="hidden items-center gap-3 md:flex">
          {user ? (
            <div className="flex items-center gap-3">
              <Link
                href={dashboardHref}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500 text-sm font-semibold text-slate-950 shadow-md shadow-emerald-500/20 transition-all hover:bg-emerald-400"
                aria-label={`Go to ${
                  user.role === "doctor" ? "doctor" : "patient"
                } dashboard`}
              >
                {userInitial}
              </Link>

              <button
                onClick={handleLogout}
                className="rounded-full bg-red-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-400"
              >
                Logout
              </button>
            </div>
          ) : (
            <Link
              href="/"
              className="rounded-full bg-emerald-500 px-6 py-2.5 text-sm font-semibold text-slate-950 shadow-md shadow-emerald-500/20 transition-all hover:scale-105 hover:bg-emerald-400 active:scale-95"
            >
              Login
            </Link>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button
          type="button"
          className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-800 bg-slate-900 text-slate-300 shadow-sm transition-colors hover:border-slate-700 hover:bg-slate-800 hover:text-white md:hidden"
          onClick={() => setMenuOpen((prev) => !prev)}
          aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={menuOpen}
        >
          <svg
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            {menuOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <nav className="border-t border-slate-800 bg-slate-950/95 px-6 py-5 backdrop-blur-xl md:hidden">
          <ul className="flex flex-col gap-3 text-sm font-medium text-slate-300">
            <li>
              <Link
                href={`${rootPath}#services`}
                onClick={closeMenu}
                className="block rounded-xl px-4 py-3 transition-colors hover:bg-slate-900 hover:text-emerald-400"
              >
                Services
              </Link>
            </li>

            <li>
              <Link
                href={`${rootPath}#doctors`}
                onClick={closeMenu}
                className="block rounded-xl px-4 py-3 transition-colors hover:bg-slate-900 hover:text-emerald-400"
              >
                Doctors
              </Link>
            </li>

            <li>
              <Link
                href={`${rootPath}#reviews`}
                onClick={closeMenu}
                className="block rounded-xl px-4 py-3 transition-colors hover:bg-slate-900 hover:text-emerald-400"
              >
                Reviews
              </Link>
            </li>

            <li>
              <Link
                href={`${rootPath}#contact`}
                onClick={closeMenu}
                className="block rounded-xl px-4 py-3 transition-colors hover:bg-slate-900 hover:text-emerald-400"
              >
                Contact
              </Link>
            </li>

            <li className="pt-2">
              {user ? (
                <div className="flex gap-3">
                  <Link
                    href={dashboardHref}
                    onClick={closeMenu}
                    className="flex-1 rounded-full bg-emerald-500 px-4 py-3 text-center text-sm font-semibold text-slate-950 transition hover:bg-emerald-400"
                    aria-label={`Go to ${
                      user.role === "doctor" ? "doctor" : "patient"
                    } dashboard`}
                  >
                    {userInitial}
                  </Link>

                  <button
                    onClick={handleLogout}
                    className="flex-1 rounded-full bg-red-500 px-4 py-3 text-center text-sm font-semibold text-white transition hover:bg-red-400"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <Link
                  href="/"
                  onClick={closeMenu}
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