// src/components/Navbar.jsx

import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { FiMenu, FiX } from "react-icons/fi";
import { useAuth } from "../context/useAuth";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, logout } = useAuth(); // <-- 2. GET USER AND LOGOUT

  const navLinks = [
    { to: "/", label: "Home" },
    { to: "/about", label: "About" },
    { to: "/tours", label: "Tours" },
    { to: "/quizzes", label: "Knowledge Hub" },
    { to: "/blog", label: "Blog" },
    { to: "/community", label: "Community" },
    { to: "/contact", label: "Contact" },
  ];

  // Using NavLink for active styles
  const linkClass = ({ isActive }) =>
    `text-gray-700 hover:text-green-600 transition ${isActive ? "font-bold text-green-600" : ""}`;

  return (
    <nav className="bg-white shadow-md fixed w-full top-0 left-0 z-50">
      <div className="container mx-auto px-6 py-4 flex items-center justify-between">
        <Link to="/" className="text-2xl font-bold text-blue-600">
          IndiVerse
        </Link>

        {/* --- 3. UPDATED DESKTOP MENU --- */}
        <div className="hidden md:flex items-center space-x-6">
          {navLinks.map((link) => (
            <NavLink key={link.to} to={link.to} className={linkClass}>
              {link.label}
            </NavLink>
          ))}
          {user ? (
            <>
              <span className="font-semibold text-slate-800">Hi, {user.username}!</span>
              <button onClick={logout} className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition">
                Logout
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login" className={linkClass}>Login</NavLink>
              <NavLink to="/register" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
                Register
              </NavLink>
            </>
          )}
        </div>

        <button
          className="md:hidden text-2xl text-gray-700"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <FiX /> : <FiMenu />}
        </button>
      </div>

      {/* --- 4. UPDATED MOBILE MENU --- */}
      {menuOpen && (
        <div className="md:hidden bg-white shadow-lg flex flex-col items-center space-y-4 py-6">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              onClick={() => setMenuOpen(false)}
              className={linkClass}
            >
              {link.label}
            </NavLink>
          ))}
          <div className="border-t w-full my-4"></div>
          {user ? (
            <>
              <span className="font-semibold text-slate-800">Hi, {user.username}!</span>
              <button onClick={() => { logout(); setMenuOpen(false); }} className="bg-orange-500 text-white px-4 py-2 rounded-lg w-3/4 text-center">
                Logout
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login" onClick={() => setMenuOpen(false)} className={linkClass}>Login</NavLink>
              <NavLink to="/register" onClick={() => setMenuOpen(false)} className="bg-blue-600 text-white px-4 py-2 rounded-lg w-3/4 text-center">
                Register
              </NavLink>
            </>
          )}
        </div>
      )}
    </nav>
  );
}