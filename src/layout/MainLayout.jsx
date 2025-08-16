import React, { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from "../navbar/Navbar.jsx";
import Sidebar from "../sidebar/Sidebar.jsx";
import Footer from "../footer/Footer.jsx";
import { useApp } from "../context/AppContext.jsx";
import './mainLayout.scss';

const MainLayout = () => {
    const {
        isDarkMode,
        theme,
        sidebarOpen,
        setSidebarOpen,
        toggleSidebar,
        closeSidebar,
        isModalOpen
    } = useApp();

    const [isMobile, setIsMobile] = React.useState(false);
    const t = isDarkMode ? theme.dark : theme.light;

    useEffect(() => {
        const checkScreenSize = () => {
            const mobile = window.innerWidth <= 768;
            setIsMobile(mobile);

            // Auto close sidebar on mobile by default
            if (mobile) {
                setSidebarOpen(false);
            } else if (!isModalOpen) {
                // Only restore sidebar on desktop if no modal is open
                setSidebarOpen(true);
            }
        };

        checkScreenSize();
        window.addEventListener('resize', checkScreenSize);
        return () => window.removeEventListener('resize', checkScreenSize);
    }, [setSidebarOpen, isModalOpen]);

    // Handle clicking outside sidebar on mobile
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (isMobile && sidebarOpen && !isModalOpen &&
                !e.target.closest('.sidebar') &&
                !e.target.closest('.sidebar-toggle')) {
                closeSidebar();
            }
        };

        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, [isMobile, sidebarOpen, isModalOpen, closeSidebar]);

    // Handle escape key to close sidebar
    useEffect(() => {
        const handleEscapeKey = (e) => {
            if (e.key === 'Escape' && sidebarOpen && !isModalOpen) {
                closeSidebar();
            }
        };

        document.addEventListener('keydown', handleEscapeKey);
        return () => document.removeEventListener('keydown', handleEscapeKey);
    }, [sidebarOpen, isModalOpen, closeSidebar]);

    return (
        <div className={`layout-container ${!sidebarOpen ? 'sidebar-collapsed' : ''} ${isDarkMode ? 'dark-mode' : 'light-mode'} ${isModalOpen ? 'modal-open' : ''}`}>
            {/* Navbar - Fixed at top */}
            <Navbar
                onToggleSidebar={toggleSidebar}
                sidebarVisible={sidebarOpen}
                isModalOpen={isModalOpen}
            />

            {/* Layout Content */}
            <div className="layout-content">
                {/* Sidebar - Always first, on the left */}
                <Sidebar
                    isVisible={sidebarOpen && !isModalOpen}
                    onClose={closeSidebar}
                    isModalOpen={isModalOpen}
                />

                {/* Main Content Area - Always second, after sidebar */}
                <main className="main">
                    <div className="content-area">
                        <Outlet />
                    </div>
                </main>
            </div>

            {/* Modern Footer */}
            <Footer />

            {/* Mobile Overlay */}
            {isMobile && sidebarOpen && !isModalOpen && (
                <div className="sidebar-overlay" onClick={closeSidebar}></div>
            )}
        </div>
    );
};

export default MainLayout;