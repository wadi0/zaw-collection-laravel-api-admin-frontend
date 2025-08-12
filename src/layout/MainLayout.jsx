import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from "../navbar/Navbar.jsx";
import {Sidebar} from "lucide-react";

const MainLayout = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkScreenSize = () => {
            setIsMobile(window.innerWidth <= 768);
        };

        checkScreenSize();
        window.addEventListener('resize', checkScreenSize);
        return () => window.removeEventListener('resize', checkScreenSize);
    }, []);

    return (
        <div className="admin-layout">
            <Navbar
                isLoggedIn={true}
                setSidebarOpen={setSidebarOpen}
                sidebarOpen={sidebarOpen}
                isMobile={isMobile}
            />

            <Sidebar
                sidebarOpen={sidebarOpen}
                setSidebarOpen={setSidebarOpen}
                isMobile={isMobile}
            />

            <main className={`main-content ${!isMobile ? 'with-sidebar' : ''}`}>
                <Outlet />
            </main>

            {/* Mobile sidebar overlay */}
            {sidebarOpen && isMobile && (
                <div
                    className="sidebar-overlay"
                    onClick={() => setSidebarOpen(false)}
                />
            )}
        </div>
    );
};

export default MainLayout;

// import React from 'react';
// import {Outlet} from 'react-router-dom';
//
// const MainLayout = () => {
//     return (
//         <>
//             <Navbar/>
//
//             <div className="main-layout">
//                 <main className="main-content">
//                     <Outlet/>
//                 </main>
//                 <Footer/>
//             </div>
//         </>
//     );
// };
//
// export default MainLayout;