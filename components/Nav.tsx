"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { useUser } from "../app/context/UserContext";
import { 
  Stethoscope, 
  LogOut, 
  User, 
  ChevronDown, 
  Menu, 
  X, 
  Sparkles,
  ShieldCheck,
  LayoutDashboard
} from "lucide-react";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  const { user, logout, setUser } = useUser();

  const dashboardHref = user
    ? user.role === "doctor"
      ? "/doctorProfile"
      : "/patient"
    : "/";

  const firstName = user?.name?.split(" ")[0] || "User";
  const userInitial = firstName.charAt(0).toUpperCase();
  const rootPath = "/home";

  // Handle scroll detection for subtle navbar background shift
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close user dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setUserDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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
    setUserDropdownOpen(false);
  };

  const handleLogout = () => {
    logout();
    closeMenu();
  };

  return (
    <header 
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        scrolled 
          ? "border-b border-slate-800/80 bg-slate-950/85 backdrop-blur-xl shadow-2xl shadow-black/40" 
          : "border-b border-slate-800/40 bg-slate-950/70 backdrop-blur-lg"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3.5 sm:px-6 lg:px-8">
        
        {/* BRAND LOGO */}
        <Link
          href="/"
          onClick={closeMenu}
          className="group flex items-center gap-3.5 outline-none"
        >
          <div className="relative flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-tr from-emerald-500 via-teal-400 to-cyan-500 text-slate-950 font-black shadow-lg shadow-emerald-500/20 transition-all duration-300 group-hover:scale-105 group-hover:shadow-emerald-500/30">
            <Stethoscope className="h-6 w-6 stroke-[2.5]" />
            <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-emerald-400 animate-ping" />
            <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-emerald-400" />
          </div>

          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="text-xl font-black tracking-tight text-white group-hover:text-emerald-400 transition-colors">
                EThealth
              </span>
              <span className="rounded-md bg-emerald-500/10 border border-emerald-500/20 px-1.5 py-0.5 text-[9px] font-bold text-emerald-400 uppercase tracking-widest">
                PRO
              </span>
            </div>
            <span className="text-[10px] font-semibold tracking-[0.2em] uppercase text-slate-400 group-hover:text-slate-300 transition-colors">
              Care Anywhere
            </span>
          </div>
        </Link>

        {/* DESKTOP NAVIGATION LINKS */}
        <nav className="hidden md:flex items-center justify-center rounded-full border border-slate-800/80 bg-slate-900/60 px-6 py-2 shadow-inner backdrop-blur-md">
          <ul className="flex items-center gap-8 text-sm font-semibold text-slate-300">
            <li>
              <Link
                href={`${rootPath}#services`}
                className="relative py-1 transition-colors hover:text-emerald-400 group flex items-center gap-1"
              >
                <span>Services</span>
                <span className="absolute bottom-0 left-0 h-0.5 w-0 bg-emerald-400 transition-all duration-300 group-hover:w-full rounded-full" />
              </Link>
            </li>

            <li>
              <Link
                href={`${rootPath}#doctors`}
                className="relative py-1 transition-colors hover:text-emerald-400 group flex items-center gap-1"
              >
                <span>Doctors</span>
                <span className="absolute bottom-0 left-0 h-0.5 w-0 bg-emerald-400 transition-all duration-300 group-hover:w-full rounded-full" />
              </Link>
            </li>

            <li>
              <Link
                href={`${rootPath}#reviews`}
                className="relative py-1 transition-colors hover:text-emerald-400 group flex items-center gap-1"
              >
                <span>Reviews</span>
                <span className="absolute bottom-0 left-0 h-0.5 w-0 bg-emerald-400 transition-all duration-300 group-hover:w-full rounded-full" />
              </Link>
            </li>

            <li>
              <Link
                href={`${rootPath}#contact`}
                className="relative py-1 transition-colors hover:text-emerald-400 group flex items-center gap-1"
              >
                <span>Contact</span>
                <span className="absolute bottom-0 left-0 h-0.5 w-0 bg-emerald-400 transition-all duration-300 group-hover:w-full rounded-full" />
              </Link>
            </li>
          </ul>
        </nav>

        {/* DESKTOP ACTIONS */}
        <div className="hidden items-center gap-3 md:flex">
          {user ? (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setUserDropdownOpen((prev) => !prev)}
                className="flex items-center gap-3 rounded-full border border-slate-800 bg-slate-900/90 p-1.5 pr-4 transition-all hover:border-slate-700 hover:bg-slate-800 shadow-lg"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-r from-emerald-400 to-teal-500 font-bold text-slate-950 text-sm shadow-md shadow-emerald-500/20">
                  {userInitial}
                </div>
                <div className="text-left leading-tight">
                  <p className="text-xs font-bold text-white">{firstName}</p>
                  <p className="text-[10px] capitalize text-emerald-400 font-semibold">{user.role}</p>
                </div>
                <ChevronDown className={`h-4 w-4 text-slate-400 transition-transform duration-200 ${userDropdownOpen ? "rotate-180" : ""}`} />
              </button>

              {/* USER DROPDOWN MENU */}
              {userDropdownOpen && (
                <div className="absolute right-0 mt-3 w-56 rounded-2xl border border-slate-800 bg-slate-900/95 p-2 shadow-2xl backdrop-blur-2xl animate-in fade-in zoom-in-95 duration-150">
                  <div className="px-3 py-2 border-b border-slate-800/80 mb-1">
                    <p className="text-xs font-semibold text-slate-400">Signed in as</p>
                    <p className="text-sm font-bold text-white truncate">{user.name}</p>
                  </div>

                  <Link
                    href={dashboardHref}
                    onClick={closeMenu}
                    className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-xs font-semibold text-slate-200 hover:bg-emerald-500/10 hover:text-emerald-400 transition"
                  >
                    <LayoutDashboard className="h-4 w-4 text-emerald-400" />
                    <span>Dashboard</span>
                  </Link>

                  <button
                    onClick={handleLogout}
                    className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-xs font-semibold text-red-400 hover:bg-red-500/10 transition mt-1"
                  >
                    <LogOut className="h-4 w-4 text-red-400" />
                    <span>Logout</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              href="/"
              className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 p-[1px] font-bold text-xs shadow-lg shadow-emerald-500/20 transition-all hover:scale-105 active:scale-95"
            >
              <span className="flex items-center gap-2 rounded-full bg-slate-950 px-6 py-2.5 text-white transition-all duration-300 group-hover:bg-transparent group-hover:text-slate-950">
                <User className="h-4 w-4" />
                <span>Login / Register</span>
              </span>
            </Link>
          )}
        </div>

        {/* MOBILE MENU TOGGLE BUTTON */}
        <button
          type="button"
          className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-800 bg-slate-900/80 text-slate-300 shadow-md transition-all hover:border-slate-700 hover:bg-slate-800 hover:text-white md:hidden"
          onClick={() => setMenuOpen((prev) => !prev)}
          aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={menuOpen}
        >
          {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* MOBILE DRAWER MENU */}
      {menuOpen && (
        <nav className="border-t border-slate-800/80 bg-slate-950/95 px-6 py-6 backdrop-blur-2xl md:hidden space-y-4 shadow-2xl animate-in slide-in-from-top-4 duration-200">
          <ul className="flex flex-col gap-2 text-sm font-semibold text-slate-300">
            <li>
              <Link
                href={`${rootPath}#services`}
                onClick={closeMenu}
                className="flex items-center justify-between rounded-2xl px-4 py-3.5 transition-colors hover:bg-slate-900 hover:text-emerald-400"
              >
                <span>Services</span>
                <Sparkles className="h-4 w-4 text-emerald-400/50" />
              </Link>
            </li>

            <li>
              <Link
                href={`${rootPath}#doctors`}
                onClick={closeMenu}
                className="flex items-center justify-between rounded-2xl px-4 py-3.5 transition-colors hover:bg-slate-900 hover:text-emerald-400"
              >
                <span>Doctors</span>
                <ShieldCheck className="h-4 w-4 text-emerald-400/50" />
              </Link>
            </li>

            <li>
              <Link
                href={`${rootPath}#reviews`}
                onClick={closeMenu}
                className="flex items-center justify-between rounded-2xl px-4 py-3.5 transition-colors hover:bg-slate-900 hover:text-emerald-400"
              >
                <span>Reviews</span>
              </Link>
            </li>

            <li>
              <Link
                href={`${rootPath}#contact`}
                onClick={closeMenu}
                className="flex items-center justify-between rounded-2xl px-4 py-3.5 transition-colors hover:bg-slate-900 hover:text-emerald-400"
              >
                <span>Contact</span>
              </Link>
            </li>
          </ul>

          <div className="pt-4 border-t border-slate-800/80">
            {user ? (
              <div className="space-y-3">
                <div className="flex items-center gap-3 rounded-2xl bg-slate-900 p-3 border border-slate-800">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-400 font-bold text-slate-950 text-sm">
                    {userInitial}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white">{user.name}</p>
                    <p className="text-xs text-emerald-400 font-medium capitalize">{user.role}</p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Link
                    href={dashboardHref}
                    onClick={closeMenu}
                    className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-emerald-500 py-3 text-center text-xs font-bold text-slate-950 transition hover:bg-emerald-400"
                  >
                    <LayoutDashboard className="h-4 w-4" />
                    <span>Dashboard</span>
                  </Link>

                  <button
                    onClick={handleLogout}
                    className="flex items-center justify-center rounded-xl bg-red-500/20 border border-red-500/30 px-4 py-3 text-xs font-bold text-red-400 transition hover:bg-red-500/30"
                  >
                    <LogOut className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ) : (
              <Link
                href="/"
                onClick={closeMenu}
                className="flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-400 to-teal-500 py-3.5 text-center text-sm font-bold text-slate-950 shadow-lg shadow-emerald-500/20"
              >
                <User className="h-4 w-4" />
                <span>Login / Register</span>
              </Link>
            )}
          </div>
        </nav>
      )}
    </header>
  );
}