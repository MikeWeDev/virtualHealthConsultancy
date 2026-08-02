'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { 
  Star, 
  Search, 
  ArrowRight, 
  ShieldCheck, 
  Clock, 
  HeartHandshake, 
  PhoneCall, 
  Mail, 
  UserCheck, 
  Calendar, 
  MessageSquare,
  ChevronLeft,
  ChevronRight,
  Award
} from 'lucide-react';
import newDatas from './ProductPage';
import Navbar from '../../components/Nav';

const reviews = [
  {
    name: 'Dr. Emily R.',
    role: 'Licensed Therapist',
    feedback: 'This platform has transformed how I manage patient relationships. The seamless telehealth integration and intuitive scheduling save me hours every week.',
    image: 'https://images.unsplash.com/photo-1594824813566-7885a39644d6?auto=format&fit=crop&q=80&w=250',
    rating: 5,
    tag: 'Verified Practitioner'
  },
  {
    name: 'Dr. Daniel M.',
    role: 'Cardiologist',
    feedback: 'High-definition video calls and instant record sharing make digital consults feel just as personal and thorough as in-person visits.',
    image: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=250',
    rating: 5,
    tag: 'Clinical Specialist'
  },
  {
    name: 'Sophia L.',
    role: 'Clinical Nutritionist',
    feedback: 'Patients love how easy it is to book appointments and track their wellness plans. Highly recommended for modern clinics!',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=250',
    rating: 4.5,
    tag: 'Health Coach'
  },
];

const heroImages = [
  '/home/photo_3_2025-04-22_22-05-16.jpg',
  '/home/photo_4_2025-04-22_22-05-16.jpg',
  '/home/photo_5_2025-04-22_22-05-16.jpg',
  '/home/photo_25_2025-04-22_22-05-17.jpg',
];

const features = [
  {
    icon: ShieldCheck,
    title: 'HIPAA Compliant',
    description: 'Bank-grade encryption protecting patient privacy and confidential clinical records.',
  },
  {
    icon: Clock,
    title: 'Instant Booking',
    description: 'Bypass long waiting queues with real-time schedule alignment and instant confirmations.',
  },
  {
    icon: HeartHandshake,
    title: 'Dedicated Care Hub',
    description: 'Integrated follow-ups, direct doctor messaging, and automatic prescriptions.',
  },
];

const services = [
  {
    title: 'Family Medicine',
    description: 'Comprehensive primary care tailored for adults and children with dedicated medical teams.',
    image: '/service/photo_6_2025-04-22_22-05-17.jpg',
    badge: 'Primary Care'
  },
  {
    title: 'Pediatric Care',
    description: 'Child-focused healthcare designed with gentle attention for growing families.',
    image: '/service/photo_11_2025-04-22_22-05-17.jpg',
    badge: 'Child Health'
  },
  {
    title: 'Specialist Consults',
    description: 'Direct priority access to top clinical specialists for immediate health needs.',
    image: '/service/photo_19_2025-04-22_22-05-17.jpg',
    badge: 'Specialized'
  },
];

export default function Home() {
  const [search, setSearch] = useState('');
  const [heroIndex, setHeroIndex] = useState(0);
  const [reviewIndex, setReviewIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setHeroIndex((current) => (current + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setReviewIndex((current) => (current + 1) % reviews.length);
    }, 6500);
    return () => clearInterval(timer);
  }, []);

  const filteredDoctors = newDatas.filter((item) =>
    search ? item.fName?.toLowerCase().includes(search.toLowerCase()) || item.Name?.toLowerCase().includes(search.toLowerCase()) : true
  );

  const currentReview = reviews[reviewIndex];

  const renderStars = (rating) => {
    return (
      <div className="inline-flex gap-1 text-amber-400">
        {[...Array(5)].map((_, i) => (
          <Star 
            key={i} 
            className={`h-5 w-5 ${i < Math.floor(rating) ? 'fill-amber-400 text-amber-400' : 'text-slate-300'}`} 
          />
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans selection:bg-emerald-500 selection:text-white">
      <Navbar />

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-6 pb-20 space-y-24">
        
        {/* HERO SECTION */}
        <section className="relative overflow-hidden rounded-3xl bg-slate-950 border border-slate-800 p-8 lg:p-14 shadow-2xl">
          {/* Background Ambient Glows */}
          <div className="absolute top-0 right-1/4 h-96 w-96 rounded-full bg-emerald-500/10 blur-[120px] pointer-events-none" />
          <div className="absolute bottom-0 left-10 h-96 w-96 rounded-full bg-cyan-500/10 blur-[120px] pointer-events-none" />

          <div className="grid gap-12 lg:grid-cols-12 lg:items-center relative z-10">
            {/* Left Content Column */}
            <div className="lg:col-span-7 space-y-8">
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-emerald-400 backdrop-blur-md">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                Virtual Care Reimagined
              </div>

              <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-6xl leading-[1.15]">
                Healthcare built for <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">modern living.</span>
              </h1>

              <p className="max-w-xl text-lg text-slate-300 leading-relaxed">
                Connect with world-class specialists, schedule video consultations in seconds, and direct your personal health record—all within one intuitive ecosystem.
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Link 
                  href="/patient" 
                  className="group inline-flex items-center gap-2 rounded-full bg-emerald-500 px-8 py-4 text-sm font-semibold text-slate-950 shadow-lg shadow-emerald-500/25 transition-all hover:bg-emerald-400 hover:scale-105 active:scale-95"
                >
                  Book a Visit
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
                <a 
                  href="#services" 
                  className="inline-flex items-center justify-center rounded-full border border-slate-700 bg-slate-900/80 px-8 py-4 text-sm font-semibold text-white transition-all hover:border-slate-500 hover:bg-slate-800"
                >
                  Explore Services
                </a>
              </div>

              {/* Stat Counters */}
              <div className="pt-6 border-t border-slate-800/80 grid grid-cols-3 gap-6">
                <div>
                  <p className="text-2xl sm:text-3xl font-bold text-white">99.8%</p>
                  <p className="text-xs text-slate-400 mt-1">Satisfaction Rate</p>
                </div>
                <div>
                  <p className="text-2xl sm:text-3xl font-bold text-white">15 min</p>
                  <p className="text-xs text-slate-400 mt-1">Avg Response</p>
                </div>
                <div>
                  <p className="text-2xl sm:text-3xl font-bold text-white">250+</p>
                  <p className="text-xs text-slate-400 mt-1">Top Doctors</p>
                </div>
              </div>
            </div>

            {/* Right Hero Image Column */}
            <div className="lg:col-span-5">
              <div className="relative rounded-2xl border border-slate-800 bg-slate-900/50 p-3 shadow-2xl backdrop-blur-xl">
                <div className="relative h-[400px] sm:h-[480px] overflow-hidden rounded-xl">
                  {heroImages.map((src, index) => (
                    <Image
                      key={src}
                      src={src}
                      alt="Healthcare professional"
                      fill
                      priority={index === 0}
                      className={`object-cover transition-opacity duration-1000 ease-in-out ${
                        index === heroIndex ? 'opacity-100 scale-100' : 'opacity-0 scale-105 pointer-events-none'
                      }`}
                    />
                  ))}
                  
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />

                  {/* Carousel Indicators */}
                  <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 z-20">
                    {heroImages.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setHeroIndex(idx)}
                        aria-label={`Go to slide ${idx + 1}`}
                        className={`h-2 rounded-full transition-all ${
                          idx === heroIndex ? 'w-8 bg-emerald-400' : 'w-2 bg-white/40'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                {/* Floating Overlay Badge */}
                <div className="absolute -bottom-6 -left-6 hidden sm:flex items-center gap-4 rounded-2xl border border-slate-700 bg-slate-900/90 p-4 shadow-2xl backdrop-blur-md">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-400">
                    <UserCheck className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white">Verified Specialists</p>
                    <p className="text-xs text-slate-400">Ready for instant consultations</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FEATURES GRID */}
        <section className="grid gap-6 md:grid-cols-3">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <div 
                key={feature.title} 
                className="group relative rounded-2xl border border-slate-800 bg-slate-900/60 p-8 shadow-xl transition-all duration-300 hover:-translate-y-1 hover:border-slate-700 hover:bg-slate-900/90"
              >
                <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400 transition-colors group-hover:bg-emerald-500 group-hover:text-slate-950">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold text-white">{feature.title}</h3>
                <p className="mt-2 text-sm text-slate-400 leading-relaxed">{feature.description}</p>
              </div>
            );
          })}
        </section>

        {/* SERVICES SECTION */}
        <section id="services" className="space-y-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="space-y-3 max-w-2xl">
              <span className="text-xs font-semibold uppercase tracking-widest text-emerald-400">Clinical Excellence</span>
              <h2 className="text-3xl font-extrabold text-white sm:text-4xl">Comprehensive Healthcare Services</h2>
            </div>
            <p className="text-slate-400 text-sm max-w-sm">
              Tailored medical care built around your schedule, bringing board-certified doctors directly to your home.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {services.map((service) => (
              <div 
                key={service.title} 
                className="group overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/70 shadow-xl transition-all duration-300 hover:-translate-y-1 hover:border-slate-700"
              >
                <div className="relative h-64 w-full overflow-hidden bg-slate-800">
                  <Image 
                    src={service.image} 
                    alt={service.title} 
                    fill 
                    className="object-cover transition-transform duration-500 group-hover:scale-105" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80" />
                  <span className="absolute top-4 left-4 rounded-full border border-slate-700 bg-slate-950/80 px-3 py-1 text-xs font-semibold text-emerald-400 backdrop-blur-md">
                    {service.badge}
                  </span>
                </div>

                <div className="p-6 space-y-4">
                  <h3 className="text-xl font-bold text-white group-hover:text-emerald-400 transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-sm text-slate-400 leading-relaxed">{service.description}</p>
                  
                  <div className="pt-2 flex items-center justify-between border-t border-slate-800/80">
                    <span className="text-xs font-semibold text-slate-300">Book Teleconsultation</span>
                    <ArrowRight className="h-4 w-4 text-emerald-400 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* DOCTORS DIRECTORY */}
        <section id="doctors" className="space-y-10">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              <span className="text-xs font-semibold uppercase tracking-widest text-emerald-400">Our Medical Board</span>
              <h2 className="mt-2 text-3xl font-extrabold text-white sm:text-4xl">Meet Available Specialists</h2>
            </div>

            {/* Search Input */}
            <div className="relative w-full max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by doctor name or specialty..."
                className="w-full rounded-full border border-slate-800 bg-slate-900/90 py-3.5 pr-4 pl-11 text-sm text-white placeholder-slate-500 shadow-inner outline-none transition focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredDoctors.slice(0, 6).map((item) => (
              <div 
                key={item.id} 
                className="group rounded-2xl border border-slate-800 bg-slate-900/60 p-6 shadow-xl transition-all duration-300 hover:-translate-y-1 hover:border-slate-700 hover:bg-slate-900"
              >
                <div className="relative h-64 overflow-hidden rounded-xl bg-slate-800">
                  <Image 
                    src={item.img} 
                    alt={item.Name || 'Doctor profile'} 
                    fill 
                    className="object-cover transition-transform duration-500 group-hover:scale-105" 
                  />
                  <span className="absolute bottom-3 left-3 rounded-md bg-slate-950/80 px-2.5 py-1 text-xs font-medium text-emerald-400 backdrop-blur-md border border-slate-700">
                    {item.type || 'Specialist'}
                  </span>
                </div>

                <div className="mt-5 space-y-4">
                  <div>
                    <h3 className="text-lg font-bold text-white group-hover:text-emerald-400 transition-colors">
                      {item.Name || item.fName}
                    </h3>
                    <p className="text-xs text-slate-400 mt-1">{item.color || 'Senior Practitioner'}</p>
                  </div>

                  <Link 
                    href={`/doctor/${item.id}`} 
                    className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-800 py-3 text-sm font-semibold text-white transition-all hover:border-emerald-500/50 hover:bg-emerald-500 hover:text-slate-950"
                  >
                    View Profile & Schedule
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* REVIEWS CAROUSEL */}
        <section id="reviews" className="relative overflow-hidden rounded-3xl border border-slate-800 bg-slate-950 p-8 sm:p-14 shadow-2xl">
          <div className="mx-auto max-w-3xl text-center space-y-3">
            <span className="text-xs font-semibold uppercase tracking-widest text-emerald-400">Clinical Endorsements</span>
            <h2 className="text-3xl font-extrabold text-white sm:text-4xl">Trusted by Practitioners & Patients</h2>
          </div>

          <div className="mt-12 grid gap-8 lg:grid-cols-12 lg:items-center">
            {/* Active Review Card */}
            <div className="lg:col-span-8 rounded-2xl border border-slate-800 bg-slate-900/80 p-8 shadow-xl backdrop-blur-md space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <img 
                    src={currentReview.image} 
                    alt={currentReview.name} 
                    className="h-16 w-16 rounded-full object-cover border-2 border-emerald-500/40" 
                  />
                  <div>
                    <h3 className="text-lg font-bold text-white">{currentReview.name}</h3>
                    <p className="text-xs text-slate-400">{currentReview.role}</p>
                  </div>
                </div>
                <span className="rounded-full bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 text-xs text-emerald-400 font-medium">
                  {currentReview.tag}
                </span>
              </div>

              {renderStars(currentReview.rating)}

              <p className="text-slate-300 text-base leading-relaxed italic">
                "{currentReview.feedback}"
              </p>

              {/* Slider Controls */}
              <div className="flex items-center justify-end gap-2 pt-4">
                <button
                  onClick={() => setReviewIndex((prev) => (prev === 0 ? reviews.length - 1 : prev - 1))}
                  aria-label="Previous review"
                  className="rounded-full border border-slate-700 bg-slate-800 p-2 text-slate-300 hover:bg-slate-700 hover:text-white transition"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  onClick={() => setReviewIndex((prev) => (prev + 1) % reviews.length)}
                  aria-label="Next review"
                  className="rounded-full border border-slate-700 bg-slate-800 p-2 text-slate-300 hover:bg-slate-700 hover:text-white transition"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Quick Metrics Cards */}
            <div className="lg:col-span-4 space-y-4">
              <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6">
                <Calendar className="h-6 w-6 text-emerald-400 mb-3" />
                <h4 className="text-lg font-bold text-white">Instant Scheduling</h4>
                <p className="mt-1 text-xs text-slate-400">Direct integration with clinic schedules for hassle-free slots.</p>
              </div>
              <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6">
                <MessageSquare className="h-6 w-6 text-cyan-400 mb-3" />
                <h4 className="text-lg font-bold text-white">Encrypted Consultation</h4>
                <p className="mt-1 text-xs text-slate-400">End-to-end encrypted messaging and document transfers.</p>
              </div>
            </div>
          </div>
        </section>

        {/* SUPPORT / CONTACT CTA */}
        <section id="contact" className="rounded-3xl border border-slate-800 bg-slate-950 p-8 lg:p-12 shadow-2xl">
          <div className="grid gap-8 lg:grid-cols-12 lg:items-center">
            <div className="lg:col-span-7 space-y-4">
              <span className="text-xs font-semibold uppercase tracking-widest text-emerald-400">Need Help?</span>
              <h2 className="text-3xl font-extrabold text-white sm:text-4xl">We’re here for you, every step of the way.</h2>
              <p className="text-slate-400 text-sm leading-relaxed max-w-xl">
                Reach out to our care team for questions, support, or to schedule a consultation with one of our doctors.
              </p>
            </div>

            <div className="lg:col-span-5 rounded-2xl border border-slate-800 bg-slate-900 p-6 space-y-6">
              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
                  <PhoneCall className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs text-slate-400 uppercase tracking-wider">Call us</p>
                  <p className="text-base font-bold text-white">+1 (800) 123-4567</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-400">
                  <Mail className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs text-slate-400 uppercase tracking-wider">Email</p>
                  <p className="text-base font-bold text-white">support@ethealth.com</p>
                </div>
              </div>

              <Link 
                href="/patient" 
                className="flex w-full items-center justify-center rounded-xl bg-emerald-500 py-3 text-sm font-semibold text-slate-950 transition hover:bg-emerald-400"
              >
                Get support
              </Link>
            </div>
          </div>
        </section>

      </main>

      {/* FOOTER */}
      <footer className="border-t border-slate-800 bg-slate-950 py-10 text-center text-xs text-slate-500">
        <p>© 2026 Khealth Platform. All rights reserved.</p>
      </footer>
    </div>
  );
}