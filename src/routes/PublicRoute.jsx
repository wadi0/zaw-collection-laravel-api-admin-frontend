import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useApp } from "../context/AppContext.jsx";

// const PublicRoute = () => {
//     const { isLoggedIn } = useApp();

//     return !isLoggedIn ?
//         <Outlet /> :
//         <Navigate to="/admin/dashboard" replace />;
// };

const PublicRoute = () => {
    const { isLoggedIn, user } = useApp(); // user state ও check করুন
    
    // Both isLoggedIn এবং user.token দুটোই check করুন
    const isAuthenticated = isLoggedIn && user?.token;
    
    return !isAuthenticated ? 
        <Outlet /> : 
        <Navigate to="/admin/dashboard" replace />;
};

export default PublicRoute;