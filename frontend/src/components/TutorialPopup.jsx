// src/components/TutorialPopup.jsx
import React from 'react';
import { FaTimes, FaInfoCircle } from 'react-icons/fa'; // Added FaInfoCircle

const TutorialPopup = ({ videoUrl, onClose }) => {
  return (
    <div
      className="bg-white rounded-2xl shadow-xl max-w-6xl w-full p-4 sm:p-6 relative"
    >
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-3">
          <h2 className="text-2xl font-bold text-slate-800">Quick Tour of IndiVerse</h2>
          
          {/* --- START: Tooltip added here --- */}
          <div className="relative group flex items-center">
            <FaInfoCircle className="text-slate-400 cursor-pointer" />
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max px-3 py-1.5 bg-slate-700 text-white text-xs rounded-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-opacity duration-300 pointer-events-none">
              Press 'F' for full-screen, 'ESC' to exit.
              <svg className="absolute text-slate-700 h-2 w-full left-0 top-full" x="0px" y="0px" viewBox="0 0 255 255">
                <polygon className="fill-current" points="0,0 127.5,127.5 255,0"/>
              </svg>
            </div>
          </div>
          {/* --- END: Tooltip --- */}
        </div>

        <button
          onClick={onClose}
          className="text-slate-400 hover:text-orange-500 transition-colors p-2 rounded-full"
          aria-label="Close tutorial"
        >
          <FaTimes size={24} />
        </button>
      </div>

      <div className="w-full aspect-video rounded-xl overflow-hidden">
        <iframe
          src={videoUrl}
          title="IndiVerse Project Tutorial"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
          allowFullScreen
          className="w-full h-full"
        ></iframe>
      </div>
    </div>
  );
};

export default TutorialPopup;