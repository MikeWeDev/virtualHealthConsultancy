'use client';
import { useEffect, useMemo, useState, useCallback } from 'react';
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

const QUICK_TIME_SLOTS = [
  { label: 'Morning (09:00 AM)', time: '09:00' },
  { label: 'Afternoon (02:00 PM)', time: '14:00' },
  { label: 'Evening (05:00 PM)', time: '17:00' },
];

function useCountdown(targetIsoDate: string | null) {
  const [secondsLeft, setSecondsLeft] = useState<number | null>(null);

  useEffect(() => {
    if (!targetIsoDate) {
      setSecondsLeft(null);
      return;
    }

    const update = () => {
      const diff = Math.floor((new Date(targetIsoDate).getTime() - Date.now()) / 1000);
      setSecondsLeft(diff > 0 ? diff : 0);
    };

    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [targetIsoDate]);

  return secondsLeft;
}

const BookingSection = ({ doctor }: { doctor: Doctor }) => {
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'error' | 'success'; message: string } | null>(null);

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

  const localCountdown = useCountdown(currentDoctorBooking?.appointmentTime || null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback(null);

    if (!date || !time) {
      setFeedback({ type: 'error', message: 'Please select both date and time.' });
      return;
    }

    if (!user || user.role !== 'patient') {
      setFeedback({ type: 'error', message: 'Only patients can book consultations.' });
      return;
    }

    const selectedDateTime = new Date(`${date}T${time}`);
    const diffInSeconds = Math.floor((selectedDateTime.getTime() - Date.now()) / 1000);

    if (diffInSeconds <= 0) {
      setFeedback({ type: 'error', message: 'Selected time is in the past. Please choose a future time.' });
      return;
    }

    setIsSubmitting(true);

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
    setIsSubmitting(false);
    setFeedback({ type: 'success', message: 'Booking saved successfully! It will appear on your dashboard.' });
  };

  const formatTime = useCallback((seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s
      .toString()
      .padStart(2, '0')}`;
  }, []);

  const formattedAppointmentDate = useMemo(() => {
    if (!currentDoctorBooking) return '';
    return new Date(currentDoctorBooking.appointmentTime).toLocaleString(undefined, {
      dateStyle: 'medium',
      timeStyle: 'short',
    });
  }, [currentDoctorBooking]);

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden mt-8 border border-gray-100">
      <div className="p-6 space-y-4">
        <div>
          <h2 className="text-xl font-bold text-blue-900">Book a Consultation</h2>
          <p className="text-xs text-gray-500 mt-0.5">Scheduling with Dr. {doctor.Name}</p>
        </div>

        {feedback && (
          <div
            className={`p-3 rounded-lg text-sm font-medium ${
              feedback.type === 'error'
                ? 'bg-red-50 text-red-700 border border-red-200'
                : 'bg-green-50 text-green-700 border border-green-200'
            }`}
          >
            {feedback.message}
          </div>
        )}

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="date" className="block text-gray-700 mb-1 font-medium text-sm">
              Select Date
            </label>
            <input
              type="date"
              id="date"
              min={minDate}
              required
              aria-label="Select Date"
              className="w-full p-3 border border-gray-300 rounded-lg shadow-sm text-black focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>

          <div>
            <label htmlFor="time" className="block text-gray-700 mb-1 font-medium text-sm">
              Select Time
            </label>
            <input
              type="time"
              id="time"
              required
              aria-label="Select Time"
              className="w-full p-3 border border-gray-300 rounded-lg shadow-sm text-black focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              value={time}
              onChange={(e) => setTime(e.target.value)}
            />
            
            <div className="mt-2">
              <span className="text-xs text-gray-500 font-medium">Quick Slots:</span>
              <div className="flex flex-wrap gap-2 mt-1">
                {QUICK_TIME_SLOTS.map((slot) => (
                  <button
                    key={slot.time}
                    type="button"
                    onClick={() => setTime(slot.time)}
                    className={`text-xs px-2.5 py-1 rounded-md border transition ${
                      time === slot.time
                        ? 'bg-blue-600 text-white border-blue-600 font-medium'
                        : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'
                    }`}
                  >
                    {slot.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full sm:w-auto bg-blue-600 text-white px-8 py-3 rounded-full shadow-md hover:bg-blue-700 disabled:opacity-50 transition duration-300 font-medium text-sm"
          >
            {isSubmitting ? 'Booking...' : 'Book Now'}
          </button>
        </form>

        {currentDoctorBooking && localCountdown !== null && (
          <div className="mt-6 border-t border-gray-100 pt-4">
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 text-center">
              <span className="text-xs uppercase tracking-wider text-blue-600 font-bold block mb-1">
                Upcoming Appointment
              </span>
              <p className="text-xs text-gray-600 mb-2">{formattedAppointmentDate}</p>
              
              <div className="font-semibold text-lg text-blue-900">
                {localCountdown > 0 ? (
                  <div className="flex items-center justify-center gap-1.5">
                    <span>⏱️ Time left:</span>
                    <span className="font-mono text-blue-700">{formatTime(localCountdown)}</span>
                  </div>
                ) : (
                  <span className="text-green-600 flex items-center justify-center gap-1">
                    ✅ Call doctor now
                  </span>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingSection;