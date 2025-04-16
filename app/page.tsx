'use client';
import Link from 'next/link';
import newDatas from './ProductPage';
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

export default function Home() {
  const [product, setProduct] = useState('');
  const [color, setColor] = useState('');
  const [type, setType] = useState('');
  const [time, setTime] = useState('');
  const [carts, setCarts] = useState([]);
  const [info, setInfo] = useState([]);
  const [warning, setWarning] = useState(false);
  const [index, setIndex] = useState(0);

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
    .filter((item) =>
      product ? item.fName.toLowerCase().includes(product.toLowerCase()) : true
    );

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header */}
      <header className="bg-white shadow-md p-4 flex justify-between items-center border-b-4 border-gray-300">
        <h1 className="text-2xl font-bold text-green-600">Khealth</h1>
        <nav>
          <ul className="flex space-x-4">
            <li><a href="#about" className="text-gray-700">About Us</a></li>
            <li><a href="#patients" className="text-gray-700">Patients</a></li>
            <li><a href="#contact" className="text-gray-700">Contact</a></li>
            <li><a href="#locations" className="text-gray-700">Locations</a></li>
            <li>
              <Image src="/" alt="gust" width={30} height={30} className="rounded-full border-2 border-gray-400 w-[100%] hight-[100%]"   />
            </li>

          </ul>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="text-left py-16 px-6 md:px-20 bg-green-100 border-b-4 border-gray-300">
        <h2 className="text-4xl font-bold text-green-700">Nurturing Health, Building Trust</h2>
        <p className="mt-4 text-gray-600 max-w-lg">Patient-centered care. We specialize in family medicine, pediatrics, and women’s health.</p>
        <button className="mt-6 bg-green-600 text-white px-6 py-2 rounded-lg">Visit Us Today</button>
      </section>



      {/* Featured Services */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 border-b-4 border-gray-300">
        <div className="bg-gray-200 p-4 rounded-lg text-center shadow border-4 border-gray-400">
          <h4 className="text-xl font-semibold text-green-600">Elderly & Outpatient Care</h4>
          <Image src="/placeholder-image1.jpg" alt="Elderly care" width={300} height={200} className="rounded-lg mx-auto border-4 border-gray-600" />
        </div>
        <div className="bg-gray-200 p-4 rounded-lg text-center shadow border-4 border-gray-400">
          <h4 className="text-xl font-semibold text-green-600">Pediatrics</h4>
          <Image src="/placeholder-image2.jpg" alt="Pediatrics" width={300} height={200} className="rounded-lg mx-auto border-4 border-gray-600" />
        </div>
        <div className="bg-gray-200 p-4 rounded-lg text-center shadow border-4 border-gray-400">
          <h4 className="text-xl font-semibold text-green-600">Compassionate Physicians</h4>
          <Image src="/placeholder-image3.jpg" alt="Physicians" width={300} height={200} className="rounded-lg mx-auto border-4 border-gray-600" />
        </div>
      </section>


      {/* Meet Our Doctors */}
      <div className="mt-[80px] px-4">
      {/* Fancy Filter Section */}
      <div className="flex flex-wrap justify-start gap-4 mb-6">
       
        <select
          onChange={(e) => setColor(e.target.value)}
          className="p-2 border rounded-md text-black w-[30%]"
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
          className="p-2 border rounded-md w-[30%] text-black"
        />
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
        {filteredProducts.map((item, index) => (
          <div
            key={index}
            className="border p-4 rounded-lg bg-white shadow hover:shadow-lg transition"
          >
            <img
              src={item.img}
              alt={item.fName}
              className="w-full h-40 object-cover rounded-md"
            />
            <h3 className="mt-2 font-bold">{item.fName}</h3>
            <p className="text-sm text-gray-500">{item.color} - {item.type}</p>
           
            <div className="mt-4 flex justify-center">
              <Link
            href={`/doctorProfile/${item.id}`}
            onClick={() => handleInfoChange(item)}
            className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 text-center">
            more Info
          </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
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

    
      {/* Footer */}
      <footer className="bg-gray-800 text-white text-center py-4">
        <p>&copy; 2025 Khealth. All rights reserved.</p>
      </footer>
    </div>
  );
}
