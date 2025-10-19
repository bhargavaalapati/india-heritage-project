import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SkeletonLoader from "../components/SkeletonLoader";
import { FaPaperPlane, FaSpinner, FaCheckCircle, FaRss } from "react-icons/fa";
import toast from "react-hot-toast";
import { formatDistanceToNow } from "date-fns";

const Contact = () => {
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [errors, setErrors] = useState({});
  const [formStatus, setFormStatus] = useState("idle"); // idle, sending, success, error
  const [recentMessages, setRecentMessages] = useState([]); // NEW: recent messages

  // --- Fetch recent messages ---
  useEffect(() => {
    const fetchRecentMessages = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/messages/recent");
        const data = await response.json();
        setRecentMessages(data);
      } catch (error) {
        console.error("Could not fetch recent messages:", error);
      }
    };

    fetchRecentMessages();
    const t = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(t);
  }, []);

  // --- Input handling ---
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // --- Validation ---
  const validateForm = () => {
    let newErrors = {};
    if (!formData.name) newErrors.name = "Name is required";
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }
    if (!formData.message) newErrors.message = "Message is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // --- Form submission ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error("Please fill in all required fields correctly.");
      return;
    }

    setFormStatus("sending");

    try {
      const response = await fetch("http://localhost:5000/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Network response was not ok");

      await response.json();
      setFormStatus("success");
      toast.success("Message sent successfully!");
      setFormData({ name: "", email: "", message: "" });

      // Refresh recent messages
      const updated = await fetch("http://localhost:5000/api/messages/recent");
      setRecentMessages(await updated.json());

      setTimeout(() => setFormStatus("idle"), 3000);
    } catch (error) {
      console.error("Submission error:", error);
      setFormStatus("error");
      toast.error("Failed to send message. Please try again.");
      setTimeout(() => setFormStatus("idle"), 3000);
    }
  };

  // --- Framer Motion Variants ---
  const formVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15 } },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 100 } },
  };

  if (loading) return <SkeletonLoader type="page" />;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <motion.div initial="hidden" animate="visible" variants={itemVariants}>
        <h1 className="text-5xl font-extrabold text-center mb-4 text-slate-800">Contact Us</h1>
        <p className="text-lg text-center text-slate-500 mb-12">
          Have a question or want to collaborate? We'd love to hear from you.
        </p>
      </motion.div>

      <div className="flex flex-col md:flex-row gap-12 justify-center items-start">
        {/* --- Contact Form --- */}
        <motion.form
          onSubmit={handleSubmit}
          className="flex-1 space-y-6 max-w-lg mx-auto bg-white p-8 rounded-2xl shadow-lg border border-slate-100"
          variants={formVariants}
          initial="hidden"
          animate="visible"
          noValidate
        >
          <motion.div variants={itemVariants} className="relative">
            <label htmlFor="name" className="font-semibold text-slate-700">
              Your Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              placeholder="e.g., Ada Lovelace"
              value={formData.name}
              onChange={handleInputChange}
              className={`w-full p-3 mt-1 border rounded-lg transition-colors ${
                errors.name
                  ? "border-red-500"
                  : "border-slate-300 focus:border-orange-500"
              } focus:ring-2 focus:ring-orange-200 outline-none`}
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
          </motion.div>

          <motion.div variants={itemVariants} className="relative">
            <label htmlFor="email" className="font-semibold text-slate-700">
              Your Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="e.g., ada@example.com"
              value={formData.email}
              onChange={handleInputChange}
              className={`w-full p-3 mt-1 border rounded-lg transition-colors ${
                errors.email
                  ? "border-red-500"
                  : "border-slate-300 focus:border-orange-500"
              } focus:ring-2 focus:ring-orange-200 outline-none`}
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
          </motion.div>

          <motion.div variants={itemVariants} className="relative">
            <label htmlFor="message" className="font-semibold text-slate-700">
              Your Message
            </label>
            <textarea
              id="message"
              name="message"
              placeholder="Let us know how we can help..."
              value={formData.message}
              onChange={handleInputChange}
              rows="5"
              className={`w-full p-3 mt-1 border rounded-lg transition-colors ${
                errors.message
                  ? "border-red-500"
                  : "border-slate-300 focus:border-orange-500"
              } focus:ring-2 focus:ring-orange-200 outline-none`}
            />
            {errors.message && <p className="text-red-500 text-sm mt-1">{errors.message}</p>}
          </motion.div>

          <motion.div variants={itemVariants}>
            <button
              type="submit"
              disabled={formStatus === "sending"}
              className="w-full px-6 py-3 bg-orange-500 text-white font-bold rounded-lg hover:bg-orange-600 transition-all duration-300 flex items-center justify-center disabled:bg-slate-400"
            >
              <AnimatePresence mode="wait">
                {formStatus === "sending" && (
                  <motion.div
                    key="sending"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                  >
                    <FaSpinner className="animate-spin" />
                  </motion.div>
                )}
                {formStatus === "success" && (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                  >
                    <FaCheckCircle />
                  </motion.div>
                )}
                {formStatus === "idle" && (
                  <motion.span
                    key="idle"
                    className="flex items-center gap-2"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                  >
                    Send Message <FaPaperPlane />
                  </motion.span>
                )}
                {formStatus === "error" && (
                  <motion.span
                    key="retry"
                    className="flex items-center gap-2"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                  >
                    Try Again?
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          </motion.div>
        </motion.form>

        {/* --- Recent Messages Section --- */}
        <motion.div
          className="w-full md:w-80 mt-8 md:mt-0"
          variants={itemVariants}
          initial="hidden"
          animate="visible"
        >
          <h3 className="font-bold text-slate-700 text-lg mb-4 flex items-center gap-2">
            <FaRss className="text-orange-500" />
            Recent Activity
          </h3>
          <div className="space-y-3">
            <AnimatePresence>
              {recentMessages.map((msg, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ delay: index * 0.1 }}
                  className="text-sm p-3 bg-slate-50 border border-slate-200 rounded-lg"
                >
                  <span className="font-semibold text-slate-800">{msg.name}</span>
                  <span className="text-slate-500"> sent a message </span>
                  <span className="text-slate-500 font-medium">
                    {msg.timestamp
                      ? formatDistanceToNow(new Date(msg.timestamp), { addSuffix: true })
                      : "just now"}
                  </span>
                </motion.div>
              ))}
            </AnimatePresence>
            {recentMessages.length === 0 && (
              <p className="text-sm text-slate-400">No recent messages.</p>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Contact;
