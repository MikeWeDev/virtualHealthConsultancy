'use client';
import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow-md p-4 border-b-4 border-gray-300">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-green-600">EThealth</h1>

        {/* Mobile toggle */}
        <button
          className="md:hidden focus:outline-none"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {menuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>

        {/* Desktop nav */}
        <nav className="hidden md:block">
          <ul className="flex space-x-6 items-center">
            <NavLinks />
          </ul>
        </nav>
      </div>

      {/* Mobile nav */}
      {menuOpen && (
        <nav className="mt-4 md:hidden">
          <ul className="flex flex-col space-y-4">
            <NavLinks />
          </ul>
        </nav>
      )}
    </header>
  );
}

function NavLinks() {
  return (
    <>
      <li>
        <a href="#about" className="text-gray-700 hover:text-green-600 transition duration-300 ease-in-out">About Us</a>
      </li>
      <li>
        <a href="#patients" className="text-gray-700 hover:text-green-600 transition duration-300 ease-in-out">Patients</a>
      </li>
      <li>
        <a href="#contact" className="text-gray-700 hover:text-green-600 transition duration-300 ease-in-out">Contact</a>
      </li>
      <li>
        <a href="#locations" className="text-gray-700 hover:text-green-600 transition duration-300 ease-in-out">Locations</a>
      </li>
      <li>
        <Link href="/patient">
          <Image
            src="/smiling-african-american-millennial-businessman-600nw-1437938108.webp"
            alt="guest"
            width={40}
            height={40}
            className="rounded-full border-2 border-gray-400 hover:border-green-600 transition-all duration-300 ease-in-out transform hover:scale-110"
          />
        </Link>
      </li>
    </>
  );
}
