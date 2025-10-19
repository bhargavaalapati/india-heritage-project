// src/pages/Heritage.jsx
import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import SkeletonLoader from '../components/SkeletonLoader';
import { FaSearch } from "react-icons/fa";

const ITEMS_PER_PAGE = 8;

export default function Heritage() {
    const [allSites, setAllSites] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [showAROnly, setShowAROnly] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        fetch('/api/heritage')
            .then(res => res.json())
            .then(data => {
                setAllSites(data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Failed to fetch heritage sites:", err);
                setLoading(false);
            });
    }, []);

    const filteredData = useMemo(() => {
        return allSites.filter((m) => {
            const matchesSearch = m.name.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesARFilter = showAROnly ? (m.hasModel || m.embedUrl) : true;
            return matchesSearch && matchesARFilter;
        });
    }, [allSites, searchTerm, showAROnly]);

    const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);
    const currentItems = filteredData.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

    if (loading) return <SkeletonLoader type="page" />;

    return (
        <motion.div 
            className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
            <div className="flex flex-col sm:flex-row items-center justify-between mb-8 gap-4">
                <h1 className="text-4xl font-bold text-center text-slate-800">🏛️ Heritage Sites</h1>
                <div className="relative w-full sm:w-auto flex-grow">
                    <input
                        type="text"
                        placeholder="Search monuments..."
                        value={searchTerm}
                        onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                        className="w-full pl-10 pr-4 py-2 rounded-full border border-slate-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                    <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                </div>
                <div className="flex items-center space-x-2">
                    <input
                        type="checkbox"
                        id="ar-filter"
                        checked={showAROnly}
                        onChange={() => { setShowAROnly(!showAROnly); setCurrentPage(1); }}
                        className="h-5 w-5 text-orange-600 border-slate-300 rounded focus:ring-orange-500"
                    />
                    <label htmlFor="ar-filter" className="text-slate-700 font-medium">Show 3D/AR Models Only</label>
                </div>
            </div>

            {currentItems.length === 0 ? (
                <p className="text-center text-slate-500 mt-10">No monuments found.</p>
            ) : (
                <>
                    <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                        {currentItems.map((m) => (
                            <Link to={`/site/${m.id}`} key={m.id}>
                                <motion.div 
                                    className="bg-white rounded-2xl shadow-lg overflow-hidden h-full flex flex-col"
                                    whileHover={{ y: -5, scale: 1.02, shadow: "xl" }}
                                >
                                    <img src={m.thumbnail} alt={m.name} className="w-full h-48 object-cover" loading="lazy"/>
                                    <div className="p-4 flex flex-col flex-grow">
                                        <h3 className="text-xl font-semibold text-slate-900">{m.name}</h3>
                                        <p className="text-slate-600 text-sm mt-1">{m.location}</p>
                                    </div>
                                </motion.div>
                            </Link>
                        ))}
                    </div>
                    {totalPages > 1 && (
                        <div className="flex justify-center items-center gap-4 mt-12">
                            {/* Pagination Controls remain the same */}
                        </div>
                    )}
                </>
            )}
        </motion.div>
    );
}