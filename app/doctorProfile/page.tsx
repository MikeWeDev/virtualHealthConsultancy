"use client";
import Image from 'next/image';
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
  const firstName = doctor?.Name?.split(' ')[1] || user?.name?.split(' ')[0] || 'Doctor';
  const doctorSpecialty = doctor?.type || 'Primary Care Specialist';
  const doctorImage = doctor?.img || '/home/photo_3_2025-04-22_22-05-16.jpg';

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
    if (!user && !cookieUser) {
      router.push('/');
      return;
    }
    if (user?.role === 'patient') {
      router.push('/home');
    }
  }, [initialized, user, router]);

  if (!initialized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100">
        <div className="rounded-3xl border border-slate-200 bg-white px-8 py-10 shadow-xl text-slate-800">
          Loading dashboard...
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
        <header className="mb-8 rounded-[2rem] bg-white p-6 shadow-xl ring-1 ring-slate-200">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.35em] text-emerald-600">
                Doctor Dashboard
              </p>
              <h1 className="mt-3 text-3xl font-extrabold text-slate-950 sm:text-4xl">
                Welcome back, Dr. {firstName}
              </h1>
              <p className="mt-3 max-w-2xl text-sm sm:text-base text-slate-600">
                Manage patients, view consults, and launch your next session from one polished dashboard.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => router.push('/home')}
                className="rounded-full border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
              >
                Go to Home
              </button>
              <button
                type="button"
                onClick={logout}
                className="rounded-full bg-red-600 px-5 py-3 text-sm font-semibold text-white shadow-lg transition hover:bg-red-700"
              >
                Logout
              </button>
            </div>
          </div>
        </header>

        <section className="grid gap-6 xl:grid-cols-[1.8fr_1fr]">
          <div className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <div className="rounded-3xl bg-white p-6 shadow-lg ring-1 ring-slate-200">
                <p className="text-sm font-medium text-slate-500">Today&apos;s Consults</p>
                <p className="mt-4 text-3xl font-bold text-slate-950">{doctorBookings.length}</p>
                <p className="mt-2 text-sm text-slate-500">Confirmed virtual visits</p>
              </div>
              <div className="rounded-3xl bg-white p-6 shadow-lg ring-1 ring-slate-200">
                <p className="text-sm font-medium text-slate-500">New Requests</p>
                <p className="mt-4 text-3xl font-bold text-emerald-600">8</p>
                <p className="mt-2 text-sm text-slate-500">Appointments waiting approval</p>
              </div>
              <div className="rounded-3xl bg-white p-6 shadow-lg ring-1 ring-slate-200">
                <p className="text-sm font-medium text-slate-500">Follow-ups</p>
                <p className="mt-4 text-3xl font-bold text-slate-950">3</p>
                <p className="mt-2 text-sm text-slate-500">Patients requiring follow-up</p>
              </div>
              <div className="rounded-3xl bg-white p-6 shadow-lg ring-1 ring-slate-200">
                <p className="text-sm font-medium text-slate-500">Messages</p>
                <p className="mt-4 text-3xl font-bold text-slate-950">12</p>
                <p className="mt-2 text-sm text-slate-500">Unread care conversations</p>
              </div>
            </div>

            <div className="rounded-[2rem] bg-white p-6 shadow-xl ring-1 ring-slate-200">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-600">Consult overview</p>
                  <h2 className="mt-3 text-2xl font-bold text-slate-950">Upcoming appointments</h2>
                </div>
                <div className="rounded-full bg-emerald-100 px-4 py-2 text-sm font-semibold text-emerald-700">
                  {upcomingBooking ? 'Next booking active' : 'No active booking'}
                </div>
              </div>

              <div className="mt-6 grid gap-4">
                <div className="rounded-3xl bg-slate-50 p-5">
                  <p className="text-sm text-slate-500">Next patient</p>
                  <p className="mt-2 font-semibold text-slate-950">{upcomingBooking?.patientName || 'No upcoming patient'}</p>
                </div>
                <div className="rounded-3xl bg-slate-50 p-5">
                  <p className="text-sm text-slate-500">Consult time</p>
                  <p className="mt-2 font-semibold text-slate-950">{nextAppointment || 'Not scheduled'}</p>
                  {upcomingBooking && localCountdown !== null && (
                    <p className="mt-2 text-sm font-semibold text-emerald-700">{formatCountdown(localCountdown)} remaining</p>
                  )}
                </div>
                <div className="rounded-3xl bg-slate-50 p-5">
                  <p className="text-sm text-slate-500">Mode</p>
                  <p className="mt-2 font-semibold text-slate-950">Video call</p>
                </div>
              </div>
            </div>

            <div className="grid gap-4 lg:grid-cols-2">
              <div className="rounded-[2rem] bg-white p-6 shadow-xl ring-1 ring-slate-200">
                <h3 className="text-lg font-semibold text-slate-950">Client snapshots</h3>
                <div className="mt-5 space-y-4 text-sm text-slate-600">
                  <div className="rounded-3xl bg-slate-50 p-4">Jane Doe — Active care plan</div>
                  <div className="rounded-3xl bg-slate-50 p-4">Michael Smith — Awaiting lab results</div>
                  <div className="rounded-3xl bg-slate-50 p-4">Sarah Johnson — Telehealth follow-up due</div>
                </div>
              </div>
              <div className="rounded-[2rem] bg-white p-6 shadow-xl ring-1 ring-slate-200">
                <h3 className="text-lg font-semibold text-slate-950">Telehealth actions</h3>
                <p className="mt-2 text-sm text-slate-500">Open messaging or start a call with the next patient.</p>
                <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                  <Link href="/connect/chat/123" className="rounded-full bg-blue-600 px-5 py-3 text-sm font-semibold text-white text-center transition hover:bg-blue-700">
                    Message patient
                  </Link>
                  <Link href="/connect/videocall/123" className="rounded-full border border-blue-600 px-5 py-3 text-sm font-semibold text-blue-700 text-center transition hover:bg-blue-50">
                    Start video call
                  </Link>
                </div>
              </div>
            </div>
          </div>

          <aside className="space-y-6">
            <div className="rounded-[2rem] bg-gradient-to-br from-emerald-600 to-cyan-600 p-6 text-white shadow-xl ring-1 ring-emerald-200">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm uppercase tracking-[0.3em] text-emerald-100">Daily status</p>
                  <h2 className="mt-4 text-2xl font-bold">Ready for patients</h2>
                </div>
                <div className="rounded-full bg-white/15 px-4 py-2 text-sm font-semibold">Active</div>
              </div>
              <div className="mt-6 space-y-4 text-sm text-emerald-100/90">
                <div className="rounded-3xl bg-white/10 p-4">
                  <span className="font-semibold text-white">Today&apos;s schedule</span>
                  <p className="mt-2">5 sessions remaining</p>
                </div>
                <div className="rounded-3xl bg-white/10 p-4">
                  <span className="font-semibold text-white">Response time</span>
                  <p className="mt-2">Under 15 minutes</p>
                </div>
              </div>
            </div>

            <div className="rounded-[2rem] bg-white p-6 shadow-xl ring-1 ring-slate-200">
              <h3 className="text-lg font-semibold text-slate-950">Your profile</h3>
              <div className="mt-5 flex items-center gap-4">
                <Image
                  src={doctorImage}
                  alt={`Dr. ${firstName}`}
                  width={80}
                  height={80}
                  className="rounded-3xl object-cover"
                />
                <div>
                  <p className="text-lg font-semibold text-slate-900">Dr. {doctor?.Name || firstName}</p>
                  <p className="text-sm text-slate-500">{doctorSpecialty}</p>
                </div>
              </div>
              <div className="mt-6 grid gap-3 text-sm text-slate-600">
                <div className="rounded-3xl bg-slate-50 p-4">
                  <span className="font-semibold text-slate-900">Practice</span>
                  <p className="mt-2">Virtual Health Clinic</p>
                </div>
                <div className="rounded-3xl bg-slate-50 p-4">
                  <span className="font-semibold text-slate-900">Availability</span>
                  <p className="mt-2">Weekdays 08:00 - 18:00</p>
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
