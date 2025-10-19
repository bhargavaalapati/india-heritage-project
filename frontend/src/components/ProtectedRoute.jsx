// src/components/ProtectedRoute.jsx

import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/useAuth';

const ProtectedRoute = () => {
    const { user, isLoading } = useAuth();

    // 1. While the authentication status is loading, show a loading indicator.
    // This is the crucial step to prevent a premature redirect.
    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <p className="text-xl text-gray-500">Loading...</p>
            </div>
        );
    }

    // 2. Once loading is complete, if there is no user, redirect to login.
    if (!user) {
        return <Navigate to="/login" replace />;
    }

    // 3. If loading is complete and there IS a user, show the requested page.
    return <Outlet />;
};

export default ProtectedRoute;