'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '../context/UserContext';
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
  ChevronDown,
  ChevronUp,
  Sparkles,
  Activity,
  Award,
  CheckCircle2,
  Stethoscope
} from 'lucide-react';
import newDatas from './ProductPage';

const reviews = [
  {
    name: 'Dr. Emily R.',
    role: 'Licensed Therapist',
    feedback: 'This platform has transformed how I manage patient relationships. The seamless telehealth integration and intuitive scheduling save me hours every week.',
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
    rating: 5,
    tag: 'Verified Practitioner'
  },
  {
    name: 'Dr. Daniel M.',
    role: 'Cardiologist',
    feedback: 'High-definition video calls and instant record sharing make digital consults feel just as personal and thorough as in-person visits.',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=250',
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
    description: 'Bank-grade 256-bit encryption protecting patient privacy and confidential clinical records.',
    color: 'from-emerald-500/20 to-teal-500/10',
    accent: 'text-emerald-400'
  },
  {
    icon: Clock,
    title: 'Instant Booking',
    description: 'Bypass long waiting queues with real-time schedule alignment and instant confirmations.',
    color: 'from-cyan-500/20 to-blue-500/10',
    accent: 'text-cyan-400'
  },
  {
    icon: HeartHandshake,
    title: 'Dedicated Care Hub',
    description: 'Integrated follow-ups, direct doctor messaging, and automatic digital prescriptions.',
    color: 'from-indigo-500/20 to-purple-500/10',
    accent: 'text-indigo-400'
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
    description: 'Direct priority access to top clinical specialists for immediate specialized health needs.',
    image: '/service/photo_19_2025-04-22_22-05-17.jpg',
    badge: 'Specialized'
  },
];

export default function Home() {
  const [search, setSearch] = useState('');
  const [visibleCount, setVisibleCount] = useState(9); // Initial 9 doctors displayed
  const [heroIndex, setHeroIndex] = useState(0);
  const [reviewIndex, setReviewIndex] = useState(0);
  const router = useRouter();
  const { user } = useUser();

  useEffect(() => {
    if (user?.role === 'doctor') {
      router.push('/doctorProfile');
    }
  }, [user, router]);

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

  const filteredDoctors = newDatas.filter((item) => {
    const query = search.trim().toLowerCase();

    if (!query) return true;

    return (
      item.fName?.toLowerCase().includes(query) ||
      item.Name?.toLowerCase().includes(query) ||
      item.type?.toLowerCase().includes(query)
    );
  });
  const displayedDoctors = filteredDoctors.slice(0, visibleCount);

  const toggleShowAll = () => {
    if (visibleCount >= filteredDoctors.length) {
      setVisibleCount(9);
    } else {
      setVisibleCount(filteredDoctors.length);
    }
  };

  const currentReview = reviews[reviewIndex];

  const renderStars = (rating: number) => {
    return (
      <div
        className="inline-flex gap-1 text-amber-400"
        aria-label={`${rating} out of 5 stars`}
      >
        {[...Array(5)].map((_, i) => {
          const isFull = i < Math.floor(rating);
          const isHalf = rating % 1 !== 0 && i === Math.floor(rating);

          return (
            <Star
              key={i}
              className={`h-4 w-4 ${
                isFull
                  ? "fill-amber-400 text-amber-400"
                  : isHalf
                  ? "fill-amber-400/50 text-amber-400"
                  : "text-zinc-700"
              }`}
            />
          );
        })}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#080d1a] text-zinc-100 font-sans selection:bg-emerald-500 selection:text-zinc-950 relative overflow-x-hidden">
      
      {/* Background Ambient Glow FX */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute -top-[20%] -left-[10%] w-[600px] h-[600px] rounded-full bg-emerald-500/10 blur-[150px]" />
        <div className="absolute top-[40%] -right-[10%] w-[700px] h-[700px] rounded-full bg-cyan-500/10 blur-[180px]" />
        <div className="absolute -bottom-[10%] left-[20%] w-[500px] h-[500px] rounded-full bg-indigo-500/10 blur-[150px]" />
      </div>

      <main className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-8 pb-24 space-y-28">
        
        {/* HERO SECTION */}
        <section className="relative overflow-hidden rounded-3xl bg-zinc-900/40 border border-zinc-800/80 p-6 sm:p-10 lg:p-16 shadow-2xl backdrop-blur-2xl">
          <div className="grid gap-12 lg:grid-cols-12 lg:items-center">
            
            {/* Hero Left Info */}
            <div className="lg:col-span-7 space-y-8">
              <div className="inline-flex items-center gap-2.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-2 text-xs font-semibold tracking-wide text-emerald-400 backdrop-blur-md">
                <Sparkles className="h-4 w-4 animate-spin text-emerald-400" />
                <span>Next-Generation Virtual Health</span>
              </div>

              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white leading-[1.08]">
                Healthcare built for <br className="hidden sm:inline" />
                <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
                  modern living.
                </span>
              </h1>

              <p className="max-w-xl text-base sm:text-lg text-zinc-300 leading-relaxed font-normal">
                Connect with world-class specialists, schedule video consultations in seconds, and direct your personal health record—all within one intuitive ecosystem.
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <a 
                  href="#doctors" 
                  className="group inline-flex items-center gap-3 rounded-2xl bg-gradient-to-r from-emerald-400 to-teal-500 px-8 py-4 text-sm font-bold text-zinc-950 shadow-xl shadow-emerald-500/20 transition-all hover:shadow-emerald-500/30 hover:scale-[1.02] active:scale-[0.98]"
                >
                  <span>Book a Visit</span>
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </a>
                <a 
                  href="#services" 
                  className="inline-flex items-center justify-center rounded-2xl border border-zinc-700/80 bg-zinc-900/80 px-8 py-4 text-sm font-semibold text-zinc-200 transition-all hover:border-zinc-500 hover:bg-zinc-800 hover:text-white"
                >
                  Explore Services
                </a>
              </div>

              {/* Hero Stats */}
              <div className="pt-8 border-t border-zinc-800/80 grid grid-cols-3 gap-6">
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 text-2xl sm:text-3xl font-extrabold text-white">
                    <span>99.8%</span>
                  </div>
                  <p className="text-xs font-medium text-zinc-400">Satisfaction Rate</p>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 text-2xl sm:text-3xl font-extrabold text-white">
                    <span>15 min</span>
                  </div>
                  <p className="text-xs font-medium text-zinc-400">Avg Response</p>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 text-2xl sm:text-3xl font-extrabold text-white">
                    <span>250+</span>
                  </div>
                  <p className="text-xs font-medium text-zinc-400">Top Doctors</p>
                </div>
              </div>
            </div>

            {/* Hero Right Image Carousel */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-3xl border border-zinc-800 bg-zinc-900/60 p-3 shadow-2xl backdrop-blur-xl">
                <div className="relative h-[380px] sm:h-[460px] w-full overflow-hidden rounded-2xl">
                  {heroImages.map((src, index) => (
                    <Image
                      key={src}
                      src={src}
                      alt="Healthcare professional"
                      fill
                      priority={index === 0}
                      className={`object-fill transition-all duration-1000 ease-in-out ${
                        index === heroIndex ? 'opacity-100 scale-100' : 'opacity-0 scale-105 pointer-events-none'
                      }`}
                    />
                  ))}
                  
                  {/* Subtle Image Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#080d1a] via-transparent to-transparent opacity-90" />

                  {/* Dynamic Indicators */}
                  <div className="absolute bottom-5 left-0 right-0 flex justify-center gap-2 z-20">
                    {heroImages.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setHeroIndex(idx)}
                        aria-label={`Go to slide ${idx + 1}`}
                        className={`h-1.5 rounded-full transition-all duration-300 ${
                          idx === heroIndex ? 'w-8 bg-emerald-400' : 'w-2 bg-white/30 hover:bg-white/60'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                {/* Overlay Badge */}
                <div className="absolute -bottom-6 -left-6 hidden sm:flex items-center gap-4 rounded-2xl border border-zinc-700/80 bg-zinc-900/95 p-4 shadow-2xl backdrop-blur-xl">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 text-zinc-950 font-bold shadow-lg shadow-emerald-500/20">
                    <UserCheck className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white flex items-center gap-1.5">
                      Verified Specialists
                      <CheckCircle2 className="h-4 w-4 text-emerald-400 fill-emerald-400/20" />
                    </p>
                    <p className="text-xs text-zinc-400">Ready for instant consultations</p>
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
                className="group relative overflow-hidden rounded-3xl border border-zinc-800/80 bg-zinc-900/40 p-8 shadow-xl transition-all duration-300 hover:-translate-y-1 hover:border-zinc-700 hover:bg-zinc-900/80 backdrop-blur-xl"
              >
                <div className={`absolute -right-8 -top-8 h-32 w-32 rounded-full bg-gradient-to-br ${feature.color} opacity-50 blur-2xl transition-all group-hover:opacity-100`} />
                <div className={`mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl border border-zinc-700/50 bg-zinc-800/80 ${feature.accent} transition-transform group-hover:scale-110 shadow-lg`}>
                  <Icon className="h-7 w-7" />
                </div>
                <h3 className="text-xl font-bold text-white">{feature.title}</h3>
                <p className="mt-3 text-sm text-zinc-400 leading-relaxed font-normal">{feature.description}</p>
              </div>
            );
          })}
        </section>

        {/* SERVICES SECTION */}
        <section id="services" className="space-y-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-zinc-800/80 pb-6">
            <div className="space-y-3 max-w-2xl">
              <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-emerald-400">
                <Stethoscope className="h-4 w-4" />
                <span>Clinical Excellence</span>
              </div>
              <h2 className="text-3xl font-extrabold text-white sm:text-5xl">Comprehensive Healthcare Services</h2>
            </div>
            <p className="text-zinc-400 text-sm max-w-md leading-relaxed">
              Tailored medical care built around your schedule, bringing board-certified doctors directly to your home.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {services.map((service) => (
              <div 
                key={service.title} 
                className="group relative overflow-hidden rounded-3xl border border-zinc-800/80 bg-zinc-900/40 shadow-xl transition-all duration-300 hover:-translate-y-1.5 hover:border-zinc-700 hover:shadow-2xl backdrop-blur-xl flex flex-col justify-between"
              >
                <div>
                  <div className="relative h-60 w-full overflow-hidden bg-zinc-950">
                    <Image 
                      src={service.image} 
                      alt={service.title} 
                      fill 
                      className="object-cover transition-transform duration-700 group-hover:scale-110" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent" />
                    <span className="absolute top-4 left-4 rounded-full border border-zinc-700/80 bg-zinc-950/80 px-3.5 py-1.5 text-xs font-semibold text-emerald-400 backdrop-blur-md shadow-lg">
                      {service.badge}
                    </span>
                  </div>

                  <div className="p-6 space-y-3">
                    <h3 className="text-xl font-bold text-white group-hover:text-emerald-400 transition-colors">
                      {service.title}
                    </h3>
                    <p className="text-sm text-zinc-400 leading-relaxed">{service.description}</p>
                  </div>
                </div>

                <div className="p-6 pt-0 mt-auto">
                  <div className="pt-4 border-t border-zinc-800/80">
                    <a 
                      href="#doctors"
                      className="group/btn flex items-center justify-between text-xs font-semibold text-zinc-300 hover:text-emerald-400 transition-colors"
                    >
                      <span>Book Teleconsultation</span>
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-800 border border-zinc-700 group-hover/btn:bg-emerald-400 group-hover/btn:border-emerald-400 group-hover/btn:text-zinc-950 transition-all">
                        <ArrowRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-0.5" />
                      </div>
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* DOCTORS DIRECTORY */}
        <section id="doctors" className="space-y-10">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between border-b border-zinc-800/80 pb-6">
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-emerald-400">
                <Award className="h-4 w-4" />
                <span>Our Medical Board</span>
              </div>
              <h2 className="mt-2 text-3xl font-extrabold text-white sm:text-5xl">Meet Available Specialists</h2>
            </div>

            {/* Search Input */}
            <div className="relative w-full max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
              <input
                type="search"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setVisibleCount(9); // Reset count when filtering
                }}
                placeholder="Search doctor name or specialty..."
                className="w-full rounded-2xl border border-zinc-700/80 bg-zinc-900/90 py-3.5 pr-4 pl-11 text-sm text-white placeholder-zinc-500 shadow-inner outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 backdrop-blur-md"
              />
            </div>
          </div>

          {displayedDoctors.length === 0 ? (
            <div className="rounded-3xl border border-zinc-800 bg-zinc-900/30 p-12 text-center text-zinc-400 space-y-3">
              <Search className="mx-auto h-8 w-8 text-zinc-600" />
              <p className="text-base font-semibold text-white">No doctors found matching "{search}"</p>
              <p className="text-xs text-zinc-500">Try searching for a different specialty or practitioner name.</p>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {displayedDoctors.map((item) => {
                const doctorName = item.Name || item.fName || 'Medical Professional';
                return (
                  <div 
                    key={item.id} 
                    className="group flex flex-col justify-between rounded-3xl border border-zinc-800/80 bg-zinc-900/40 p-5 shadow-xl transition-all duration-300 hover:-translate-y-1.5 hover:border-zinc-700 hover:bg-zinc-900/80 backdrop-blur-xl"
                  >
                    <div>
                      <div className="relative h-64 w-full overflow-hidden rounded-2xl bg-zinc-950">
                        {item.img ? (
                          <Image 
                            src={item.img} 
                            alt={doctorName} 
                            fill
                            className="object-fill transition-transform duration-700 group-hover:scale-105" 
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center bg-zinc-800 text-2xl font-bold text-zinc-500 uppercase">
                            {doctorName.charAt(0)}
                          </div>
                        )}
                        <span className="absolute bottom-3 left-3 rounded-full bg-zinc-950/80 px-3 py-1 text-xs font-semibold text-emerald-400 backdrop-blur-md border border-zinc-700/80 shadow-md">
                          {item.type || 'Specialist'}
                        </span>
                      </div>

                      <div className="mt-5 space-y-1">
                        <h3 className="text-lg font-bold text-white group-hover:text-emerald-400 transition-colors">
                          {doctorName}
                        </h3>
                        <p className="text-xs text-zinc-400 font-medium">{item.color || 'Senior Practitioner'}</p>
                      </div>
                    </div>

                    <div className="mt-6 pt-4 border-t border-zinc-800/60">
                      <Link 
                        href={`/doctor/${item.id}`} 
                        className="flex w-full items-center justify-center gap-2 rounded-xl border border-zinc-700 bg-zinc-800/80 py-3 text-sm font-semibold text-white transition-all hover:border-emerald-500/50 hover:bg-gradient-to-r hover:from-emerald-400 hover:to-teal-500 hover:text-zinc-950 hover:shadow-lg hover:shadow-emerald-500/20"
                      >
                        <span>View Profile & Schedule</span>
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* VIEW ALL / SHOW LESS BUTTON */}
          {filteredDoctors.length > 9 && (
            <div className="flex justify-center pt-6">
              <button
                onClick={toggleShowAll}
                className="inline-flex items-center gap-2 rounded-2xl border border-zinc-700 bg-zinc-800/90 px-8 py-3.5 text-sm font-bold text-white shadow-xl transition-all hover:border-emerald-500 hover:bg-emerald-400 hover:text-zinc-950 hover:scale-105 active:scale-95"
              >
                <span>
                  {visibleCount >= filteredDoctors.length 
                    ? 'Show Fewer Doctors' 
                    : `View All Doctors (${filteredDoctors.length})`}
                </span>
                {visibleCount >= filteredDoctors.length ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </button>
            </div>
          )}
        </section>

        {/* REVIEWS CAROUSEL */}
        <section id="reviews" className="relative overflow-hidden rounded-3xl border border-zinc-800/80 bg-zinc-900/40 p-6 sm:p-12 lg:p-16 shadow-2xl backdrop-blur-2xl">
          <div className="mx-auto max-w-3xl text-center space-y-3">
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-emerald-400">
              <Activity className="h-4 w-4" />
              <span>Clinical Endorsements</span>
            </div>
            <h2 className="text-3xl font-extrabold text-white sm:text-4xl">Trusted by Practitioners & Patients</h2>
          </div>

          <div className="mt-12 grid gap-8 lg:grid-cols-12 lg:items-center">
            {/* Active Review Card */}
            <div className="lg:col-span-8 rounded-3xl border border-zinc-800/80 bg-zinc-950/60 p-6 sm:p-10 shadow-2xl backdrop-blur-md space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <img 
                    src={currentReview.image} 
                    alt={currentReview.name} 
                    className="h-16 w-16 rounded-2xl object-cover border-2 border-emerald-500/40 shadow-lg" 
                  />
                  <div>
                    <h3 className="text-lg font-bold text-white">{currentReview.name}</h3>
                    <p className="text-xs text-zinc-400">{currentReview.role}</p>
                  </div>
                </div>
                <span className="rounded-full bg-emerald-500/10 border border-emerald-500/20 px-3.5 py-1 text-xs text-emerald-400 font-semibold">
                  {currentReview.tag}
                </span>
              </div>

              {renderStars(currentReview.rating)}

              <p className="text-zinc-300 text-base sm:text-lg leading-relaxed italic font-light">
                "{currentReview.feedback}"
              </p>

              {/* Slider Controls */}
              <div className="flex items-center justify-end gap-2 pt-4 border-t border-zinc-800/60">
                <button
                  onClick={() => setReviewIndex((prev) => (prev === 0 ? reviews.length - 1 : prev - 1))}
                  aria-label="Previous review"
                  className="rounded-xl border border-zinc-700 bg-zinc-900 p-2.5 text-zinc-300 hover:bg-zinc-800 hover:text-white transition shadow-md"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  onClick={() => setReviewIndex((prev) => (prev + 1) % reviews.length)}
                  aria-label="Next review"
                  className="rounded-xl border border-zinc-700 bg-zinc-900 p-2.5 text-zinc-300 hover:bg-zinc-800 hover:text-white transition shadow-md"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Quick Metrics Cards */}
            <div className="lg:col-span-4 space-y-4">
              <div className="rounded-3xl border border-zinc-800/80 bg-zinc-900/50 p-6 shadow-xl backdrop-blur-md">
                <Calendar className="h-6 w-6 text-emerald-400 mb-3" />
                <h4 className="text-lg font-bold text-white">Instant Scheduling</h4>
                <p className="mt-1 text-xs text-zinc-400 leading-relaxed">Direct integration with clinic schedules for hassle-free slots.</p>
              </div>
              <div className="rounded-3xl border border-zinc-800/80 bg-zinc-900/50 p-6 shadow-xl backdrop-blur-md">
                <MessageSquare className="h-6 w-6 text-cyan-400 mb-3" />
                <h4 className="text-lg font-bold text-white">Encrypted Consultation</h4>
                <p className="mt-1 text-xs text-zinc-400 leading-relaxed">End-to-end encrypted messaging and document transfers.</p>
              </div>
            </div>
          </div>
        </section>

        {/* SUPPORT / CONTACT CTA */}
        <section id="contact" className="rounded-3xl border border-zinc-800/80 bg-zinc-900/40 p-8 sm:p-12 lg:p-14 shadow-2xl backdrop-blur-2xl">
          <div className="grid gap-8 lg:grid-cols-12 lg:items-center">
            <div className="lg:col-span-7 space-y-4">
              <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">Need Immediate Help?</span>
              <h2 className="text-3xl font-extrabold text-white sm:text-4xl">We’re here for you, every step of the way.</h2>
              <p className="text-zinc-400 text-sm leading-relaxed max-w-xl font-normal">
                Reach out to our care team for questions, support, or to schedule a consultation with one of our doctors.
              </p>
            </div>

            <div className="lg:col-span-5 rounded-3xl border border-zinc-800/80 bg-zinc-950/80 p-6 sm:p-8 space-y-6 shadow-xl">
              <div className="flex items-center gap-4">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                  <PhoneCall className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs text-zinc-400 uppercase tracking-wider font-semibold">Call us</p>
                  <p className="text-base font-bold text-white">+1 (800) 123-4567</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
                  <Mail className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs text-zinc-400 uppercase tracking-wider font-semibold">Email</p>
                  <p className="text-base font-bold text-white">support@ethealth.com</p>
                </div>
              </div>

              <Link 
                href="/patient" 
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-400 to-teal-500 py-3.5 text-sm font-bold text-zinc-950 shadow-lg shadow-emerald-500/20 transition hover:scale-[1.02] active:scale-[0.98]"
              >
                <span>Get support</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>

      </main>

      {/* FOOTER */}
      <footer className="border-t border-zinc-800/80 bg-zinc-950/90 py-10 text-center text-xs text-zinc-500 relative z-10">
        <p>© 2026 Khealth Platform. All rights reserved.</p>
      </footer>
    </div>
  );
}