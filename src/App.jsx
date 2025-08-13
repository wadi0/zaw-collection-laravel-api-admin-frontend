import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import {AppProvider} from "./context/AppContext.jsx";
import AuthLayout from "./layout/AuthLayout.jsx";
import ProtectedRoute from "./routes/ProtectedRoute.jsx";
import MainLayout from "./layout/MainLayout.jsx";
import SignIn from "./pages/auth/SignIn.jsx";
import Dashboard from "./pages/dashboard/Dashboard.jsx";
import Setting from "./pages/setting/Setting.jsx";
import Profile from "./pages/profile/Profile.jsx";
import Product from "./pages/product/Product.jsx";
import Categories from "./pages/categories/Categories.jsx";
import AddProduct from "./pages/product/AddProduct.jsx";
import Home from "./pages/home/Home.jsx";
import path from "./routes/path.jsx";
import SignUp from "./pages/auth/SignUp.jsx";

function App() {
    return (
        <AppProvider>
            <Router>
                <Routes>
                    {/* Public Routes with Auth Layout */}
                    <Route path={path.home} element={<AuthLayout />}>
                        <Route index element={<Home />} />
                        <Route path={path.signin} element={<SignIn />} />
                        <Route path={path.signup} element={<SignUp />} />
                    </Route>

                    {/* Protected Admin Routes with Main Layout */}
                    <Route
                        path="/admin"
                        element={
                            <ProtectedRoute>
                                <MainLayout />
                            </ProtectedRoute>
                        }
                    >
                        <Route index element={<Navigate to="/admin/dashboard" replace />} />
                        <Route path="dashboard" element={<Dashboard />} />
                        <Route path="products" element={<Product />} />
                        <Route path="products/add" element={<AddProduct />} />
                        <Route path="categories" element={<Categories />} />
                        <Route path="profile" element={<Profile />} />
                        <Route path="settings" element={<Setting />} />
                    </Route>

                    {/* Catch all route */}
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </Router>
        </AppProvider>
    );
}

export default App;