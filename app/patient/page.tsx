'use client';
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useCountdown } from '../context/CountdownContext';

const Dashboard = () => {
  const { countdown } = useCountdown();

  // Helper to convert seconds to H:M:S
  const formatCountdown = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h}h ${m}m ${s}s`;
  };

  return (
    <div className="bg-gray-100 min-h-screen flex flex-col">
      <header className="bg-white shadow-md p-4 flex justify-between items-center border-b-4 border-gray-300">
        <h1 className="text-2xl font-bold text-green-600">Welcome to Your Dashboard</h1>
      </header>

      <main className="flex-grow p-6">

        {/* Global Countdown Display */}
        {countdown !== null && (
          <div className="mb-6 bg-gradient-to-r from-green-500 to-green-700 text-white rounded-lg p-4 shadow-md flex flex-col items-center">
            <h2 className="text-lg font-semibold">Upcoming Appointment</h2>
            <p className="text-2xl font-bold mt-1 animate-pulse">
              {formatCountdown(countdown)}
            </p>
            <p className="text-sm mt-1">Countdown to your next appointment</p>
          </div>
        )}

        <div className="flex items-center space-x-6">
          <div className="w-24 h-24">
            <Image
              src="/home/photo_3_2025-04-22_22-05-16.jpg"
              alt="Profile"
              width={100}
              height={100}
              className="rounded-full border-4 border-gray-400"
            />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-800">Dr. John Doe</h2>
            <p className="text-gray-600">Your appointment details and more...</p>
          </div>
        </div>

        {/* Booking Status Section */}
        <section className="mt-8">
          <h3 className="text-lg font-semibold text-gray-800">Your Appointments</h3>
          <div className="bg-white p-4 mt-4 rounded-lg shadow-md">
            {countdown !== null ? (
              <p className="text-blue-600 font-semibold">
                You have an upcoming appointment.
              </p>
            ) : (
              <div className="text-gray-600">No appointments booked.</div>
            )}
          </div>
        </section>

        {/* Connect Options */}
        {countdown !== null && (
          <section className="mt-10 space-y-8">
            <div className="bg-blue-50 rounded-lg shadow-lg p-4">
              <h2 className="text-xl font-semibold text-blue-900 mb-3 text-center">MESSAGE</h2>
              <div className="text-center">
                <Link href="/connect/chat/123">
                  <button className="bg-blue-500 text-white px-6 py-2 rounded-full shadow-md hover:bg-blue-700 transition duration-300">
                    Start Messaging
                  </button>
                </Link>
              </div>
            </div>

            <div className="bg-blue-50 rounded-lg shadow-lg p-4">
              <h2 className="text-xl font-semibold text-blue-900 mb-3 text-center">Video Call</h2>
              <div className="text-center">
                <Link href="/connect/videocall/123">
                  <button className="bg-blue-500 text-white px-6 py-2 rounded-full shadow-md hover:bg-blue-700 transition duration-300">
                    Start Video Call
                  </button>
                </Link>
              </div>
            </div>
          </section>
        )}

        {/* Settings & Logout */}
        <section className="mt-10">
          <div className="flex justify-between items-center">
            <Link href="/settings">
              <div className="bg-green-600 text-white p-2 rounded-lg hover:bg-green-800 transition duration-300 cursor-pointer">
                Settings
              </div>
            </Link>
            <Link href="/logout">
              <div className="bg-red-600 text-white p-2 rounded-lg hover:bg-red-800 transition duration-300 cursor-pointer">
                Logout
              </div>
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Dashboard;
