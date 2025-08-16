import React, { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext();

export const useApp = () => {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error('useApp must be used within AppProvider');
    }
    return context;
};

export const AppProvider = ({ children }) => {
    // Check localStorage immediately for initial state
    const getInitialAuthState = () => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            try {
                const userData = JSON.parse(storedUser);
                return { isLoggedIn: true, user: userData };
            } catch (error) {
                localStorage.removeItem("user");
                return { isLoggedIn: false, user: null };
            }
        }
        return { isLoggedIn: false, user: null };
    };

    const initialAuth = getInitialAuthState();

    const [isDarkMode, setIsDarkMode] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(initialAuth.isLoggedIn);
    const [user, setUser] = useState(initialAuth.user);
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);

    // Modal state management
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(true);

    // Check localStorage on app start - now only for debugging
    useEffect(() => {
        console.log('AppContext - Initial state set:', { isLoggedIn, user });
    }, []);

    // Debug log whenever isLoggedIn changes
    useEffect(() => {
        console.log('AppContext - isLoggedIn changed to:', isLoggedIn);
    }, [isLoggedIn]);

    // Auto close sidebar when modal opens
    useEffect(() => {
        if (isModalOpen) {
            setSidebarOpen(false);
        }
    }, [isModalOpen]);

    // Prevent body scroll when modal is open
    useEffect(() => {
        if (isModalOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }

        // Cleanup on unmount
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isModalOpen]);

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

    // Add the toggleDarkMode function that your navbar expects
    const toggleDarkMode = () => {
        setIsDarkMode(prevMode => !prevMode);
    };

    const login = (userData) => {
        console.log('AppContext - Login called with:', userData);
        setIsLoggedIn(true);
        setUser(userData);
        localStorage.setItem("user", JSON.stringify(userData));
    };

    const logout = () => {
        console.log('AppContext - Logout called');
        setIsLoggedIn(false);
        setUser(null);
        localStorage.removeItem("user");
    };

    // Modal functions
    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        // Restore sidebar state when modal closes (check screen size)
        const isMobile = window.innerWidth <= 768;
        if (!isMobile) {
            setSidebarOpen(true);
        }
    };

    // Sidebar functions
    const toggleSidebar = () => {
        // Don't allow sidebar to open if modal is open
        if (isModalOpen) return;
        setSidebarOpen(!sidebarOpen);
    };

    const closeSidebar = () => {
        setSidebarOpen(false);
    };

    const value = {
        isDarkMode,
        setIsDarkMode,
        toggleDarkMode,
        isLoggedIn,
        user,
        products,
        setProducts,
        categories,
        setCategories,
        theme,
        login,
        logout,
        // Modal state and functions
        isModalOpen,
        setIsModalOpen,
        openModal,
        closeModal,
        // Sidebar state and functions
        sidebarOpen,
        setSidebarOpen,
        toggleSidebar,
        closeSidebar
    };

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    );
};