// app/page.tsx

import React from "react";
import Image from "next/image";
import Link from "next/link";

const Dashboard = () => {
  return (
    <div className="bg-gray-100 min-h-screen flex flex-col">
      {/* Header Section */}
      <header className="bg-white shadow-md p-4 flex justify-between items-center border-b-4 border-gray-300">
        <h1 className="text-2xl font-bold text-green-600">Welcome to Your Dashboard</h1>
      </header>

      {/* Main Content */}
      <main className="flex-grow p-6">
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
            <p className="text-gray-600">Your appointment details and more...</p>
          </div>
        </div>

        {/* Appointment Section */}
        <section className="mt-8">
          <h3 className="text-lg font-semibold text-gray-800">Your Appointments</h3>
          <div className="bg-white p-4 mt-4 rounded-lg shadow-md">
            <h4 className="text-md font-semibold text-gray-600">Upcoming Appointments</h4>
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

export default Dashboard;
