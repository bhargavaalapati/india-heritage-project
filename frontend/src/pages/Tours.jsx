// src/pages/Tours.jsx

import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaRoute } from 'react-icons/fa';
import toursData from '../data/toursData.json';

export default function Tours() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: 'spring', stiffness: 100 },
    },
  };

  return (
    <motion.div
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <motion.header variants={itemVariants} className="text-center mb-12">
        <h1 className="text-5xl md:text-6xl font-extrabold text-slate-800 leading-tight">
          Curated <span className="text-orange-500">Learning Tours</span>
        </h1>
        <p className="mt-4 text-lg text-slate-500 max-w-2xl mx-auto">
          Follow these guided paths to explore India's history and culture based on fascinating themes.
        </p>
      </motion.header>

      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        variants={containerVariants}
      >
        {toursData.map((tour) => (
          <motion.div
            key={tour.id}
            variants={itemVariants}
            className="bg-white rounded-2xl shadow-lg overflow-hidden flex flex-col border border-slate-100 transform transition-all duration-300 hover:shadow-2xl hover:-translate-y-2"
          >
            <Link to={`/tours/${tour.id}`} className="flex flex-col flex-grow">
              <div className="relative">
                <img src={tour.thumbnail} alt={tour.title} className="w-full h-56 object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
              </div>
              <div className="p-6 flex flex-col flex-grow">
                <h2 className="text-2xl font-bold text-slate-800 mb-2">{tour.title}</h2>
                <p className="text-slate-500 text-sm mb-6 flex-grow line-clamp-3">
                  {tour.description}
                </p>
                <div className="mt-auto pt-4 border-t border-slate-200">
                  <div className="flex items-center justify-center gap-2 text-orange-600 font-bold text-lg">
                    <FaRoute />
                    <span>Start Tour</span>
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
}