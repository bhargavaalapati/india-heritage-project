// src/components/Footer.jsx

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaArrowUp, FaTwitter, FaGithub, FaInstagram } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

// --- This is a URL for a subtle, seamless background pattern ---
const footerBgPattern = "url('https://www.transparenttextures.com/patterns/az-subtle.png')";

const Footer = () => {
  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => {
    if (window.scrollY > 300) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  useEffect(() => {
    window.addEventListener('scroll', toggleVisibility);
    return () => {
      window.removeEventListener('scroll', toggleVisibility);
    };
  }, []);

  // --- Updated links to include all our new pages ---
  const exploreLinks = [
    { name: 'Heritage Sites', path: '/heritage' },
    { name: 'Indian Culture', path: '/culture' },
    { name: 'Blog', path: '/blog' },
    { name: 'Community', path: '/community' },
  ];
  
  const engageLinks = [
    { name: 'Explore the Map', path: '/' },
    { name: 'Knowledge Center', path: '/quizzes' },
    { name: 'Learning Tours', path: '/tours' },
  ];

  return (
    // --- Added the subtle background pattern here ---
    <footer 
        className="bg-slate-800 text-slate-300 pt-16 pb-6 relative" 
        style={{ backgroundImage: footerBgPattern }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 mb-8"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
        >
          {/* Column 1: Branding (takes more space on larger screens) */}
          <div className="col-span-2 lg:col-span-2">
            <h2 className="text-2xl font-bold text-white mb-2">IndiVerse</h2>
            <p className="text-sm text-slate-400 max-w-xs">
              An interactive exploration of India's timeless culture, history, and monuments. Built with passion.
            </p>
             <div className="flex space-x-4 mt-6">
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-orange-400 transition-transform hover:scale-110"><FaTwitter size={24} /></a>
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-orange-400 transition-transform hover:scale-110"><FaGithub size={24} /></a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-orange-400 transition-transform hover:scale-110"><FaInstagram size={24} /></a>
            </div>
          </div>

          {/* Column 2: Explore Links */}
          <div className="col-span-1">
            <h3 className="text-lg font-semibold text-white mb-4 uppercase tracking-wider">Explore</h3>
            <ul className="space-y-3">
              {exploreLinks.map((link) => (
                <li key={link.path}>
                  <Link to={link.path} className="hover:text-orange-400 transition-colors hover:pl-1">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Engage Links */}
           <div className="col-span-1">
            <h3 className="text-lg font-semibold text-white mb-4 uppercase tracking-wider">Engage</h3>
             <ul className="space-y-3">
                {engageLinks.map((link) => (
                    <li key={link.path}>
                    <Link to={link.path} className="hover:text-orange-400 transition-colors hover:pl-1">
                        {link.name}
                    </Link>
                    </li>
                ))}
             </ul>
          </div>
          
          {/* Column 4: About Links */}
           <div className="col-span-1">
            <h3 className="text-lg font-semibold text-white mb-4 uppercase tracking-wider">About</h3>
             <ul className="space-y-3">
                <li><Link to="/about" className="hover:text-orange-400 transition-colors hover:pl-1">About Us</Link></li>
                <li><Link to="/contact" className="hover:text-orange-400 transition-colors hover:pl-1">Contact</Link></li>
                <li><Link to="/goal" className="hover:text-orange-400 transition-colors hover:pl-1">Our Goal</Link></li>
             </ul>
          </div>
        </motion.div>

        <div className="border-t border-slate-700 pt-6 text-center text-sm text-slate-400">
          <p>&copy; {new Date().getFullYear()} IndiVerse Project. All Rights Reserved.</p>
        </div>
      </div>

      <AnimatePresence>
        {isVisible && (
          <motion.button
            onClick={scrollToTop}
            className="fixed bottom-6 right-6 bg-orange-500 text-white rounded-full p-3 shadow-lg hover:bg-orange-600 transition-colors z-50"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            aria-label="Go to top"
          >
            <FaArrowUp size={20} />
          </motion.button>
        )}
      </AnimatePresence>
    </footer>
  );
};

export default Footer;