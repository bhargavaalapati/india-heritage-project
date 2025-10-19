// src/pages/StatePage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import SkeletonLoader from '../components/SkeletonLoader';

// No more direct import of statesData

export default function StatePage() {
  const { id } = useParams();
  const [state, setState] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/states/${id}`)
      .then(res => {
        if (!res.ok) throw new Error('State not found in database');
        return res.json();
      })
      .then(data => {
        setState(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch state data:", err);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <SkeletonLoader type="page" />;

  if (!state) {
    return (
      <div className="text-center p-12">
        <h2 className="text-2xl font-semibold text-slate-600 mb-4">State not found.</h2>
        <Link to="/" className="text-orange-600 hover:underline font-bold">← Back to Map</Link>
      </div>
    );
  }

  return (
    <motion.div
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <header className="relative w-full h-96 rounded-3xl overflow-hidden shadow-2xl mb-12">
        <motion.img 
          src={state.bg} 
          alt={`View of ${state.name}`} 
          className="w-full h-full object-cover"
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 15, ease: "linear" }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        <div className="absolute bottom-0 left-0 p-8">
          <motion.h1 
            className="text-5xl md:text-6xl font-extrabold text-white leading-tight"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            {state.name}
          </motion.h1>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
        <div className="prose prose-lg text-slate-700">
          <p>{state.summary}</p>
        </div>
        <div className="w-full h-80 rounded-2xl overflow-hidden shadow-xl">
          <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            spaceBetween={0}
            slidesPerView={1}
            navigation
            pagination={{ clickable: true }}
            autoplay={{ delay: 3000, disableOnInteraction: false }}
            loop={true}
            className="h-full"
          >
            {state.carousel.map((image, index) => (
              <SwiperSlide key={index}>
                <img src={image.src} alt={image.caption} className="w-full h-full object-cover" />
                <div className="absolute bottom-0 left-0 w-full p-4 bg-black/40 text-white text-center">
                  {image.caption}
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>

      <section>
        <div className="text-center mb-8">
          <h2 className="text-4xl font-extrabold text-slate-800">Explore the Region</h2>
          <p className="mt-2 text-lg text-slate-500">
            An interactive map of {state.name}.
          </p>
        </div>
        <div className="w-full aspect-video bg-slate-200 rounded-2xl shadow-lg overflow-hidden border-4 border-white">
          {state.mapEmbedUrl ? (
            <iframe
              src={state.mapEmbedUrl}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          ) : (
            <div className="flex items-center justify-center h-full text-slate-500 font-semibold">
              <p>Map for this state is coming soon.</p>
            </div>
          )}
        </div>
      </section>
    </motion.div>
  );
}