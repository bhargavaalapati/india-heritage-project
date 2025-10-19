// src/components/CoreFeaturesSection.jsx
import React from "react";
import { motion } from "framer-motion";
import { FaLandmark, FaCubes, FaBookOpen } from "react-icons/fa"; // Example icons

const CoreFeaturesSection = ({
  title = "Our Core Focus", // Default title
  description, // Optional description
  features = [], // Array of feature objects
  animationDelay = 0, // Delay before section starts animating
}) => {
  // Animation variants for Framer Motion
  const containerVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        delay: animationDelay,
        staggerChildren: 0.1,
        when: "beforeChildren", // Animate container before children
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 10,
      },
    },
  };

  if (!features || features.length === 0) {
    return null; // Don't render if no features are provided
  }

  return (
    <motion.section
      className="py-16 bg-gradient-to-br from-white to-slate-50"
      variants={containerVariants}
      initial="hidden"
      whileInView="visible" // Animate when it comes into view
      viewport={{ once: true, amount: 0.4 }} // Trigger once when 40% of it is visible
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div variants={itemVariants} className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-extrabold text-slate-800 mb-4 leading-tight">
            {title}
          </h2>
          {description && (
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              {description}
            </p>
          )}
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="bg-white p-8 rounded-2xl shadow-xl border border-slate-100 text-center flex flex-col items-center hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 transform perspective-1000"
              variants={itemVariants}
              whileHover={{ rotateY: 5, rotateX: 5, scale: 1.02 }} // Subtle 3D hover effect
            >
              <div className="mb-6 text-orange-500">{feature.icon}</div>
              <h3 className="text-2xl font-bold text-slate-700 mb-3">
                {feature.title}
              </h3>
              <p className="text-slate-500 leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
};

export default CoreFeaturesSection;