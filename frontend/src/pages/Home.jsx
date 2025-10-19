// src/pages/Home.jsx

import React, { useState, useEffect } from "react";
import IndiaMap from "../components/IndiaMap.jsx";
import Heritage from "./Heritage.jsx";
import Culture from "./Culture.jsx";
import TutorialPopup from "../components/TutorialPopup.jsx";
import { useAppContext } from "../context/useAppContext.js";
import { fetchWeather } from '../utils/weather.js';
import { motion, AnimatePresence } from "framer-motion";
import { FaArrowDown } from "react-icons/fa";
import useAnimateOnce from "../hooks/useAnimateOnce.js"; // <-- 1. Import the hook

const heroImageUrl = "https://images.unsplash.com/photo-1548013146-72479768bada?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1171&q=80";

const Home = () => {
  const {stateCapitals, API_KEY } = useAppContext();
  const [showPopup, setShowPopup] = useState(false);
  const [hoveredStateName, setHoveredStateName] = useState(null);
  const [hoveredStateWeather, setHoveredStateWeather] = useState(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // --- 2. Call the hook with a unique key ---
  const shouldAnimate = useAnimateOnce('homePage');

  const TUTORIAL_URL = "https://youtu.be/XmH6pIio0DQ?si=O3C9oNmVSD1i9CJf";

  useEffect(() => {
    const hasSeenTutorial = sessionStorage.getItem('seenTutorial');
    if (!hasSeenTutorial) {
      setShowPopup(true);
    }
  }, []);

  const handleClosePopup = () => {
    sessionStorage.setItem('seenTutorial', 'true');
    setShowPopup(false);
  };

  const handleStateHover = async (stateId, stateName) => {
    setHoveredStateName(stateName);
    const cityName = stateCapitals[stateId];
    if (cityName) {
      const weatherData = await fetchWeather(cityName, API_KEY);
      setHoveredStateWeather(weatherData);
    }
  };

  const handleStateLeave = () => {
    setHoveredStateName(null);
    setHoveredStateWeather(null);
  };

  const handleMouseMove = (event) => {
    setMousePosition({ x: event.clientX, y: event.clientY });
  };

  const sectionVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  return (
    <div className="relative w-full min-h-screen bg-slate-50" onMouseMove={handleMouseMove}>

      <section className="h-screen w-full flex items-center justify-center relative bg-cover bg-center" style={{ backgroundImage: `url(${heroImageUrl})` }}>
        <div className="absolute inset-0 bg-black/50"></div>
        <motion.div
          className="relative text-center text-white p-4"
          // --- 3. Apply the hook's logic ---
          initial={shouldAnimate ? { opacity: 0, y: -30 } : { opacity: 1, y: 0 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight">Discover the Soul of India</h1>
          <p className="mt-4 text-xl md:text-2xl max-w-3xl text-slate-200">
            An interactive journey through the magnificent heritage and vibrant culture of a timeless land.
          </p>
          <motion.a
            href="#explore"
            className="mt-8 inline-block bg-orange-500 text-white font-bold py-3 px-8 rounded-full text-lg uppercase tracking-wider hover:bg-orange-600 transition-colors duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Start Exploring
          </motion.a>
        </motion.div>
        <motion.div
            className="absolute bottom-10 text-white text-2xl"
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        >
            <FaArrowDown />
        </motion.div>
      </section>

      {/* --- Apply the hook's logic to the whileInView sections too --- */}
      <motion.section
        id="explore"
        className="w-full py-16 sm:py-24"
        variants={sectionVariants}
        initial={shouldAnimate ? "hidden" : "visible"}
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white p-8 sm:p-12 rounded-3xl shadow-2xl">
                <div className="text-center mb-8">
                    <h2 className="text-4xl md:text-5xl font-extrabold text-slate-800">Explore the Map</h2>
                    <p className="mt-3 text-lg text-slate-500 max-w-2xl mx-auto">Click on a state to discover its wonders, or hover to check the current weather in its capital.</p>
                </div>
                <div className="relative w-full aspect-video">
                    <IndiaMap
                      onStateHover={handleStateHover}
                      onStateLeave={handleStateLeave}
                      hoveredStateName={hoveredStateName}
                      hoveredStateWeather={hoveredStateWeather}
                      mousePosition={mousePosition}
                    />
                </div>
            </div>
        </div>
      </motion.section>

      <motion.section
        className="w-full py-16 sm:py-24 bg-slate-100"
        variants={sectionVariants}
        initial={shouldAnimate ? "hidden" : "visible"}
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl md:text-5xl font-extrabold mb-10 text-center text-slate-800">
            Timeless Heritage Sites
          </h2>
          <Heritage />
        </div>
      </motion.section>

      <motion.section
        className="w-full py-16 sm:py-24"
        variants={sectionVariants}
        initial={shouldAnimate ? "hidden" : "visible"}
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl md:text-5xl font-extrabold mb-10 text-center text-slate-800">
            Vibrant Indian Culture
          </h2>
          <Culture />
        </div>
      </motion.section>

      <AnimatePresence>
        {showPopup && (
          <motion.div
            className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              <TutorialPopup videoUrl={TUTORIAL_URL} onClose={handleClosePopup} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Home;