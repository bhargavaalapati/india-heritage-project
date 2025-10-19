import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { loginUser } from '../services/authService';
import { useAuth } from "../context/useAuth";


const Login = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const { login } = useAuth();

/*//const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
        const data = await loginUser(formData);
        toast.success('Logged in successfully!');
        login(data.token); // <-- THIS IS THE CRUCIAL LINE
        navigate('/community'); // Redirect after login
    } catch (error) {
        toast.error(error.message);
    } finally {
        setIsLoading(false);
    }
//};*/

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
    setIsLoading(true);
    try {
        const data = await loginUser(formData);
        toast.success('Logged in successfully!');
        login(data.token); // <-- THIS IS THE CRUCIAL LINE
        navigate('/community'); // Redirect after login
    } catch (error) {
        toast.error(error.message);
    } finally {
        setIsLoading(false);
    }
    };

    return (
        <div className="max-w-md mx-auto py-12 px-4">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <h1 className="text-4xl font-bold text-center mb-6">Login to IndiVerse</h1>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input type="email" name="email" placeholder="Email" onChange={handleChange} required className="w-full p-3 border rounded-lg" />
                    <input type="password" name="password" placeholder="Password" onChange={handleChange} required className="w-full p-3 border rounded-lg" />
                    <button type="submit" disabled={isLoading} className="w-full py-3 bg-orange-500 text-white font-bold rounded-lg hover:bg-orange-600 disabled:bg-slate-400">
                        {isLoading ? 'Logging in...' : 'Login'}
                    </button>
                </form>
                <p className="text-center mt-4">
                    Don't have an account? <Link to="/register" className="text-orange-500 hover:underline">Register here</Link>
                </p>
            </motion.div>
        </div>
    );
};

export default Login;
