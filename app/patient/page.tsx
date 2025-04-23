"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

const Dashboard = () => {
  const [appointment, setAppointment] = useState<Date | null>(null);
  const [timeLeft, setTimeLeft] = useState<string>("");

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (appointment) {
      interval = setInterval(() => {
        const now = new Date().getTime();
        const distance = appointment.getTime() - now;

        if (distance < 0) {
          clearInterval(interval);
          setTimeLeft("Appointment time reached");
          return;
        }

        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        setTimeLeft(`${hours}h ${minutes}m ${seconds}s`);
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [appointment]);

  const handleBook = () => {
    const futureDate = new Date();
    futureDate.setMinutes(futureDate.getMinutes() + 90); // Simulate booking 1.5 hrs from now
    setAppointment(futureDate);
  };

  return (
    <div className="bg-gray-100 min-h-screen flex flex-col">
      <header className="bg-white shadow-md p-4 flex justify-between items-center border-b-4 border-gray-300">
        <h1 className="text-2xl font-bold text-green-600">Welcome to Your Dashboard</h1>
      </header>

      <main className="flex-grow p-6">
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

        {/* Appointment Section */}
        <section className="mt-8">
          <h3 className="text-lg font-semibold text-gray-800">Your Appointments</h3>
          <div className="bg-white p-4 mt-4 rounded-lg shadow-md">
            {appointment ? (
              <div>
                <h4 className="text-md font-semibold text-gray-600">Upcoming Appointment</h4>
                <p className="text-gray-700 mt-2">
                  Appointment at: {appointment.toLocaleString()}
                </p>
                <p className="text-blue-600 font-semibold mt-1">Countdown: {timeLeft}</p>
              </div>
            ) : (
              <div className="text-gray-600">No appointments booked.</div>
            )}
          </div>
        </section>

        {/* Booking Button */}
        {!appointment && (
          <section className="mt-6">
            <button
              onClick={handleBook}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition duration-300"
            >
              Book New Appointment
            </button>
          </section>
        )}

        {/* Conditional Connect Options */}
        {appointment && (
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
                <Link href="/connect/videocall">
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
