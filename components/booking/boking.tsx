'use client';
import { useEffect, useMemo, useState } from 'react';
import { saveBooking, getBookingsForPatient } from '../../lib/bookingStorage';
import { useUser } from '../../app/context/UserContext';

type Doctor = {
  id: number;
  Name: string;
};

type Booking = {
  id: string;
  doctorId: number;
  doctorName: string;
  patientName: string;
  appointmentTime: string;
  createdAt: string;
};

const BookingSection = ({ doctor }: { doctor: Doctor }) => {
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [localCountdown, setLocalCountdown] = useState<number | null>(null);
  const { user } = useUser();

  const minDate = useMemo(() => new Date().toISOString().split('T')[0], []);

  const currentDoctorBooking = useMemo(() => {
    if (!user || user.role !== 'patient') return null;
    const bookings: Booking[] = getBookingsForPatient(user.name);
    const doctorBookings = bookings
      .map((booking) => ({
        ...booking,
        appointmentTimeObj: new Date(booking.appointmentTime),
      }))
      .filter((booking) =>
        booking.doctorId === doctor.id && booking.appointmentTimeObj.getTime() > Date.now()
      )
      .sort((a, b) => a.appointmentTimeObj.getTime() - b.appointmentTimeObj.getTime());
    return doctorBookings.length > 0 ? doctorBookings[0] : null;
  }, [user, doctor.id]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!date || !time) {
      alert('Please select both date and time.');
      return;
    }

    if (!user || user.role !== 'patient') {
      alert('Only patients can book consultations.');
      return;
    }

    const selectedDateTime = new Date(`${date}T${time}`);
    const now = new Date();

    const diffInSeconds = Math.floor((selectedDateTime.getTime() - now.getTime()) / 1000);
    if (diffInSeconds <= 0) {
      alert('Selected time is in the past. Please choose a future time.');
      return;
    }

    const booking: Booking = {
      id:
        typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
          ? crypto.randomUUID()
          : `booking-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`,
      doctorId: doctor.id,
      doctorName: doctor.Name,
      patientName: user.name,
      appointmentTime: selectedDateTime.toISOString(),
      createdAt: new Date().toISOString(),
    };

    saveBooking(booking);
    setDate('');
    setTime('');
    alert('Booking saved. It will appear on your patient and doctor dashboards.');
  };

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s
      .toString()
      .padStart(2, '0')}`;
  };

  useEffect(() => {
    if (!currentDoctorBooking) {
      setLocalCountdown(null);
      return;
    }

    const updateLocalCountdown = () => {
      const now = new Date();
      const target = new Date(currentDoctorBooking.appointmentTime);
      const diff = Math.floor((target.getTime() - now.getTime()) / 1000);
      setLocalCountdown(diff > 0 ? diff : 0);
    };

    updateLocalCountdown();
    const intervalId = setInterval(updateLocalCountdown, 1000);
    return () => clearInterval(intervalId);
  }, [currentDoctorBooking]);

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden mt-8 border border-gray-100">
      <div className="p-6 space-y-3">
        <h2 className="text-xl font-semibold text-blue-800 mb-2">Book a Consultation</h2>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="date" className="block text-gray-600 mb-1 font-medium text-sm">
              Select Date
            </label>
            <input
              type="date"
              id="date"
              min={minDate}
              required
              aria-label="Select Date"
              className="w-full p-3 border border-gray-300 rounded-lg shadow-sm text-black focus:ring-2 focus:ring-blue-500 outline-none"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>

          <div>
            <label htmlFor="time" className="block text-gray-600 mb-1 font-medium text-sm">
              Select Time
            </label>
            <input
              type="time"
              id="time"
              required
              aria-label="Select Time"
              className="w-full p-3 border border-gray-300 rounded-lg shadow-sm text-black focus:ring-2 focus:ring-blue-500 outline-none"
              value={time}
              onChange={(e) => setTime(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className="w-full sm:w-auto bg-blue-500 text-white px-8 py-3 rounded-full shadow-md hover:bg-blue-700 transition duration-300 font-medium"
          >
            Book Now
          </button>
        </form>

        {currentDoctorBooking && localCountdown !== null && (
          <div className="mt-4 text-center font-semibold text-lg text-blue-800 bg-blue-50 p-3 rounded-lg">
            {localCountdown > 0 ? (
              <>Time left: {formatTime(localCountdown)}</>
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