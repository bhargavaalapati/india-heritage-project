// src/App.jsx

import { Routes, Route } from "react-router-dom";
import Layout from "./layout/Layout";
import Home from "./pages/Home";
import Heritage from "./pages/Heritage";
import Culture from "./pages/Culture";
import Monument from "./pages/Monument";
import AR from "./pages/AR";
import QuizPage from "./pages/QuizPage";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import Community from "./pages/Community";
import StatePage from "./pages/StatePage";
import Quizzes from "./pages/Quizzes"; 
import Tours from "./pages/Tours";
import TourPage from "./pages/TourPage"; 
import { Toaster } from "react-hot-toast";
import Register from './pages/Register'; 
import Login from './pages/Login';
import ProtectedRoute from "./components/ProtectedRoute";

function NotFound() {
  return (
    <div className="p-6 text-center text-gray-600">404 — Page not found</div>
  );
}

export default function App() {
  return (
    <>
      <Routes>
        <Route element={<Layout />}>
          {/* --- PUBLIC ROUTES --- */}
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:id" element={<BlogPost />} />

          {/* --- PROTECTED ROUTES --- */}
          <Route element={<ProtectedRoute />}>
            <Route 
              path="/community" 
              element={
                  <Community />
              } 
            />
            <Route path="/heritage" element={<Heritage />} />
            <Route path="/culture" element={<Culture />} />
            <Route path="/site/:id" element={<Monument />} />
            <Route path="/ar/:id" element={<AR />} />
            <Route path="/quizzes" element={<Quizzes />} />
            <Route path="/tours" element={<Tours />} />
            <Route path="/tours/:tourId" element={<TourPage />} />
            <Route path="/quiz/:monumentId" element={<QuizPage />} />
            <Route path="/state/:id" element={<StatePage />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
      <Toaster position="top-right" />
    </>
  );
}