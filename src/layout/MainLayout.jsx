import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from "../navbar/Navbar.jsx";
import Sidebar from "../sidebar/Sidebar.jsx";
import Footer from "../footer/Footer.jsx";
import { useApp } from "../context/AppContext.jsx";
import './mainLayout.scss';

const MainLayout = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const { isDarkMode, theme } = useApp();

    const t = isDarkMode ? theme.dark : theme.light;

    useEffect(() => {
        const checkScreenSize = () => {
            const mobile = window.innerWidth <= 768;
            setIsMobile(mobile);

            // Auto open sidebar on desktop, close on mobile
            if (!mobile) {
                setSidebarOpen(true);
            } else {
                setSidebarOpen(false);
            }
        };

        checkScreenSize();
        window.addEventListener('resize', checkScreenSize);
        return () => window.removeEventListener('resize', checkScreenSize);
    }, []);

    return (
        <div className={`admin-layout ${isDarkMode ? 'dark-mode' : ''}`}>
            {/* 1. Header Section - Fixed at top */}
            <div className="navbar-section">
                <Navbar
                    setSidebarOpen={setSidebarOpen}
                    sidebarOpen={sidebarOpen}
                    isMobile={isMobile}
                />
            </div>

            {/* Main wrapper for middle section and footer */}
            <div className="main-wrapper">
                {/* 2. Middle Section - Sidebar + Content */}
                <div className="middle-section">
                    {/* Sidebar Area */}
                    <div className={`sidebar-area ${!sidebarOpen ? 'sidebar-closed' : ''}`}>
                        <Sidebar
                            sidebarOpen={sidebarOpen}
                            setSidebarOpen={setSidebarOpen}
                            isMobile={isMobile}
                        />
                    </div>

                    {/* Content Area */}
                    <div className={`content-area-wrapper ${!sidebarOpen ? 'sidebar-closed' : ''}`}>
                        <main className="main-content" style={{ background: t.bg }}>
                            <div className="content-area">
                                <Outlet />
                            </div>
                        </main>
                    </div>
                </div>

                {/* 3. Footer Section - Full width below everything */}
                <div className="footer-section">
                    <Footer
                        sidebarOpen={sidebarOpen && !isMobile}
                        isMobile={isMobile}
                    />
                </div>
            </div>

            {/* Mobile Overlay */}
            {sidebarOpen && isMobile && (
                <div
                    className="mobile-overlay"
                    onClick={() => setSidebarOpen(false)}
                />
            )}
        </div>
    );
};

export default MainLayout;