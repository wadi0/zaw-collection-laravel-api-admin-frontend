import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useApp } from "../context/AppContext.jsx";
import path from "./path.jsx";

// const PrivateRoute = () => {
//     const { isLoggedIn, logout, user } = useApp();
//     const location = useLocation();

//     if (!user?.token) {
//         // logout();
//         return <Navigate to={path.signin} state={{ from: location }} replace />;
//     }

//     return isLoggedIn ?
//         <Outlet /> :
//         <Navigate to={path.signin} state={{ from: location }} replace />;
// };

const PrivateRoute = () => {
    const { isLoggedIn, user } = useApp();
    const location = useLocation();
    
    // Check both localStorage and context
    const token = user?.token || JSON.parse(localStorage.getItem("user") || "{}")?.token;
    
    if (!token) {
        return <Navigate to={path.signin} state={{ from: location }} replace />;
    }
    
    return isLoggedIn ? 
        <Outlet /> : 
        <Navigate to={path.signin} state={{ from: location }} replace />;
};

export default PrivateRoute;