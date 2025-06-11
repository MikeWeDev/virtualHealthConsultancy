"use client";
import Image from "next/image";
import Link from "next/link";
import { useCountdown } from '../context/CountdownContext';

const DoctorDashboard = () => {
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
      {/* Header Section */}
      <header className="bg-white shadow-md p-4 flex justify-between items-center border-b-4 border-gray-300">
        <h1 className="text-2xl font-bold text-green-600">Welcome to Your Dashboard, Dr. John Doe</h1>
      </header>

      {/* Main Content */}
      <main className="flex-grow p-6">
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
          {/* Profile Section */}
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
            <p className="text-gray-600">Your upcoming appointments, messages, and clients</p>
          </div>
        </div>

        {/* Appointment Section */}
        <section className="mt-8">
          <h3 className="text-lg font-semibold text-gray-800">Upcoming Appointments</h3>
          <div className="bg-white p-4 mt-4 rounded-lg shadow-md">
            <div className="flex justify-between items-center mt-2">
              <p className="text-gray-700">April 23, 2025 - 3:00 PM</p>
              <Link href="/appointments">
                <div className="text-green-600 hover:text-green-800 cursor-pointer">View Details</div>
              </Link>
            </div>
            <div className="flex justify-between items-center mt-4">
              <p className="text-gray-700">April 25, 2025 - 10:00 AM</p>
              <Link href="/appointments">
                <div className="text-green-600 hover:text-green-800 cursor-pointer">View Details</div>
              </Link>
            </div>
          </div>
        </section>

        {/* Client Section */}
        <section className="mt-8">
          <h3 className="text-lg font-semibold text-gray-800">Your Clients</h3>
          <div className="bg-white p-4 mt-4 rounded-lg shadow-md">
            <div className="flex justify-between items-center mt-2">
              <p className="text-gray-700">Jane Doe</p>
              <span className="text-green-600">Active</span>
            </div>
            <div className="flex justify-between items-center mt-4">
              <p className="text-gray-700">Michael Smith</p>
              <span className="text-gray-600">Pending</span>
            </div>
            <div className="flex justify-between items-center mt-4">
              <p className="text-gray-700">Sarah Johnson</p>
              <span className="text-red-600">Inactive</span>
            </div>
          </div>
        </section>

        {/* Messaging Section */}
        <section className="mt-8">
          <h3 className="text-lg font-semibold text-gray-800">Messages</h3>
          <div className="bg-white p-4 mt-4 rounded-lg shadow-md">
            <p className="text-gray-600">You have 3 new messages</p>
            <Link href="/messages">
              <div className="text-green-600 hover:text-green-800 cursor-pointer">Go to Messages</div>
            </Link>
          </div>
        </section>

        {/* Video Call Section */}
        <section className="mt-8">
          <h3 className="text-lg font-semibold text-gray-800">Video Calls</h3>
          <div className="bg-white p-4 mt-4 rounded-lg shadow-md">
            <p className="text-gray-600">Start a new video call with your clients</p>
            <Link href="/video-call">
              <div className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-800 transition duration-300 cursor-pointer">
                Start Video Call
              </div>
            </Link>
          </div>
        </section>

        {/* Other Features Section */}
        <section className="mt-8">
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

export default DoctorDashboard;
