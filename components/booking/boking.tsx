'use client';
import { useState } from 'react';
import { useCountdown } from '../../app/context/CountdownContext';

const BookingSection = () => {
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const { countdown, setCountdownTarget, clearCountdown } = useCountdown();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!date || !time) {
      alert('Please select both date and time.');
      return;
    }

    const selectedDateTime = new Date(`${date}T${time}`);
    const now = new Date();

    const diffInSeconds = Math.floor((selectedDateTime.getTime() - now.getTime()) / 1000);
    if (diffInSeconds <= 0) {
      alert('Selected time is in the past. Please choose a future time.');
      return;
    }

    setCountdownTarget(selectedDateTime);
  };

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s
      .toString()
      .padStart(2, '0')}`;
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden mt-8">
      <div className="p-6 space-y-3">
        <h2 className="text-xl font-semibold text-blue-800 mb-2">Book a Consultation</h2>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="date" className="block text-gray-600">
              Select Date
            </label>
            <input
              type="date"
              id="date"
              className="w-full p-3 border border-gray-300 rounded-lg shadow-sm"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>

          <div>
            <label htmlFor="time" className="block text-gray-600">
              Select Time
            </label>
            <input
              type="time"
              id="time"
              className="w-full p-3 border border-gray-300 rounded-lg shadow-sm"
              value={time}
              onChange={(e) => setTime(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className="bg-blue-500 text-white px-8 py-3 rounded-full shadow-md hover:bg-blue-700 transition duration-300"
          >
            Book Now
          </button>
        </form>

        {countdown !== null && (
          <div className="mt-4 text-center font-semibold text-lg text-blue-800">
            {countdown > 0 ? (
              <>Time left: {formatTime(countdown)}</>
            ) : (
              <span className="text-green-600">✅ Call the doctor now</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingSection;
