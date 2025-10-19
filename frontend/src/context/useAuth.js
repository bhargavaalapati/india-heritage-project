// src/context/useAuth.js

import { createContext, useContext } from 'react';

// 1. Create and export the context object
export const AuthContext = createContext(null);

// 2. Create and export the custom hook
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};