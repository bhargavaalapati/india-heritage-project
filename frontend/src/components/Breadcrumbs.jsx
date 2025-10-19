// src/components/Breadcrumbs.jsx

import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaHome, FaChevronRight } from 'react-icons/fa';

// Import all our data sources for name lookups
import heritageData from '../data/heritageData.json';
import blogsData from '../data/blogs.json';
import statesData from '../data/statesData.json';
import toursData from '../data/toursData.json';

// --- NEW: A map for clean, static path names ---
const pathSegmentNames = {
  heritage: 'Heritage Sites',
  culture: 'Indian Culture',
  blog: 'Blog',
  community: 'Community',
  contact: 'Contact Us',
  quizzes: 'Knowledge Center',
  tours: 'Learning Tours',
};

const Breadcrumbs = () => {
  const location = useLocation();

  if (location.pathname === '/') {
    return null;
  }

  const pathSegments = location.pathname.split('/').filter(Boolean);
  let currentPath = '';

  return (
    <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3" aria-label="Breadcrumb">
      <ol className="flex items-center space-x-2 text-sm text-slate-500 flex-wrap">
        <li>
          <Link to="/" className="hover:text-orange-500 transition-colors flex items-center gap-2">
            <FaHome />
            Home
          </Link>
        </li>

        {pathSegments.map((segment, index) => {
          currentPath += `/${segment}`;
          const isLast = index === pathSegments.length - 1;

          // --- REFACTORED LOGIC: Simpler and more powerful ---
          let displayName = pathSegmentNames[segment] || segment; // Default to the mapped name or the segment itself
          const prevSegment = pathSegments[index - 1];

          // Handle dynamic segments (like IDs)
          if (prevSegment) {
            if (['site', 'ar', 'quiz'].includes(prevSegment)) {
              const monument = heritageData.find(item => item.id === segment);
              displayName = monument ? (prevSegment === 'quiz' ? `${monument.name} Quiz` : monument.name) : segment;
            }
            if (prevSegment === 'blog') {
              const blog = blogsData.find(item => item.id === Number(segment));
              displayName = blog ? blog.title : segment;
            }
            if (prevSegment === 'state') {
              const state = statesData[segment];
              displayName = state ? state.name : segment;
            }
            if (prevSegment === 'tours') {
                const tour = toursData.find(t => t.id === segment);
                displayName = tour ? tour.title : segment;
            }
          }
          
          return (
            <li key={currentPath} className="flex items-center">
              <FaChevronRight className="mx-2 text-slate-300" size={12} />
              {isLast ? (
                <span className="font-semibold text-slate-700">{displayName}</span>
              ) : (
                <Link to={currentPath} className="hover:text-orange-500 transition-colors">
                  {displayName}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;