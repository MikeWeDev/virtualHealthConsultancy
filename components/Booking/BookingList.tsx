// components/Booking/BookingList.tsx

interface Booking {
    doctor: string;
    date: string;
    time: string;
  }
  
  const BookingList = () => {
    const bookings: Booking[] = [
      { doctor: 'Dr. Smith', date: '2025-04-10', time: '10:00 AM' },
      { doctor: 'Dr. Johnson', date: '2025-04-12', time: '11:30 AM' },
    ];
  
    return (
      <div className="p-5 bg-white rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-4">Upcoming Appointments</h2>
        <ul className="space-y-4">
          {bookings.map((booking, idx) => (
            <li key={idx} className="p-3 bg-gray-100 rounded-lg shadow-sm">
              <p className="font-bold">{booking.doctor}</p>
              <p>{booking.date} at {booking.time}</p>
            </li>
          ))}
        </ul>
      </div>
    );
  };
  
  export default BookingList;
  