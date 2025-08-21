import React, {useEffect} from 'react';
import {Outlet} from 'react-router-dom';
import Navbar from "../navbar/Navbar.jsx";
import Sidebar from "../sidebar/Sidebar.jsx";
import Footer from "../footer/Footer.jsx";
import {useApp} from "../context/AppContext.jsx";
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

    useEffect(() => {
        const checkScreenSize = () => {
            const mobile = window.innerWidth <= 768;
            setIsMobile(mobile);
        };

        checkScreenSize();
        window.addEventListener('resize', checkScreenSize);
        return () => window.removeEventListener('resize', checkScreenSize);
    }, []);

    // Mobile এ outside click করলে sidebar বন্ধ
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (isMobile && sidebarOpen && !isModalOpen &&
                !e.target.closest('.sidebar') &&
                !e.target.closest('.sidebar-toggle-btn')) {
                closeSidebar();
            }
        };

        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, [isMobile, sidebarOpen, isModalOpen, closeSidebar]);

    return (
        <div
            className={`layout-container ${!sidebarOpen ? 'sidebar-collapsed' : ''} ${isDarkMode ? 'dark-mode' : 'light-mode'} ${isModalOpen ? 'modal-open' : ''}`}>
            <Navbar
                onToggleSidebar={toggleSidebar}
                sidebarVisible={sidebarOpen}
                isModalOpen={isModalOpen}
            />

            <div className="layout-content">
                <Sidebar
                    isVisible={sidebarOpen && !isModalOpen}
                    onClose={closeSidebar}
                    isModalOpen={isModalOpen}
                />

                <main className="main">
                    <div className="content-area">
                        <Outlet/>
                    </div>
                </main>
            </div>

            <Footer/>

            {isMobile && sidebarOpen && !isModalOpen && (
                <div className="sidebar-overlay" onClick={closeSidebar}></div>
            )}
        </div>
    );
};

export default MainLayout;