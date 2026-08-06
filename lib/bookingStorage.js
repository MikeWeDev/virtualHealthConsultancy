function normalizeName(value = '') {
  return value
    .toString()
    .trim()
    .replace(/^dr\.??\s*/i, '')
    .replace(/\s+/g, ' ')
    .toLowerCase();
}

export function getStoredBookings() {
  if (typeof window === 'undefined') return [];
  try {
    return JSON.parse(localStorage.getItem('bookings') || '[]');
  } catch (err) {
    console.warn('[bookingStorage] failed to parse bookings', err);
    return [];
  }
}

export function saveBooking(booking) {
  if (typeof window === 'undefined') return;

  const storedBookings = getStoredBookings();
  const existingIndex = storedBookings.findIndex(
    (item) =>
      item.doctorId === booking.doctorId &&
      normalizeName(item.patientName) === normalizeName(booking.patientName)
  );

  const bookingWithId = {
    ...booking,
    id:
      booking.id ||
      (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
        ? crypto.randomUUID()
        : `bk-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`),
  };

  if (existingIndex !== -1) {
    storedBookings[existingIndex] = { ...storedBookings[existingIndex], ...bookingWithId };
  } else {
    storedBookings.push(bookingWithId);
  }

  localStorage.setItem('bookings', JSON.stringify(storedBookings));
}

export function getBookingsForDoctor({ doctorName, doctorId }) {
  const bookings = getStoredBookings();
  const normalizedDoctorName = normalizeName(doctorName);

  return bookings.filter((booking) => {
    const matchesDoctorId = doctorId != null && booking.doctorId === doctorId;
    const matchesDoctorName = normalizedDoctorName && normalizeName(booking.doctorName) === normalizedDoctorName;
    return matchesDoctorId || matchesDoctorName;
  });
}

export function getBookingsForPatient(patientName) {
  const bookings = getStoredBookings();
  const normalizedPatientName = normalizeName(patientName);
  return bookings.filter((booking) => normalizeName(booking.patientName) === normalizedPatientName);
}

export function getUpcomingBooking(bookings) {
  const upcoming = bookings
    .map((booking) => ({
      ...booking,
      appointmentTime: new Date(booking.appointmentTime),
    }))
    .filter((booking) => booking.appointmentTime.getTime() > Date.now())
    .sort((a, b) => a.appointmentTime.getTime() - b.appointmentTime.getTime());

  return upcoming.length > 0 ? upcoming[0] : null;
}

export function formatBookingTime(isoDateString) {
  try {
    const date = new Date(isoDateString);
    return date.toLocaleString([], {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return isoDateString;
  }
}
