// components/Booking/BookingForm.tsx

import { useState } from 'react';

const BookingForm = () => {
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [doctor, setDoctor] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Booking confirmed for ${doctor} on ${date} at ${time}`);
  };

  return (
    <div className="p-5 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Book an Appointment</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700">Select Doctor</label>
          <select
            className="w-full p-2 border border-gray-300 rounded-md"
            value={doctor}
            onChange={(e) => setDoctor(e.target.value)}
            required
          >
            <option value="">Choose a doctor</option>
            <option value="Dr. Smith">Dr. Smith</option>
            <option value="Dr. Johnson">Dr. Johnson</option>
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700">Date</label>
          <input
            type="date"
            className="w-full p-2 border border-gray-300 rounded-md"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700">Time</label>
          <input
            type="time"
            className="w-full p-2 border border-gray-300 rounded-md"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            required
          />
        </div>

        <button
          type="submit"
          className="px-5 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          Book Appointment
        </button>
      </form>
    </div>
  );
};

export default BookingForm;
