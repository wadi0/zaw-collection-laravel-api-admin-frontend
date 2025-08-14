import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from "../navbar/Navbar.jsx";
import Sidebar from "../sidebar/Sidebar.jsx";
import Footer from "../footer/Footer.jsx"; // ✅ Import the new Footer component
import { useApp } from "../context/AppContext.jsx";
import './mainLayout.scss';

const MainLayout = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const { isDarkMode, theme } = useApp();

    const t = isDarkMode ? theme.dark : theme.light;

    useEffect(() => {
        const checkScreenSize = () => {
            setIsMobile(window.innerWidth <= 768);

            // Auto open sidebar on desktop
            if (window.innerWidth > 768) {
                setSidebarOpen(true);
            } else {
                setSidebarOpen(false);
            }
        };

        checkScreenSize();
        window.addEventListener('resize', checkScreenSize);
        return () => window.removeEventListener('resize', checkScreenSize);
    }, []);

    // Debug logs
    console.log('MainLayout - sidebarOpen:', sidebarOpen);
    console.log('MainLayout - isMobile:', isMobile);

    return (
        <div className={`admin-layout ${isDarkMode ? 'dark-mode' : ''}`}>
            {/* Navbar at the top */}
            <Navbar
                setSidebarOpen={setSidebarOpen}
                sidebarOpen={sidebarOpen}
                isMobile={isMobile}
            />

            <div className="layout-body">
                {/* Sidebar on the left */}
                <Sidebar
                    sidebarOpen={sidebarOpen}
                    setSidebarOpen={setSidebarOpen}
                    isMobile={isMobile}
                />

                {/* Main content area with footer */}
                <div
                    className={`content-wrapper ${!isMobile && sidebarOpen ? 'with-sidebar' : ''}`}
                    style={{
                        marginLeft: !isMobile && sidebarOpen ? '280px' : '0',
                        marginTop: '4rem', // Navbar fixed থাকায় space দিতে হবে
                        transition: 'margin-left 0.3s ease',
                        minHeight: 'calc(100vh - 4rem)',
                        display: 'flex',
                        flexDirection: 'column'
                    }}
                >
                    {/* Main content */}
                    <main
                        className="main-content"
                        style={{
                            background: t.bg,
                            padding: '2rem',
                            flex: '1 0 auto' // This ensures footer stays at bottom
                        }}
                    >
                        <Outlet />
                    </main>

                    {/* Footer */}
                    <Footer
                        sidebarOpen={sidebarOpen}
                        isMobile={isMobile}
                    />
                </div>
            </div>

            {/* Mobile sidebar overlay */}
            {sidebarOpen && isMobile && (
                <div
                    className="sidebar-overlay"
                    onClick={() => setSidebarOpen(false)}
                    style={{
                        position: 'fixed',
                        top: '4rem', // Start below navbar
                        left: 0,
                        width: '100%',
                        height: 'calc(100% - 4rem)',
                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                        zIndex: 998
                    }}
                />
            )}
        </div>
    );
};

export default MainLayout;