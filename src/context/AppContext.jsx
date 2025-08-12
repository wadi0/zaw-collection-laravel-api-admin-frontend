import React, { createContext, useContext, useState } from 'react';

const AppContext = createContext();

export const useApp = () => {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error('useApp must be used within AppProvider');
    }
    return context;
};

export const AppProvider = ({ children }) => {
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState(null);
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);

    const theme = {
        light: {
            bg: '#f8fafc', cardBg: '#ffffff', text: '#1e293b', textSec: '#64748b',
            border: '#e2e8f0', primary: '#3b82f6', success: '#10b981', danger: '#ef4444',
            gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
        },
        dark: {
            bg: '#0f172a', cardBg: '#1e293b', text: '#f1f5f9', textSec: '#94a3b8',
            border: '#334155', primary: '#60a5fa', success: '#34d399', danger: '#f87171',
            gradient: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)'
        }
    };

    const login = (userData) => {
        setIsLoggedIn(true);
        setUser(userData);
    };

    const logout = () => {
        setIsLoggedIn(false);
        setUser(null);
    };

    const value = {
        isDarkMode,
        setIsDarkMode,
        isLoggedIn,
        user,
        products,
        setProducts,
        categories,
        setCategories,
        theme,
        login,
        logout
    };

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    );
};