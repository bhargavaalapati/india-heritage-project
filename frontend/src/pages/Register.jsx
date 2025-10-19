// src/pages/Register.jsx

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { registerUser } from '../services/authService';

const Register = () => {
    const [formData, setFormData] = useState({ username: '', email: '', password: '' });
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const data = await registerUser(formData);
            toast.success(data.message);
            navigate('/login'); // Redirect to login page on success
        } catch (error) {
            toast.error(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto py-12 px-4">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <h1 className="text-4xl font-bold text-center mb-6">Create Account</h1>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input type="text" name="username" placeholder="Username" onChange={handleChange} required className="w-full p-3 border rounded-lg" />
                    <input type="email" name="email" placeholder="Email" onChange={handleChange} required className="w-full p-3 border rounded-lg" />
                    <input type="password" name="password" placeholder="Password" onChange={handleChange} required className="w-full p-3 border rounded-lg" />
                    <button type="submit" disabled={isLoading} className="w-full py-3 bg-orange-500 text-white font-bold rounded-lg hover:bg-orange-600 disabled:bg-slate-400">
                        {isLoading ? 'Registering...' : 'Register'}
                    </button>
                </form>
                <p className="text-center mt-4">
                    Already have an account? <Link to="/login" className="text-orange-500 hover:underline">Login here</Link>
                </p>
            </motion.div>
        </div>
    );
};

export default Register;