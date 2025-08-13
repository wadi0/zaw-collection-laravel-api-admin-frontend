import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useApp } from "../context/AppContext.jsx";

const PublicRoute = () => {
    const { isLoggedIn } = useApp();

    console.log('PublicRoute - isLoggedIn:', isLoggedIn);

    // If logged in, redirect to admin dashboard
    // If not logged in, allow access to public routes
    return !isLoggedIn ?
        <Outlet /> :
        <Navigate to="/admin/dashboard" replace />;
};

export default PublicRoute;