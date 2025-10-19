// src/pages/BlogPost.jsx

import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
// NO MORE direct import of blogs.json
import { motion } from "framer-motion";
import { format } from "date-fns";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import SkeletonLoader from "../components/SkeletonLoader";

export default function BlogPost() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [allPosts, setAllPosts] = useState([]); // For next/previous links
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    // Fetch both the single post and the list of all posts
    Promise.all([
      fetch(`/api/blogs/${id}`),
      fetch('/api/blogs')
    ])
    .then(([postRes, allPostsRes]) => {
      if (!postRes.ok) throw new Error('Post not found');
      return Promise.all([postRes.json(), allPostsRes.json()]);
    })
    .then(([postData, allPostsData]) => {
      setPost(postData);
      setAllPosts(allPostsData);
      setLoading(false);
    })
    .catch(err => {
      console.error("Failed to fetch post data:", err);
      setLoading(false);
    });
  }, [id]);

  // Logic to find next and previous post
  const postIndex = allPosts.findIndex((p) => p._id === id);
  const previousPost = postIndex > 0 ? allPosts[postIndex - 1] : null;
  const nextPost = postIndex < allPosts.length - 1 ? allPosts[postIndex + 1] : null;

  if (loading) {
    return <SkeletonLoader type="page" />;
  }

  if (!post) {
    return (
      <div className="text-center p-12">
        <h2 className="text-2xl font-semibold text-slate-600 mb-4">Post not found.</h2>
        <Link to="/blog" className="text-orange-600 hover:underline font-bold flex items-center justify-center gap-2">
          <FaArrowLeft /> Back to All Posts
        </Link>
      </div>
    );
  }

  return (
    <motion.div
      className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <article>
        <header className="mb-8 text-center">
            <h1 className="text-4xl md:text-5xl font-extrabold text-slate-800 leading-tight mb-4">{post.title}</h1>
            <p className="text-slate-500 text-md">
                By {post.author} • {format(new Date(post.date), 'MMMM d, yyyy')}
            </p>
        </header>

        <img
          src={post.image}
          alt={post.title}
          className="w-full h-64 md:h-96 object-cover rounded-2xl shadow-2xl mb-12 border-4 border-white"
        />
        
        <div className="prose prose-lg lg:prose-xl max-w-full mx-auto text-slate-700 prose-headings:text-slate-800 prose-a:text-orange-600 hover:prose-a:text-orange-700">
          <p className="lead text-xl font-semibold">{post.excerpt}</p>
          {post.content.split('\n').map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>

        <nav className="mt-16 pt-8 border-t border-slate-200 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
                {previousPost && (
                    <Link to={`/blog/${previousPost._id}`} className="block p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow text-left">
                        <p className="text-sm text-slate-500 flex items-center gap-2"><FaArrowLeft /> Previous Post</p>
                        <p className="mt-2 font-bold text-slate-800">{previousPost.title}</p>
                    </Link>
                )}
            </div>
            <div className="md:text-right">
                {nextPost && (
                    <Link to={`/blog/${nextPost._id}`} className="block p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow text-right">
                        <p className="text-sm text-slate-500 flex items-center justify-end gap-2">Next Post <FaArrowRight /></p>
                        <p className="mt-2 font-bold text-slate-800">{nextPost.title}</p>
                    </Link>
                )}
            </div>
        </nav>
      </article>
    </motion.div>
  );
}