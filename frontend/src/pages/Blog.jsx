// src/pages/Blog.jsx

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
// NO MORE direct import of blogs.json
import { FaSearch, FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";
import useAnimateOnce from "../hooks/useAnimateOnce.js";
import SkeletonLoader from "../components/SkeletonLoader.jsx";

const ITEMS_PER_PAGE = 6;

export default function Blog() {
  const [allPosts, setAllPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const shouldAnimate = useAnimateOnce('blogPage');

  useEffect(() => {
    setLoading(true);
    // Fetch data from our new backend API when the component loads
    fetch('/api/blogs')
      .then(res => res.json())
      .then(data => {
        setAllPosts(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch blogs:", err);
        setLoading(false);
      });
  }, []);
  
  // All the logic below now uses the 'allPosts' state variable
  const featuredPost = allPosts[0];
  const otherPosts = allPosts.slice(1);

  const filteredPosts = (searchTerm ? allPosts : otherPosts).filter(
    (post) =>
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.author.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredPosts.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentPosts = filteredPosts.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.07 } },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 120 } },
  };

  if (loading) {
    return <SkeletonLoader type="page" />;
  }

  if (allPosts.length === 0) {
      return <div className="text-center p-12 text-slate-500">Could not load any blog posts.</div>;
  }

  return (
    <motion.div 
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12"
      variants={containerVariants}
      initial={shouldAnimate ? "hidden" : "visible"}
      animate="visible"
    >
      <motion.header variants={itemVariants} className="text-center mb-12">
        <h1 className="text-5xl md:text-6xl font-extrabold text-slate-800 leading-tight">
          Tales from Our <span className="text-orange-500">Heritage</span>
        </h1>
        <p className="mt-4 text-lg text-slate-500 max-w-2xl mx-auto">
          Insights, stories, and discoveries from the heart of India's culture.
        </p>
        <div className="relative w-full max-w-lg mx-auto mt-8">
          <input
            type="text"
            placeholder="Search blog posts..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-12 pr-4 py-3 rounded-full border border-slate-300 focus:outline-none focus:ring-2 focus:ring-orange-400"
          />
          <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
        </div>
      </motion.header>

      {!searchTerm && (
        <motion.div variants={itemVariants} className="mb-16">
          <h2 className="text-3xl font-bold text-slate-800 mb-6 border-b-2 border-orange-500 pb-2 inline-block">
            Featured Post
          </h2>
          <Link to={`/blog/${featuredPost._id}`}>
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center bg-white rounded-2xl shadow-xl overflow-hidden p-6 border border-slate-100"
              whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
            >
              <img src={featuredPost.image} alt={featuredPost.title} className="w-full h-80 object-cover rounded-lg" />
              <div className="p-4">
                <h3 className="text-3xl font-semibold mb-3 text-slate-800">{featuredPost.title}</h3>
                <p className="text-slate-600 mb-4 line-clamp-3">{featuredPost.excerpt}</p>
                <p className="text-sm text-slate-500 mb-4">
                  By {featuredPost.author} • {format(new Date(featuredPost.date), 'MMMM d, yyyy')}
                </p>
                <div className="text-orange-600 hover:underline font-bold flex items-center gap-2">
                  Read More <FaArrowRight />
                </div>
              </div>
            </motion.div>
          </Link>
        </motion.div>
      )}

      <AnimatePresence mode="wait">
        <motion.div
          key={currentPage + searchTerm}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {currentPosts.length === 0 ? (
            <p className="text-center text-slate-500 mt-16 text-xl">No posts found for your search.</p>
          ) : (
            <motion.div variants={containerVariants} initial="hidden" animate="visible" className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {currentPosts.map((post) => (
                <Link to={`/blog/${post._id}`} key={post._id}>
                  <motion.div
                    className="bg-white rounded-2xl shadow-lg overflow-hidden h-full flex flex-col border border-slate-100"
                    whileHover={{ y: -5, scale: 1.02, shadow: "2xl" }}
                    variants={itemVariants}
                  >
                    <img src={post.image} alt={post.title} className="w-full h-48 object-cover" loading="lazy" />
                    <div className="p-6 flex flex-col flex-grow">
                      <h2 className="text-xl font-bold mb-2 text-slate-800">{post.title}</h2>
                      <p className="text-slate-600 text-sm mb-4 line-clamp-3 flex-grow">{post.excerpt}</p>
                      <p className="text-xs text-slate-500 mb-4">
                        By {post.author} • {format(new Date(post.date), 'MMMM d, yyyy')}
                      </p>
                      <div className="text-orange-600 hover:underline font-semibold mt-auto">
                        Read More →
                      </div>
                    </div>
                  </motion.div>
                </Link>
              ))}
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>

      {totalPages > 1 && (
        <motion.div variants={itemVariants} className="flex justify-center items-center gap-4 mt-12">
          {/* Pagination buttons remain the same */}
        </motion.div>
      )}
    </motion.div>
  );
}