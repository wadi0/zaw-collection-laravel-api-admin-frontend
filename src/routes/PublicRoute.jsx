import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useApp } from "../context/AppContext.jsx";

const PublicRoute = () => {
    const { isLoggedIn } = useApp();

    return !isLoggedIn ?
        <Outlet /> :
        <Navigate to="/admin/dashboard" replace />;
};

export default PublicRoute;