'use client';
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

type Reminder = {
  id: number;
  text: string;
  completed: boolean;
};

const INITIAL_REMINDERS: Reminder[] = [
  { id: 1, text: 'Drink 8 glasses of water today.', completed: false },
  { id: 2, text: 'Prepare medication list for tomorrow.', completed: false },
  { id: 3, text: 'Review your wellness progress.', completed: false },
];

const Dashboard = () => {
  const router = useRouter();
  const { user, initialized, logout } = useUser();
  const firstName = user?.name?.split(' ')[0] ?? 'Patient';
  const firstInitial = firstName.charAt(0).toUpperCase();

  const [reminders, setReminders] = useState<Reminder[]>(INITIAL_REMINDERS);

  const toggleReminder = (id: number) => {
    setReminders((prev) =>
      prev.map((item) => (item.id === id ? { ...item, completed: !item.completed } : item))
    );
  };

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
        {/* Single Consolidated Patient Welcome Header */}
        <header className="mb-8 rounded-[2rem] bg-white p-6 shadow-xl ring-1 ring-slate-200">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-4">
              {/* Profile Avatar using first letter of Patient's First Name */}
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-2xl font-bold text-white shadow-md">
                {firstInitial}
              </div>
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.25em] text-emerald-600">
                  Patient Portal
                </p>
                <h1 className="mt-1 text-2xl font-extrabold text-slate-950 sm:text-3xl">
                  Welcome back, {firstName}
                </h1>
                <p className="mt-1 text-sm text-slate-600">
                  Manage your appointments, health tasks, and medical communication in one place.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => router.push('/home')}
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
            {/* Countdown Metric Card */}
            <div className="rounded-3xl bg-white p-6 shadow-lg ring-1 ring-slate-200">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Next Scheduled Visit</p>
              <p className="mt-2 text-3xl font-extrabold text-slate-950">
                {activeBookings.length > 0 ? formatDayCountdown(activeBookings[0].appointmentTime) : 'No active booking'}
              </p>
              <p className="mt-1 text-sm text-slate-500 truncate">
                {activeBookings.length > 0 ? nextAppointment : 'Book a consultation to get started'}
              </p>
            </div>

            {/* Appointment Overview */}
            <div className="rounded-[2rem] bg-white p-6 shadow-xl ring-1 ring-slate-200">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.25em] text-emerald-600">Care Plan</p>
                  <h2 className="mt-1 text-2xl font-bold text-slate-950">Appointment Overview</h2>
                </div>
                <div className="rounded-full bg-emerald-100 px-4 py-1.5 text-xs font-semibold text-emerald-700 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  {activeBookings.length > 0 ? `${activeBookings.length} Active` : 'No Booking'}
                </div>
              </div>

              <div className="mt-6 space-y-4">
                {activeBookings.length > 0 ? (
                  activeBookings.map((booking) => (
                    <div key={booking.id} className="rounded-3xl bg-slate-50 p-5 border border-slate-200 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      <div>
                        <p className="text-xs uppercase tracking-wider text-slate-400 font-semibold">Doctor</p>
                        <p className="mt-0.5 font-bold text-slate-900 text-lg">{booking.doctorName}</p>
                        <p className="text-xs uppercase tracking-wider text-slate-400 font-semibold mt-3">Scheduled For</p>
                        <p className="mt-0.5 font-medium text-slate-700 text-sm">{formatBookingTime(booking.appointmentTime)}</p>
                      </div>

                      <div className="flex flex-col items-start md:items-end justify-between gap-3 border-t md:border-t-0 pt-3 md:pt-0 border-slate-200">
                        <div className="text-left md:text-right">
                          <p className="text-xs uppercase tracking-wider text-slate-400 font-semibold">Countdown</p>
                          <p className="mt-0.5 font-mono font-bold text-emerald-700 text-lg">{formatDayCountdown(booking.appointmentTime)}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Link
                            href={`/connect/chat/${booking.doctorId}`}
                            className="rounded-full bg-white border border-slate-300 px-3.5 py-1.5 text-xs font-semibold text-slate-700 shadow-sm hover:bg-slate-100 transition"
                          >
                            Message
                          </Link>
                          <Link
                            href={`/connect/videocall/${booking.doctorId}`}
                            className="rounded-full bg-emerald-600 px-3.5 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-emerald-700 transition"
                          >
                            Call
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="rounded-3xl bg-slate-50 p-6 text-center border border-dashed border-slate-200">
                    <p className="text-sm font-semibold text-slate-700">No active bookings right now</p>
                    <p className="mt-1 text-xs text-slate-500">Book a consultation from the homepage to connect with a specialist.</p>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Actions & Reminders */}
            <div className="grid gap-4 lg:grid-cols-2">
              <div className="rounded-[2rem] bg-white p-6 shadow-xl ring-1 ring-slate-200">
                <h3 className="text-lg font-semibold text-slate-950">Telehealth Direct Access</h3>
                <p className="mt-1 text-sm text-slate-500">Quickly launch a communication session with your specialist.</p>
                <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                  <Link href="/connect/chat/123" className="rounded-full bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 text-center flex-1">
                    Message Doctor
                  </Link>
                  <Link href="/connect/videocall/123" className="rounded-full border border-blue-600 px-5 py-2.5 text-sm font-semibold text-blue-700 transition hover:bg-blue-50 text-center flex-1">
                    Video Call
                  </Link>
                </div>
              </div>

              <div className="rounded-[2rem] bg-white p-6 shadow-xl ring-1 ring-slate-200">
                <h3 className="text-lg font-semibold text-slate-950">Daily Health Checklist</h3>
                <ul className="mt-4 space-y-2.5 text-sm text-slate-600">
                  {reminders.map((reminder) => (
                    <li
                      key={reminder.id}
                      onClick={() => toggleReminder(reminder.id)}
                      className={`rounded-2xl p-3.5 cursor-pointer transition flex items-center justify-between border ${
                        reminder.completed
                          ? 'bg-slate-50 border-slate-200 text-slate-400 line-through'
                          : 'bg-emerald-50/50 border-emerald-100 text-slate-800 hover:bg-emerald-50'
                      }`}
                    >
                      <span className="text-xs font-medium">{reminder.text}</span>
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-white border border-slate-200">
                        {reminder.completed ? 'Done' : 'Pending'}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Sidebar Summary */}
          <aside className="space-y-6">
            <div className="rounded-[2rem] bg-gradient-to-br from-emerald-600 to-cyan-600 p-6 text-white shadow-xl ring-1 ring-emerald-200">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.25em] text-emerald-100 font-semibold">Quick Summary</p>
                  <h2 className="mt-2 text-xl font-bold">Care Snapshot</h2>
                </div>
                <div className="rounded-full bg-white/20 px-3 py-1 text-xs font-semibold text-white">Active</div>
              </div>
              <div className="mt-6 space-y-3 text-sm text-emerald-50">
                <div className="grid gap-1 rounded-2xl bg-white/10 p-3.5 backdrop-blur-sm">
                  <span className="text-xs font-bold text-white">Adherence Score</span>
                  <span className="text-sm">92% wellness compliance</span>
                </div>
                <div className="grid gap-1 rounded-2xl bg-white/10 p-3.5 backdrop-blur-sm">
                  <span className="text-xs font-bold text-white">Next Check-In</span>
                  <span className="text-sm">{activeBookings.length > 0 ? formatDayCountdown(activeBookings[0].appointmentTime) : 'No scheduled visit'}</span>
                </div>
                <div className="grid gap-1 rounded-2xl bg-white/10 p-3.5 backdrop-blur-sm">
                  <span className="text-xs font-bold text-white">Support Status</span>
                  <span className="text-sm">Care coordinator available online</span>
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