import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import {AppProvider} from "./context/AppContext.jsx";
import AuthLayout from "./layout/AuthLayout.jsx";
import PrivateRoute from "./routes/PrivateRoute.jsx";
import PublicRoute from "./routes/PublicRoute.jsx";
import MainLayout from "./layout/MainLayout.jsx";
import SignIn from "./pages/auth/SignIn.jsx";
import Dashboard from "./pages/dashboard/Dashboard.jsx";
import Profile from "./pages/profile/Profile.jsx";
import Product from "./pages/product/Product.jsx";
import Categories from "./pages/categories/Categories.jsx";
import AddProduct from "./pages/product/AddProduct.jsx";
import Home from "./pages/home/Home.jsx";
import SignUp from "./pages/auth/SignUp.jsx";

function App() {
    return (
        <AppProvider>
            <Router>
                <Routes>
                    {/* Public Routes - Only accessible when NOT logged in */}
                    <Route element={<PublicRoute />}>
                        <Route path="/" element={<AuthLayout />}>
                            <Route index element={<Home />} />
                            <Route path="signin" element={<SignIn />} />
                            <Route path="signup" element={<SignUp />} />
                        </Route>
                    </Route>

                    {/* Private Routes - Only accessible when logged in */}
                    <Route element={<PrivateRoute />}>
                        <Route path="/admin" element={<MainLayout />}>
                            <Route index element={<Navigate to="/admin/dashboard" replace />} />
                            <Route path="dashboard" element={<Dashboard />} />
                            <Route path="products" element={<Product />} />
                            <Route path="products/add" element={<AddProduct />} />
                            <Route path="categories" element={<Categories />} />
                            <Route path="profile" element={<Profile />} />
                        </Route>
                    </Route>

                    {/* Catch all route - redirect based on auth status */}
                    <Route path="*" element={<RedirectBasedOnAuth />} />
                </Routes>
            </Router>
        </AppProvider>
    );
}

// Component to handle unknown routes based on auth status
const RedirectBasedOnAuth = () => {
    const user = JSON.parse(localStorage.getItem("user") || "null");
    const isLoggedIn = !!user?.token;

    return isLoggedIn ?
        <Navigate to="/admin/dashboard" replace /> :
        <Navigate to="/" replace />;
};

export default App;