'use client';
import { useState, useEffect } from 'react';
import { IoArrowBack, IoArrowForward } from 'react-icons/io5';

const reviews = [
  {
    name: 'Emily R.',
    role: 'Therapist',
    feedback: 'This service has transformed the way I connect with patients. Incredibly smooth experience!',
    image: 'https://randomuser.me/api/portraits/women/65.jpg',
    rating: 5
  },
  {
    name: 'Daniel M.',
    role: 'Cardiologist',
    feedback: 'Amazing UI and reliable video calls. Booking appointments is seamless.',
    image: 'https://randomuser.me/api/portraits/men/32.jpg',
    rating: 4.5
  },
  {
    name: 'Sophia L.',
    role: 'Nutritionist',
    feedback: 'Love how I can manage patient history and chats with ease!',
    image: 'https://randomuser.me/api/portraits/women/44.jpg',
    rating: 4
  }
];

const getStars = (rating) => {
  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 !== 0;
  return (
    <div className="flex justify-center mt-5 text-yellow-400 text-lg">
      {Array(fullStars).fill().map((_, i) => <i key={`full-${i}`} className="fa-solid fa-star"></i>)}
      {halfStar && <i className="fa-solid fa-star-half-stroke"></i>}
    </div>
  );
};

export default function Review() {
 
  const [index, setIndex] = useState(0);

  const nextReview = () => setIndex((prev) => (prev + 1) % reviews.length);
  const prevReview = () => setIndex((prev) => (prev - 1 + reviews.length) % reviews.length);

  useEffect(() => {
    const interval = setInterval(nextReview, 6000);
    return () => clearInterval(interval);
  }, []);

  const { name, role, feedback, image, rating } = reviews[index];



  return (
    <div className="bg-gray-50 min-h-screen">

    {/* reviwew of best doctor*/}
    <div className="w-full min-h-[70vh] mt-5 bg-white flex flex-col items-center justify-center p-6">
      <h2 className="text-4xl font-bold mb-2 text-center text-gray-800">Patient Reviews</h2>
      <p className="text-gray-500 text-center max-w-xl mb-8">See what healthcare professionals are saying about our platform.</p>

      <div className="bg-[#f4f9f9] rounded-2xl shadow-xl p-8 w-full max-w-2xl text-center transition-all duration-700">
        <img src={image} alt={name} className="w-24 h-24 rounded-full mx-auto mb-4 object-cover border-4 border-white shadow" />
        <h3 className="text-xl font-semibold text-teal-700">{name}</h3>
        <p className="text-sm text-gray-500 mb-3">{role}</p>
        {getStars(rating)}
        <p className="italic text-gray-600 mt-4">"{feedback}"</p>
      </div>

      <div className="mt-6 flex gap-4">
        <button
          onClick={prevReview}
          className="bg-gray-100 hover:bg-gray-200 text-gray-700 p-3 rounded-full shadow"
        >
          <IoArrowBack size={20} />
        </button>
        <button
          onClick={nextReview}
          className="bg-gray-100 hover:bg-gray-200 text-gray-700 p-3 rounded-full shadow"
        >
          <IoArrowForward size={20} />
        </button>
      </div>
    </div>

    
    </div>
  );
}
