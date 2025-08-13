import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useApp } from "../context/AppContext.jsx";
import path from "./path.jsx";

const PrivateRoute = () => {
    const { isLoggedIn } = useApp();
    const location = useLocation();

    console.log('PrivateRoute - isLoggedIn:', isLoggedIn);

    return isLoggedIn ?
        <Outlet /> :
        <Navigate to={path.signin} state={{ from: location }} replace />;
};

export default PrivateRoute;