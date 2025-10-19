import React, { useState, useEffect, useCallback } from 'react';

import { AuthContext } from './useAuth.js'; // <-- Import from your new file

// The provider component remains the same, but no longer defines the context or hook

export const AuthProvider = ({ children }) => {

    const [user, setUser] = useState(null);

    const [token, setToken] = useState(() => localStorage.getItem('token'));

    const [isLoading, setIsLoading] = useState(true);



    const logout = useCallback(() => {

        localStorage.removeItem('token');

        setToken(null);

        setUser(null);

    }, []);



    const fetchCurrentUser = useCallback(async (authToken) => {

        if (!authToken) {

            setIsLoading(false);

            return;

        }

        try {

            const response = await fetch('http://localhost:5000/api/auth/me', {

                headers: { 'Authorization': `Bearer ${authToken}` },

            });

            if (!response.ok) throw new Error('Failed to fetch user');

            const userData = await response.json();

            setUser(userData);

        } catch (error) {

            console.error(error);

            logout(); // If token is invalid/expired, log the user out

        } finally {

            setIsLoading(false);

        }

    }, [logout]);



    useEffect(() => {

        fetchCurrentUser(token);

    }, [token, fetchCurrentUser]);



    const login = (newToken) => {

        localStorage.setItem('token', newToken);

        setToken(newToken);

    };



    const value = { user, token, login, logout, isLoading };



    return (

    <AuthContext.Provider value={value}>

        {children}

    </AuthContext.Provider>

);

};