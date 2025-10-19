// src/pages/About.jsx
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import SkeletonLoader from "../components/SkeletonLoader";
// --- Import the new CoreFeaturesSection component ---
import CoreFeaturesSection from "../components/CoreFeaturesSection.jsx";
// Re-import icons as they might be used for the features data
import { FaLandmark, FaCubes, FaBookOpen } from "react-icons/fa"; 

const heritageImageUrl = "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1171&q=80";

const About = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const img = new Image();
    img.src = heritageImageUrl;
    img.onload = () => {
      const t = setTimeout(() => setLoading(false), 500);
      return () => clearTimeout(t);
    };
    img.onerror = () => {
       const t = setTimeout(() => setLoading(false), 500);
       return () => clearTimeout(t);
    }
  }, []);

  // Animation variants for Framer Motion for the Hero section
  const heroContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2, duration: 0.5 },
    },
  };

  const heroItemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100 },
    },
  };
  
  // Define features data to pass to CoreFeaturesSection
  const featuresData = [
    {
      icon: <FaLandmark className="text-4xl" />, // Icons can be customized via props
      title: "Celebrating Heritage",
      description: "Our project celebrates the rich cultural heritage of India 🌏.",
    },
    {
      icon: <FaCubes className="text-4xl" />,
      title: "Immersive AR Technology",
      description: "We blend technology with history, bringing monuments alive through AR.",
    },
    {
      icon: <FaBookOpen className="text-4xl" />,
      title: "Interactive Learning",
      description: "Engage with history through our interactive quizzes and detailed stories.",
    },
  ];

  if (loading) return <SkeletonLoader type="page" />;

  return (
    <motion.div initial="hidden" animate="visible" variants={heroContainerVariants}>
      {/* --- Hero Section --- */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div variants={heroItemVariants}>
            <h1 className="text-5xl md:text-6xl font-extrabold text-slate-800 leading-tight mb-4">
              About <span className="text-orange-500">Our Mission</span>
            </h1>
            <p className="text-lg text-slate-600 leading-relaxed">
              Our project celebrates the rich cultural heritage of India 🌏. 
              We blend technology with history, bringing monuments alive through AR 
              and interactive learning.
            </p>
          </motion.div>
          <motion.div variants={heroItemVariants} className="w-full h-80 lg:h-96">
            <img
              src={heritageImageUrl}
              alt="Taj Mahal"
              className="w-full h-full object-cover rounded-2xl shadow-2xl transform hover:scale-105 transition-transform duration-300"
            />
          </motion.div>
        </div>
      </section>
      
      {/* --- Replaced inline features with the new component --- */}
      <CoreFeaturesSection 
        title="What We Stand For"
        description="Our platform is built on pillars of cultural preservation, technological innovation, and engaging education."
        features={featuresData}
        animationDelay={0.5} // Start animating this section half a second after the component mounts
      />
      {/* --- You can add more sections here if needed --- */}

    </motion.div>
  );
};

export default About;