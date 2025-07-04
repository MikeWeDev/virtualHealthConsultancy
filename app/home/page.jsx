'use client';
import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { IoArrowBack, IoArrowForward } from 'react-icons/io5';
import newDatas from './ProductPage'
import Navbar  from '../../components/Nav'

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
  const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

  return (
    <div className="text-yellow-500">
      {[...Array(fullStars)].map((_, i) => (
        <span key={`full-${i}`}>★</span>
      ))}
      {halfStar && <span>★</span>} {/* Use full star symbol for half star */}
      {[...Array(emptyStars)].map((_, i) => (
        <span key={`empty-${i}`}>✩</span>
      ))}
    </div>
  );
};

const heroImages = [
  '/home/photo_3_2025-04-22_22-05-16.jpg',
  '/home/photo_4_2025-04-22_22-05-16.jpg',
  '/home/photo_5_2025-04-22_22-05-16.jpg',
  '/home/photo_25_2025-04-22_22-05-17.jpg',
];

export default function Home() {
  const [product, setProduct] = useState('');
  const [color, setColor] = useState('');
  const [type, setType] = useState('');
  const [time, setTime] = useState('');
  const [carts, setCarts] = useState([]);
  const [info, setInfo] = useState([]);
  const [warning, setWarning] = useState(false);
  const [index, setIndex] = useState(0);
  const [heroIndex, setHeroIndex] = useState(0);

useEffect(() => {
  const interval = setInterval(() => {
    setHeroIndex((prev) => (prev + 1) % heroImages.length);
  }, 2000); // Change image every 4 seconds
  return () => clearInterval(interval);
}, []);



  const nextReview = () => setIndex((prev) => (prev + 1) % reviews.length);
  const prevReview = () => setIndex((prev) => (prev - 1 + reviews.length) % reviews.length);

  useEffect(() => {
    const interval = setInterval(nextReview, 6000);
    return () => clearInterval(interval);
  }, []);

  const { name, role, feedback, image, rating } = reviews[index];

  const handleClick = (item) => {
    if (carts.some((cartItem) => cartItem.id === item.id)) {
      setWarning(true);
      alert('PRODUCT ALREADY EXISTS');
    } else {
      setCarts([...carts, item]);
    }
  };

  const handleInfoChange = (pro, d = 1) => {
    const tempArr = [...info];
    const index = tempArr.findIndex((data) => data.id === pro.id);

    if (index !== -1) {
      tempArr[index].amount += d;
      if (tempArr[index].amount <= 0) tempArr[index].amount = 1;
    } else {
      tempArr.push({ ...pro, amount: 1 });
    }

    setInfo(tempArr);
  };

  const filteredProducts = newDatas
    .filter((item) => (color ? item.color === color : true))
    .filter((item) => (type ? item.type === type : true))
    .filter((item) => (time ? item.time === time : true))
    .filter((item) => product ? item.fName.toLowerCase().includes(product.toLowerCase()) : true);

  return (
    <div className="bg-gray-50 min-h-screen">
      
       <Navbar />

      <section className="py-16 px-6 md:px-20 bg-green-100 border-b-4 border-gray-300">
      <div className="flex flex-col md:flex-row items-center gap-10">
        {/* 👉 Right Text Section */}
        <div className="md:w-1/2 w-full text-left">
          <h2 className="text-4xl font-bold text-green-700">Nurturing Health, Building Trust</h2>
          <p className="mt-4 text-gray-600 max-w-lg">
            Patient-centered care. We specialize in family medicine, pediatrics, and women’s health.
          </p>
          <button className="mt-6 bg-green-600 text-white px-6 py-2 rounded-lg">
            Visit Us Today
          </button>
        </div>

          {/* 👈 Left Image Section */}
          <div className="md:w-1/2 w-full">
          <Image
            src={heroImages[heroIndex]}
            alt="Slideshow"
            width={500}
            height={350}
            className="rounded-lg shadow-lg border-4 border-gray-400 object-cover w-full h-auto"
          />
        </div>
      </div>
    </section>


          <section className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 border-b-4 border-gray-300">
        {[
          '/service/photo_6_2025-04-22_22-05-17.jpg',
          '/service/photo_11_2025-04-22_22-05-17.jpg',
          '/service/photo_19_2025-04-22_22-05-17.jpg'
        ].map((img, i) => (
          <div key={i} className="bg-gray-200 p-4 rounded-lg text-center shadow border-4 border-gray-400">
            <h4 className="text-xl font-semibold text-green-600">
              {['Elderly & Outpatient Care', 'Pediatrics', 'Compassionate Physicians'][i]}
            </h4>
            <div className="relative w-full h-48">
            <Image
  src={img}
  alt={`service-${i}`}
 
  className="rounded-lg mx-auto border-4 border-gray-600"
  style={{ objectFit: 'cover' }} // To make the image fit within the dimensions
  layout="fill" // Ensures the image retains its aspect ratio
/>

            </div>
          </div>
        ))}
      </section>





      <div className="mt-[80px] px-6 py-8 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg shadow-lg">
        <div className="flex flex-wrap justify-start gap-6 mb-8">
          <select
            onChange={(e) => setColor(e.target.value)}
            className="p-3 border border-gray-300 rounded-lg text-black w-[40%] sm:w-[25%] focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
          >
            <option value="">Select Color</option>
            <option value="black">Black</option>
            <option value="blue">Blue</option>
            <option value="white">White</option>
            <option value="red">Red</option>
          </select>

          <input
            type="text"
            value={product}
            onChange={(e) => setProduct(e.target.value)}
            placeholder="Search Product"
            className="p-3 border border-gray-300 rounded-lg w-[40%] sm:w-[25%] text-black focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
          />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
          {filteredProducts.map((item, index) => (
            <div key={index} className="bg-white p-4 rounded-lg shadow-lg hover:shadow-2xl transition-all ease-in-out transform hover:scale-105">
              <div className="relative w-full h-48 rounded-md overflow-hidden">
              <img
  src={item.img}
  alt={item.Name}
  className="w-full h-full object-cover object-top"
/>

                <div className="absolute inset-0 bg-gradient-to-t from-black opacity-50 rounded-md"></div>
              </div>

              <div className="mt-4 text-center">
                <h3 className="text-xl font-semibold text-blue-800">{item.Name}</h3>
                <p className="text-sm text-gray-500">{item.color} - {item.type}</p>
              </div>

              <div className="mt-4 flex justify-center">
                <Link
                  href={`/doctor/${item.id}`}
                  onClick={() => handleInfoChange(item)}
                  className="bg-red-600 text-white px-6 py-2 rounded-full hover:bg-red-700 transition-colors duration-300"
                >
                  More Info
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="w-full min-h-[70vh] mt-5 bg-gradient-to-r from-teal-400 via-blue-500 to-purple-600 flex flex-col items-center justify-center p-6">
  <h2 className="text-4xl font-bold mb-2 text-center text-white">Patient Reviews</h2>
  <p className="text-white text-center max-w-xl mb-8">See what healthcare professionals are saying about our platform.</p>
  
  <div className="bg-[#f4f9f9] rounded-2xl shadow-xl p-8 w-full max-w-2xl text-center transition-all duration-700">
    <img src={image} alt={name} className="w-24 h-24 rounded-full mx-auto mb-4 object-cover border-4 border-white shadow" />
    <h3 className="text-xl font-semibold text-teal-700">{name}</h3>
    <p className="text-sm text-gray-500 mb-3">{role}</p>
    {getStars(rating)}
    <p className="italic text-gray-600 mt-4">"{feedback}"</p>
  </div>
  
  <div className="mt-6 flex gap-4">
    <button onClick={prevReview} className="bg-gray-100 hover:bg-gray-200 text-gray-700 p-3 rounded-full shadow">
      <IoArrowBack size={20} />
    </button>
    <button onClick={nextReview} className="bg-gray-100 hover:bg-gray-200 text-gray-700 p-3 rounded-full shadow">
      <IoArrowForward size={20} />
    </button>
  </div>
</div>


      <footer className="bg-gray-800 text-white text-center py-4">
        <p>&copy; 2025 Khealth. All rights reserved.</p>
      </footer>
    </div>
  );
}