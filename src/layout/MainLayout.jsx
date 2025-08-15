import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from "../navbar/Navbar.jsx";
import Sidebar from "../sidebar/Sidebar.jsx";
import Footer from "../footer/Footer.jsx";
import { useApp } from "../context/AppContext.jsx";
import './mainLayout.scss';

const MainLayout = () => {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [isMobile, setIsMobile] = useState(false);
    const { isDarkMode, theme } = useApp();

    const t = isDarkMode ? theme.dark : theme.light;

    useEffect(() => {
        const checkScreenSize = () => {
            const mobile = window.innerWidth <= 768;
            setIsMobile(mobile);

            // Auto close sidebar on mobile by default
            if (mobile) {
                setSidebarOpen(false);
            } else {
                setSidebarOpen(true);
            }
        };

        checkScreenSize();
        window.addEventListener('resize', checkScreenSize);
        return () => window.removeEventListener('resize', checkScreenSize);
    }, []);

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    const closeSidebar = () => {
        setSidebarOpen(false);
    };

    // Handle clicking outside sidebar on mobile
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (isMobile && sidebarOpen &&
                !e.target.closest('.sidebar') &&
                !e.target.closest('.sidebar-toggle')) {
                closeSidebar();
            }
        };

        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, [isMobile, sidebarOpen]);

    // Handle escape key to close sidebar
    useEffect(() => {
        const handleEscapeKey = (e) => {
            if (e.key === 'Escape' && sidebarOpen) {
                closeSidebar();
            }
        };

        document.addEventListener('keydown', handleEscapeKey);
        return () => document.removeEventListener('keydown', handleEscapeKey);
    }, [sidebarOpen]);

    return (
        <div className={`layout-container ${!sidebarOpen ? 'sidebar-collapsed' : ''} ${isDarkMode ? 'dark-mode' : ''}`}>
            {/* Navbar - Fixed at top */}
            <Navbar
                onToggleSidebar={toggleSidebar}
                sidebarVisible={sidebarOpen}
            />

            {/* Layout Content */}
            <div className="layout-content">
                {/* Sidebar */}
                <Sidebar
                    isVisible={sidebarOpen}
                    onClose={closeSidebar}
                />

                {/* Main Content Area */}
                <main className="main" style={{ background: t.bg }}>
                    <div className="content-area">
                        <Outlet />
                    </div>
                </main>
            </div>

            {/* Footer */}
            <Footer />

            {/* Mobile Overlay */}
            {isMobile && sidebarOpen && (
                <div className="sidebar-overlay" onClick={closeSidebar}></div>
            )}
        </div>
    );
};

export default MainLayout;