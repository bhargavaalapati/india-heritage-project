// src/pages/TourPage.jsx

import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import toursData from '../data/toursData.json';
import heritageData from '../data/heritageData.json';
import { FaMapMarkerAlt, FaEye } from 'react-icons/fa';

export default function TourPage() {
  const { tourId } = useParams();

  // Find the specific tour from our tours data
  const tour = toursData.find(t => t.id === tourId);

  // If the tour is found, find all the monument details for that tour
  const tourMonuments = tour 
    ? tour.monumentIds.map(id => heritageData.find(monument => monument.id === id)).filter(Boolean)
    : [];

  if (!tour) {
    return (
      <div className="text-center p-12">
        <h2 className="text-2xl font-semibold text-slate-600 mb-4">Tour not found.</h2>
        <Link to="/tours" className="text-orange-600 hover:underline font-bold">← Back to All Tours</Link>
      </div>
    );
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 },
    },
  };

  const itemVariants = {
    hidden: { x: -20, opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: { type: 'spring', stiffness: 100 },
    },
  };

  return (
    <motion.div
      className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <motion.header variants={itemVariants} className="text-center mb-12">
        <h1 className="text-5xl md:text-6xl font-extrabold text-slate-800 leading-tight">
          {tour.title}
        </h1>
        <p className="mt-4 text-lg text-slate-500 max-w-3xl mx-auto">
          {tour.description}
        </p>
      </motion.header>

      <motion.div variants={itemVariants} className="space-y-8">
        {tourMonuments.map((monument, index) => (
          <motion.div
            key={monument.id}
            variants={itemVariants}
            className="flex flex-col md:flex-row items-center bg-white rounded-2xl shadow-lg overflow-hidden border border-slate-100"
          >
            <div className="md:w-1/3">
              <img src={monument.thumbnail} alt={monument.name} className="w-full h-48 md:h-full object-cover" />
            </div>
            <div className="p-6 md:w-2/3">
              <p className="text-orange-500 font-semibold text-sm mb-1">STEP {index + 1}</p>
              <h2 className="text-3xl font-bold text-slate-800 mb-2">{monument.name}</h2>
              <p className="flex items-center gap-2 text-slate-500 mb-4">
                <FaMapMarkerAlt />
                {monument.location}
              </p>
              <p className="text-slate-600 text-sm mb-6 line-clamp-2">
                {monument.facts[0]}
              </p>
              <Link
                to={`/site/${monument.id}`}
                className="inline-flex items-center justify-center gap-2 py-2 px-5 bg-slate-800 text-white font-semibold rounded-lg hover:bg-slate-900 transition-colors"
              >
                <FaEye />
                View Details
              </Link>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
}