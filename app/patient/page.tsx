'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useMemo, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '../context/UserContext';
import { getBookingsForPatient, formatBookingTime } from '../../lib/bookingStorage';

type Booking = {
  id: string;
  doctorId: number;
  doctorName: string;
  patientName: string;
  appointmentTime: string | Date;
  createdAt?: string;
};

type FormattedBooking = Omit<Booking, 'appointmentTime'> & {
  appointmentTime: Date;
};

const Dashboard = () => {
  const router = useRouter();
  const { user, initialized, logout } = useUser();
  const firstName = user?.name?.split(' ')[0] ?? 'Patient';

  const patientBookings = useMemo<Booking[]>(() => {
    if (!user || user.role !== 'patient') return [];
    return getBookingsForPatient(user.name);
  }, [user]);

  const activeBookings = useMemo<FormattedBooking[]>(
    () =>
      patientBookings
        .map((booking) => ({
          ...booking,
          appointmentTime: new Date(booking.appointmentTime),
        }))
        .filter((booking) => booking.appointmentTime.getTime() > Date.now())
        .sort((a, b) => a.appointmentTime.getTime() - b.appointmentTime.getTime()),
    [patientBookings]
  );

  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!initialized) return;
    if (!user) {
      router.push('/');
      return;
    }
    if (user.role === 'doctor') {
      router.push('/doctorProfile');
    }
  }, [initialized, user, router]);

  const formatCountdown = useCallback((seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h}h ${m}m ${s}s`;
  }, []);

  const formatDayCountdown = useCallback(
    (appointmentTime: Date) => {
      const diff = Math.max(0, Math.floor((appointmentTime.getTime() - now.getTime()) / 1000));
      return formatCountdown(diff);
    },
    [now, formatCountdown]
  );

  if (!initialized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100">
        <div className="rounded-3xl border border-slate-200 bg-white px-8 py-10 shadow-xl text-slate-800 flex items-center gap-3">
          <div className="w-5 h-5 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin" />
          <span>Loading your dashboard...</span>
        </div>
      </div>
    );
  }

  const nextAppointment = activeBookings.length > 0 ? formatBookingTime(activeBookings[0].appointmentTime) : null;

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <header className="mb-8 rounded-[2rem] bg-white p-6 shadow-xl ring-1 ring-slate-200">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.35em] text-emerald-600">
                Patient Dashboard
              </p>
              <h1 className="mt-3 text-3xl font-extrabold text-slate-950 sm:text-4xl">
                Welcome back, {firstName}
              </h1>
              <p className="mt-3 max-w-2xl text-sm sm:text-base text-slate-600">
                Your care summary is ready. Use this space to quickly review appointments, messages, and upcoming actions.
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
                <p className="text-sm font-medium text-slate-500">Next Visit</p>
                <p className="mt-4 text-3xl font-bold text-slate-950">
                  {activeBookings.length > 0 ? formatDayCountdown(activeBookings[0].appointmentTime) : 'No active booking'}
                </p>
                <p className="mt-2 text-sm text-slate-500">
                  {activeBookings.length > 0 ? nextAppointment : 'Book a consultation to get started'}
                </p>
              </div>
              <div className="rounded-3xl bg-white p-6 shadow-lg ring-1 ring-slate-200">
                <p className="text-sm font-medium text-slate-500">Messages</p>
                <p className="mt-4 text-3xl font-bold text-emerald-600">4</p>
                <p className="mt-2 text-sm text-slate-500">New care messages waiting</p>
              </div>
              <div className="rounded-3xl bg-white p-6 shadow-lg ring-1 ring-slate-200">
                <p className="text-sm font-medium text-slate-500">Care Score</p>
                <p className="mt-4 text-3xl font-bold text-slate-950">92%</p>
                <p className="mt-2 text-sm text-slate-500">Your adherence and wellness score</p>
              </div>
              <div className="rounded-3xl bg-white p-6 shadow-lg ring-1 ring-slate-200">
                <p className="text-sm font-medium text-slate-500">Tasks</p>
                <p className="mt-4 text-3xl font-bold text-slate-950">2</p>
                <p className="mt-2 text-sm text-slate-500">Action items for today</p>
              </div>
            </div>

            <div className="rounded-[2rem] bg-white p-6 shadow-xl ring-1 ring-slate-200">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-600">My care plan</p>
                  <h2 className="mt-3 text-2xl font-bold text-slate-950">Appointment overview</h2>
                </div>
                <div className="rounded-full bg-emerald-100 px-4 py-2 text-sm font-semibold text-emerald-700">
                  {activeBookings.length > 0 ? `${activeBookings.length} Active Booking${activeBookings.length > 1 ? 's' : ''}` : 'No booking yet'}
                </div>
              </div>

              <div className="mt-6 space-y-4">
                {activeBookings.length > 0 ? (
                  activeBookings.map((booking) => (
                    <div key={booking.id} className="rounded-3xl bg-slate-50 p-5 border border-slate-100">
                      <p className="text-sm text-slate-500 font-medium">Doctor</p>
                      <p className="mt-1 font-semibold text-slate-900">{booking.doctorName}</p>
                      <p className="text-sm text-slate-500 mt-3 font-medium">Appointment</p>
                      <p className="mt-1 font-semibold text-slate-900">{formatBookingTime(booking.appointmentTime)}</p>
                      <p className="text-sm text-slate-500 mt-3 font-medium">Countdown</p>
                      <p className="mt-1 font-mono font-semibold text-emerald-700">{formatDayCountdown(booking.appointmentTime)}</p>
                    </div>
                  ))
                ) : (
                  <div className="rounded-3xl bg-slate-50 p-5">
                    <p className="text-sm text-slate-500">No active bookings</p>
                    <p className="mt-2 font-semibold text-slate-900">Book a consultation to get started.</p>
                  </div>
                )}
              </div>
            </div>

            <div className="grid gap-4 lg:grid-cols-2">
              <div className="rounded-[2rem] bg-white p-6 shadow-xl ring-1 ring-slate-200">
                <h3 className="text-lg font-semibold text-slate-950">Telehealth options</h3>
                <p className="mt-2 text-sm text-slate-500">Quickly connect with your care team for messaging or video support.</p>
                <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                  <Link href="/connect/chat/123" className="rounded-full bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 text-center">
                    Message doctor
                  </Link>
                  <Link href="/connect/videocall/123" className="rounded-full border border-blue-600 px-5 py-3 text-sm font-semibold text-blue-700 transition hover:bg-blue-50 text-center">
                    Start video call
                  </Link>
                </div>
              </div>
              <div className="rounded-[2rem] bg-white p-6 shadow-xl ring-1 ring-slate-200">
                <h3 className="text-lg font-semibold text-slate-950">Health reminders</h3>
                <ul className="mt-4 space-y-3 text-sm text-slate-600">
                  <li className="rounded-2xl bg-slate-50 p-4">Drink 8 glasses of water today.</li>
                  <li className="rounded-2xl bg-slate-50 p-4">Prepare medication list for tomorrow.</li>
                  <li className="rounded-2xl bg-slate-50 p-4">Review your wellness progress.</li>
                </ul>
              </div>
            </div>
          </div>

          <aside className="space-y-6">
            <div className="rounded-[2rem] bg-gradient-to-br from-emerald-600 to-cyan-600 p-6 text-white shadow-xl ring-1 ring-emerald-200">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm uppercase tracking-[0.3em] text-emerald-100">Quick summary</p>
                  <h2 className="mt-4 text-2xl font-bold">Your care snapshot</h2>
                </div>
                <div className="rounded-full bg-white/15 px-4 py-2 text-sm font-semibold">Active</div>
              </div>
              <div className="mt-6 space-y-4 text-sm text-emerald-100/90">
                <div className="grid gap-2 rounded-3xl bg-white/10 p-4">
                  <span className="font-semibold text-white">Current score</span>
                  <span>92% wellness adherence</span>
                </div>
                <div className="grid gap-2 rounded-3xl bg-white/10 p-4">
                  <span className="font-semibold text-white">Next check-in</span>
                  <span>{activeBookings.length > 0 ? formatDayCountdown(activeBookings[0].appointmentTime) : 'No scheduled visit'}</span>
                </div>
                <div className="grid gap-2 rounded-3xl bg-white/10 p-4">
                  <span className="font-semibold text-white">Support</span>
                  <span>Message your care coordinator anytime</span>
                </div>
              </div>
            </div>

            <div className="rounded-[2rem] bg-white p-6 shadow-xl ring-1 ring-slate-200">
              <h3 className="text-lg font-semibold text-slate-950">Patient profile</h3>
              <div className="mt-5 flex items-center gap-4">
                <Image
                  src="/home/photo_3_2025-04-22_22-05-16.jpg"
                  alt="Profile avatar"
                  width={80}
                  height={80}
                  className="rounded-3xl object-cover"
                />
                <div>
                  <p className="text-lg font-semibold text-slate-900">{user?.name ?? 'Patient'}</p>
                  <p className="text-sm text-slate-500">Patient since 2025</p>
                </div>
              </div>
              <div className="mt-6 grid gap-3 text-sm text-slate-600">
                <div className="rounded-3xl bg-slate-50 p-4">
                  <span className="font-semibold text-slate-900">Care plan</span>
                  <p className="mt-2">Routine follow-up and medication review.</p>
                </div>
                <div className="rounded-3xl bg-slate-50 p-4">
                  <span className="font-semibold text-slate-900">Preferred doctor</span>
                  <p className="mt-2">Dr. Amanda Lee</p>
                </div>
              </div>
            </div>
          </aside>
        </section>
      </div>
    </div>
  );
};

export default Dashboard;