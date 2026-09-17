"use client";
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '../context/UserContext';
import { getBookingsForDoctor, getUpcomingBooking, formatBookingTime } from '../../lib/bookingStorage';
import doctorData from '../doctor/ProductPage';

function parseUserCookie() {
  if (typeof window === 'undefined') return null;
  const cookiePair = document.cookie.split('; ').find((cookie) => cookie.startsWith('user='));
  if (!cookiePair) return null;

  try {
    const cookieValue = decodeURIComponent(cookiePair.split('=')[1]);
    return JSON.parse(cookieValue);
  } catch {
    return null;
  }
}

const DoctorDashboard = () => {
  const router = useRouter();
  const [localCountdown, setLocalCountdown] = useState<number | null>(null);
  const { user, initialized, logout } = useUser();

  const doctor = useMemo(() => {
    if (!user?.doctorId) return null;
    return doctorData.find((item) => item.id === user.doctorId) || null;
  }, [user]);

  const rawName = doctor?.Name || user?.name || 'Doctor';
  const firstName = rawName.replace(/^Dr\.\s*/i, '').split(' ')[0];
  const firstInitial = firstName.charAt(0).toUpperCase();
  const doctorSpecialty = doctor?.type || 'Primary Care Specialist';

  const doctorBookings = useMemo(() => {
    if (!user || user.role !== 'doctor' || user.doctorId == null) return [];
    return getBookingsForDoctor({ 
      doctorId: user.doctorId, 
      doctorName: user.name || doctor?.Name || '' 
    });
  }, [user, doctor]);

  const upcomingBooking = useMemo(() => getUpcomingBooking(doctorBookings), [doctorBookings]);
  const nextAppointment = upcomingBooking ? formatBookingTime(upcomingBooking.appointmentTime) : null;

  useEffect(() => {
    if (!upcomingBooking) {
      setLocalCountdown(null);
      return;
    }

    const update = () => {
      const now = new Date();
      const target = new Date(upcomingBooking.appointmentTime);
      const diff = Math.floor((target.getTime() - now.getTime()) / 1000);
      setLocalCountdown(diff > 0 ? diff : 0);
    };

    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, [upcomingBooking]);

  useEffect(() => {
  if (!initialized) return;

  const cookieUser = parseUserCookie();
  const activeUser = user || cookieUser;

  // 1. Not authenticated -> Redirect to Login/Landing
  if (!activeUser) {
    router.push('/');
    return;
  }

  // 2. Explicitly verify role -> Only redirect if role is definitively 'patient'
  if (activeUser.role === 'patient') {
    router.push('/home');
  }
}, [initialized, user, router]);

  if (!initialized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100">
        <div className="rounded-3xl border border-slate-200 bg-white px-8 py-10 shadow-xl text-slate-800 flex items-center gap-3">
          <div className="w-5 h-5 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin" />
          <span>Loading dashboard...</span>
        </div>
      </div>
    );
  }

  const formatCountdown = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h}h ${m}m ${s}s`;
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {/* Single Consolidated Doctor Welcome Header */}
        <header className="mb-8 rounded-[2rem] bg-white p-6 shadow-xl ring-1 ring-slate-200">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-2xl font-bold text-white shadow-md">
                {firstInitial}
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.25em] text-emerald-600">
                  Doctor Portal • {doctorSpecialty}
                </p>
                <h1 className="mt-1 text-2xl font-extrabold text-slate-950 sm:text-3xl">
                  Welcome back, Dr. {firstName}
                </h1>
                <p className="mt-1 text-sm text-slate-600">
                  Manage patient consultations, review upcoming schedules, and initiate video calls.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => router.push('/doctor-login')}
                className="rounded-full border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
              >
                Go to Home
              </button>
              <button
                type="button"
                onClick={logout}
                className="rounded-full bg-red-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md transition hover:bg-red-700"
              >
                Logout
              </button>
            </div>
          </div>
        </header>

        {/* Dashboard Grid */}
        <section className="grid gap-6 xl:grid-cols-[1.8fr_1fr]">
          <div className="space-y-6">
            {/* Consult Overview */}
            <div className="rounded-[2rem] bg-white p-6 shadow-xl ring-1 ring-slate-200">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.25em] text-emerald-600">Consult Overview</p>
                  <h2 className="mt-1 text-2xl font-bold text-slate-950">Upcoming Appointment</h2>
                </div>
                <div className="rounded-full bg-emerald-100 px-4 py-1.5 text-xs font-semibold text-emerald-700">
                  {upcomingBooking ? 'Next Booking Active' : 'No Active Booking'}
                </div>
              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-3">
                <div className="rounded-3xl bg-slate-50 p-5 border border-slate-200">
                  <p className="text-xs uppercase tracking-wider text-slate-400 font-semibold">Next Patient</p>
                  <p className="mt-2 font-bold text-slate-950 text-base">{upcomingBooking?.patientName || 'No upcoming patient'}</p>
                </div>
                <div className="rounded-3xl bg-slate-50 p-5 border border-slate-200">
                  <p className="text-xs uppercase tracking-wider text-slate-400 font-semibold">Consult Time</p>
                  <p className="mt-2 font-bold text-slate-950 text-base">{nextAppointment || 'Not scheduled'}</p>
                  {upcomingBooking && localCountdown !== null && (
                    <p className="mt-1 text-xs font-mono font-semibold text-emerald-700">{formatCountdown(localCountdown)} remaining</p>
                  )}
                </div>
                <div className="rounded-3xl bg-slate-50 p-5 border border-slate-200">
                  <p className="text-xs uppercase tracking-wider text-slate-400 font-semibold">Session Mode</p>
                  <p className="mt-2 font-bold text-slate-950 text-base">HD Video Consultation</p>
                </div>
              </div>
            </div>

            {/* Client Snapshots & Actions */}
            <div className="grid gap-4 lg:grid-cols-2">
              <div className="rounded-[2rem] bg-white p-6 shadow-xl ring-1 ring-slate-200">
                <h3 className="text-lg font-semibold text-slate-950">Client Snapshots</h3>
                <div className="mt-4 space-y-2.5 text-sm text-slate-600">
                  <div className="rounded-2xl bg-slate-50 p-3.5 border border-slate-100 font-medium">Jane Doe — Active care plan</div>
                  <div className="rounded-2xl bg-slate-50 p-3.5 border border-slate-100 font-medium">Michael Smith — Awaiting lab results</div>
                  <div className="rounded-2xl bg-slate-50 p-3.5 border border-slate-100 font-medium">Sarah Johnson — Telehealth follow-up due</div>
                </div>
              </div>

              <div className="rounded-[2rem] bg-white p-6 shadow-xl ring-1 ring-slate-200">
                <h3 className="text-lg font-semibold text-slate-950">Telehealth Direct Actions</h3>
                <p className="mt-1 text-sm text-slate-500">Open messaging or start a call with the next patient.</p>
                <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                  <Link href="/connect/chat/123" className="rounded-full bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white text-center transition hover:bg-blue-700 flex-1">
                    Message Patient
                  </Link>
                  <Link href="/connect/videocall/123" className="rounded-full border border-blue-600 px-5 py-2.5 text-sm font-semibold text-blue-700 text-center transition hover:bg-blue-50 flex-1">
                    Start Video Call
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar Summary */}
          <aside className="space-y-6">
            <div className="rounded-[2rem] bg-gradient-to-br from-emerald-600 to-cyan-600 p-6 text-white shadow-xl ring-1 ring-emerald-200">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.25em] text-emerald-100 font-semibold">Daily Status</p>
                  <h2 className="mt-2 text-xl font-bold">Ready for Patients</h2>
                </div>
                <div className="rounded-full bg-white/20 px-3 py-1 text-xs font-semibold text-white">Active</div>
              </div>
              <div className="mt-6 space-y-3 text-sm text-emerald-50">
                <div className="rounded-2xl bg-white/10 p-3.5 backdrop-blur-sm">
                  <span className="text-xs font-bold text-white">Today&apos;s Schedule</span>
                  <p className="mt-1 text-sm">5 sessions remaining</p>
                </div>
                <div className="rounded-2xl bg-white/10 p-3.5 backdrop-blur-sm">
                  <span className="text-xs font-bold text-white">Avg Response Time</span>
                  <p className="mt-1 text-sm">Under 15 minutes</p>
                </div>
                <div className="rounded-2xl bg-white/10 p-3.5 backdrop-blur-sm">
                  <span className="text-xs font-bold text-white">Practice Availability</span>
                  <p className="mt-1 text-sm">Weekdays 08:00 - 18:00</p>
                </div>
              </div>
            </div>
          </aside>
        </section>
      </div>
    </div>
  );
};

export default DoctorDashboard;