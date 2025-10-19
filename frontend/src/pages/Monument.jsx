// src/pages/Monument.jsx
import React, { useState, useEffect } from 'react';
import { useParams, Link } from "react-router-dom";
import FactList from "../components/FactList.jsx";
import SkeletonLoader from '../components/SkeletonLoader.jsx';
import { motion } from 'framer-motion';
export default function Monument() {
  const { id } = useParams();
  const [monument, setMonument] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    // Fetch the single monument by its string ID from our new API
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
        console.error("Failed to fetch monument:", err);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <SkeletonLoader type="page" />;
  if (!monument) return <div className="p-6 text-center text-slate-600">❌ Not found</div>;

  const m = monument; // Use 'm' for brevity to match original structure

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <motion.img
        src={m.thumbnail}
        alt={m.name}
        className="w-full h-96 object-cover rounded-2xl shadow-2xl"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <h1 className="mt-6 text-5xl font-extrabold text-slate-800">{m.name}</h1>
        <p className="text-slate-500 mt-2 mb-6">
          {m.location} • {m.year_built}
        </p>
        <FactList facts={m.facts} />
        <div className="mt-8 flex flex-wrap gap-4 border-t pt-6">
          <Link to="/heritage" className="px-5 py-2 bg-slate-200 text-slate-800 rounded-lg hover:bg-slate-300 font-semibold">
            ← Back to Heritage Sites
          </Link>
          {(m.hasModel || m.embedUrl) && (
            <Link to={`/ar/${m.id}`} className="px-5 py-2 bg-green-600 text-white rounded-lg shadow hover:bg-green-700 font-semibold">
              View in 3D/AR
            </Link>
          )}
          <Link to={`/quiz/${m.id}`} className="px-5 py-2 bg-orange-500 text-white rounded-lg shadow hover:bg-orange-600 font-semibold">
            Take Quiz
          </Link>
        </div>
      </motion.div>
    </div>
  );
}