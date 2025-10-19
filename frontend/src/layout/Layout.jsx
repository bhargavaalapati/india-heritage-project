// src/layout/Layout.jsx

import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar'; // Assuming you have a Navbar
import Footer from '../components/Footer';
import Breadcrumbs from '../components/Breadcrumbs';
import Chatbot from '../components/Chatbot';

export default function Layout() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      {/* --- FIX: Added padding-top (pt-20) to the main element --- */}
      {/* This pushes the content down below your fixed navbar. Adjust pt-20 if needed. */}
      <main className="flex-grow bg-slate-50 pt-20">
        <Breadcrumbs />
        <Outlet /> 
      </main>
      <Footer />
      <Chatbot /> 
    </div>
  );
}