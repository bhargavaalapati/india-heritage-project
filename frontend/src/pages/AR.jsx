// src/pages/AR.jsx

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from "react-router-dom";
// No more static import of heritageData
import {  AnimatePresence } from 'framer-motion';
import { QRCodeSVG } from 'qrcode.react';
import { FaQrcode, FaTimes } from 'react-icons/fa';
import SkeletonLoader from '../components/SkeletonLoader'; // For loading state

const QRCodeModal = () => {
  // ... (This component remains the same)
  return (
    <AnimatePresence>
      <motion.div /* ... */ >
        {/* ... */}
      </motion.div>
    </AnimatePresence>
  );
};

export default function AR() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // --- NEW: State for fetching monument data ---
  const [monument, setMonument] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);

  useEffect(() => {
    setLoading(true);
    // Fetch the single monument data from our backend API
    fetch(`/api/heritage/${id}`)
      .then(res => {
        if (!res.ok) throw new Error('Monument not found');
        return res.json();
      })
      .then(data => {
        setMonument(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch AR monument data:", err);
        setLoading(false);
      });
  }, [id]);
  
  const getQrCodeUrl = () => {
    if (!monument.hasModel && monument.embedUrl) {
      return monument.embedUrl;
    }
    return window.location.href;
  };

  // --- NEW: Loading and Not Found states ---
  if (loading) {
    return <SkeletonLoader type="page" />;
  }
  
  if (!monument || (!monument.hasModel && !monument.embedUrl)) {
    return (
      <div className="p-6 text-center text-slate-600">
        <h1 className="text-3xl font-bold mb-4">❌ 3D Model Not Available</h1>
        <p className="mb-4">The 3D model for this monument is not yet available.</p>
        <button
          onClick={() => navigate(-1)}
          className="bg-orange-500 text-white px-6 py-2 rounded-lg font-semibold hover:bg-orange-600 transition"
        >
          ← Go Back
        </button>
      </div>
    );
  }

  const modelViewerAvailable = monument.hasModel && monument.model;
  const sketchfabAvailable = !monument.hasModel && monument.embedUrl;

  return (
    <div className="p-4 sm:p-6 max-w-5xl mx-auto">
      <Link
        to={`/site/${monument.id}`}
        className="inline-block mb-4 text-orange-600 hover:underline font-semibold"
      >
        ← Back to {monument.name}
      </Link>

      <div className="w-full h-[75vh] rounded-xl shadow-lg bg-gradient-to-br from-slate-100 to-slate-200 relative">
        {modelViewerAvailable && (
          <model-viewer
            src={monument.model}
            alt={monument.name}
            ar
            ar-modes="webxr scene-viewer quick-look"
            camera-controls
            auto-rotate
            exposure="1.1"
            shadow-intensity="1"
            poster="/images/loading-spinner.gif"
            style={{ width: '100%', height: '100%', borderRadius: '0.75rem' }}
            camera-target="auto"
            auto-bounds="tight"
            environment-image="https://modelviewer.dev/shared-assets/environments/neutral.hdr"
            skybox-image="https://modelviewer.dev/shared-assets/environments/neutral.hdr"
          >
            <button
              slot="ar-button"
              id="ar-button"
              className="bg-orange-500 text-white px-6 py-3 rounded-full text-lg font-semibold absolute bottom-8 left-1/2 -translate-x-1/2 shadow-lg hover:bg-orange-600 transition"
            >
              ✨ View in AR
            </button>
          </model-viewer>
        )}

        {sketchfabAvailable && (
          <iframe
            title={monument.name}
            frameBorder="0"
            allowFullScreen
            mozallowfullscreen="true"
            webkitallowfullscreen="true"
            allow="autoplay; fullscreen; xr-spatial-tracking"
            src={monument.embedUrl}
            className="w-full h-full rounded-xl"
          ></iframe>
        )}
      </div>

      <div className="flex flex-col md:flex-row justify-between items-center mt-4">
        <p className="text-sm text-slate-500 text-center md:text-left">
          💡 Tip: On mobile, use the AR button inside the viewer to place the monument in your space.
        </p>
        
        <div className="hidden md:block mt-4 md:mt-0">
          <button
            onClick={() => setIsQrModalOpen(true)}
            className="bg-slate-800 text-white font-semibold px-5 py-2 rounded-lg flex items-center gap-2 hover:bg-slate-900 transition"
          >
            <FaQrcode /> View on Your Phone
          </button>
        </div>
      </div>
      
      {isQrModalOpen && (
        <QRCodeModal
          url={getQrCodeUrl()}
          onClose={() => setIsQrModalOpen(false)}
          isSketchfab={!monument.hasModel}
        />
      )}
    </div>
  );
}