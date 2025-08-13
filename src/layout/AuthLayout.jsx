import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../navbar/Navbar.jsx";

const AuthLayout = () => {
    return (
        <div className="auth-layout">
            <Navbar isLoggedIn={false} />
            <div className="auth-content">
                <Outlet />
            </div>
        </div>
    );
};

export default AuthLayout;