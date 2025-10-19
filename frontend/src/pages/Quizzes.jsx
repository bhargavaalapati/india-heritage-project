// src/pages/Quizzes.jsx

import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaBrain, FaRocket } from 'react-icons/fa';
import heritageData from '../data/heritageData.json'; // Assuming this is the correct path

export default function Quizzes() {
  // We'll assume every monument in your heritage data has a corresponding quiz
  const quizzes = heritageData;

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
          Knowledge <span className="text-orange-500">Center</span>
        </h1>
        <p className="mt-4 text-lg text-slate-500 max-w-2xl mx-auto">
          Learn the fascinating facts, then test your knowledge with our interactive quizzes.
        </p>
      </motion.header>

      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        variants={containerVariants} // Use container variants here as well for staggering
      >
        {quizzes.map((quiz) => (
          <motion.div
            key={quiz.id}
            variants={itemVariants}
            className="bg-white rounded-2xl shadow-lg overflow-hidden flex flex-col border border-slate-100"
            whileHover={{ y: -5, scale: 1.02, shadow: "2xl" }}
          >
            <img src={quiz.thumbnail} alt={quiz.name} className="w-full h-48 object-cover" />
            <div className="p-6 flex flex-col flex-grow">
              <h2 className="text-2xl font-bold text-slate-800 mb-2">{quiz.name} Quiz</h2>
              <p className="text-slate-500 text-sm mb-6 flex-grow">
                How much do you know about the {quiz.name}? Study up, then take the challenge!
              </p>
              <div className="grid grid-cols-2 gap-4 mt-auto">
                {/* Study Button */}
                <Link
                  to={`/site/${quiz.id}`}
                  className="flex items-center justify-center gap-2 py-2 px-4 bg-slate-200 text-slate-700 font-semibold rounded-lg hover:bg-slate-300 transition-colors"
                >
                  <FaBrain />
                  Study First
                </Link>
                {/* Quiz Button */}
                <Link
                  to={`/quiz/${quiz.id}`}
                  className="flex items-center justify-center gap-2 py-2 px-4 bg-orange-500 text-white font-semibold rounded-lg hover:bg-orange-600 transition-colors"
                >
                  <FaRocket />
                  Start Quiz
                </Link>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
}