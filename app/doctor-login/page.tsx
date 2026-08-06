"use client";

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import doctorData from '../doctor/ProductPage';
import { useUser, createUserSession } from '../context/UserContext';

export default function DoctorLoginPage() {
  const router = useRouter();
  const { setUser } = useUser();

  const handleDoctorSelect = (doctor) => {
    const session = createUserSession({ name: doctor.Name, role: 'doctor', doctorId: doctor.id });
    setUser(session);
    document.cookie = `user=${encodeURIComponent(JSON.stringify(session))}; path=/; max-age=${60 * 60 * 24 * 7}`;
    setTimeout(() => {
      router.push('/doctorProfile');
    }, 0);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.35em] text-emerald-400">Doctor Access</p>
            <h1 className="mt-3 text-4xl font-extrabold text-white sm:text-5xl">Select your doctor profile</h1>
            <p className="mt-3 max-w-2xl text-sm text-slate-300">
              Choose a unique doctor and continue to the doctor dashboard. Each doctor has isolated bookings and patient data.
            </p>
          </div>
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-full border border-slate-700 bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            Back to Login
          </Link>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {doctorData.map((doctor) => (
            <div key={doctor.id} className="overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/80 shadow-xl transition hover:-translate-y-1 hover:border-emerald-500/40">
              <div className="relative h-72 w-full bg-slate-800">
                <Image
                  src={doctor.img}
                  alt={doctor.Name}
                  fill
                  className="object-fill"
                />
              </div>
              <div className="space-y-4 p-6">
                <div>
                  <h2 className="text-xl font-semibold text-white">{doctor.Name}</h2>
                  <p className="text-sm text-slate-400">{doctor.type}</p>
                </div>
                <div className="flex flex-wrap gap-2 text-xs text-slate-500">
                  <span className="rounded-full bg-slate-800 px-3 py-1">ID {doctor.id}</span>
                  <span className="rounded-full bg-slate-800 px-3 py-1">{doctor.color}</span>
                </div>
                <button
                  type="button"
                  onClick={() => handleDoctorSelect(doctor)}
                  className="w-full rounded-full bg-emerald-500 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-emerald-400"
                >
                  Login as this doctor
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
