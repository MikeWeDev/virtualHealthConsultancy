import newDatas from '../ProductPage';
import { CalendarDays, Mail, Stethoscope } from 'lucide-react';
import Link from 'next/link';
import BookingSection from '../../../components/booking/boking'
function Badge({ children, className = '', variant }) {
  const variantClasses = {
    outline: "border-2 border-gray-300 text-gray-700",
    filled: "bg-blue-500 text-white",
  };

  return (
    <span className={`inline-block px-3 py-1 rounded-full text-sm ${variantClasses[variant]} ${className}`}>
      {children}
    </span>
  );
}

function Separator() {
  return <hr className="my-6 border-t-2 border-gray-200" />;
}

export default async function DoctorDetailPage({ params }) {
  const { id } =await  params;
  const doctor = newDatas.find((item) => item.id.toString() === id.toString());

  if (!doctor) {
    return <div className="p-6 text-center text-red-600 text-xl">Doctor not found</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 py-10 px-6 md:px-20">
      <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-xl overflow-hidden">
        <div className="flex flex-col md:flex-row items-center gap-10 p-5">
          <img 
            src={doctor.img}
            alt={doctor.Name} 
            className="w-60 h-60 object-cover rounded-full border-4 border-blue-300 shadow-lg"
          />
          <div className="space-y-4 text-center md:text-left">
            <h1 className="text-4xl font-extrabold text-blue-900">Dr. {doctor.Name}</h1>
            <div className="flex flex-wrap justify-center md:justify-start gap-2">
              <Badge variant="outline" className="bg-blue-100 text-blue-900 border-blue-300">
                <Stethoscope className="mr-1 w-4 h-4 inline-block" /> {doctor.type}
              </Badge>
              <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-300">
                Color: {doctor.color}
              </Badge>
              <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300">
                Price: {doctor.price}
              </Badge>
            </div>
            <p className="text-gray-600">
              A trusted virtual consultant for your health & wellness. Specializing in modern and holistic care solutions. 🧑‍⚕️✨
            </p>
          </div>
        </div>

        <Separator />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6  px-5">

          {/* Booking Section */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden mt-8">
           <BookingSection />
          </div>
                       <div className="space-y-10 mt-24">
                        {[
                          {
                            title: "MESSAGE",
                            link: "/connect/chat/123",
                            buttonLabel: "Start Messaging",
                          },
                          {
                            title: "Video Call",
                            link: "/connect/videocall/123",
                            buttonLabel: "Start Video Call",
                          },
                        ].map(({ title, link, buttonLabel }) => (
                          <div key={title} className="bg-blue-50 rounded-lg shadow-lg p-4">
                            <h2 className="text-xl font-semibold text-blue-900 mb-3 text-center">{title}</h2>
                            <div className="text-center">
                              <Link href={link}>
                                <button className="bg-blue-500 text-white px-6 py-2 rounded-full shadow-md hover:bg-blue-700 transition duration-300">
                                  {buttonLabel}
                                </button>
                              </Link>
                            </div>
                          </div>
                        ))}
                      </div>


          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-6 space-y-3">
              <h2 className="text-xl font-semibold text-blue-800 mb-2">About Dr. {doctor.Name}</h2>
              <p className="text-gray-600">
                Dr. {doctor.Name} has years of experience in the field of {doctor.type}, known for compassionate care and expertise in virtual consultations.
              </p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-6 space-y-3">
              <h2 className="text-xl font-semibold text-blue-800 mb-2">Contact & Availability</h2>
              <p className="text-gray-600 flex items-center gap-2">
                <Mail className="w-4 h-4 text-blue-500" /> doctor@example.com
              </p>
              <p className="text-gray-600 flex items-center gap-2">
                <CalendarDays className="w-4 h-4 text-blue-500" /> Mon - Fri: 9 AM - 5 PM
              </p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md overflow-hidden md:col-span-2">
            <div className="p-6 space-y-3">
              <h2 className="text-xl font-semibold text-blue-800 mb-2">Virtual Care Approach</h2>
              <p className="text-gray-600">
                Combining technology and empathy, Dr. {doctor.Name} offers a seamless digital healthcare experience. From lifestyle advice to medical recommendations, every consultation is tailored to your needs.
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
