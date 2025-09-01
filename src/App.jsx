import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import {BrowserRouter as Router, Routes, Route, Navigate} from 'react-router-dom';
import {AppProvider} from "./context/AppContext.jsx";
import AuthLayout from "./layout/AuthLayout.jsx";
import PrivateRoute from "./routes/PrivateRoute.jsx";
import PublicRoute from "./routes/PublicRoute.jsx";
import MainLayout from "./layout/MainLayout.jsx";
import SignIn from "./pages/auth/SignIn.jsx";
import Dashboard from "./pages/dashboard/Dashboard.jsx";
import Product from "./pages/product/Product.jsx";
import Categories from "./pages/categories/Categories.jsx";
import SignUp from "./pages/auth/SignUp.jsx";
import path from "./routes/path.jsx";
import Orders from "./pages/orders/Orders.jsx";

// Component to handle unknown routes based on auth status
const RedirectBasedOnAuth = () => {
    const user = JSON.parse(localStorage.getItem("user") || "null");
    const isLoggedIn = !!user?.token;

    return isLoggedIn ?
        <Navigate to="/dashboard" replace/> :
        <Navigate to={path.signin} replace/>;
};

function App() {
    return (
        <AppProvider>
            <Routes>
                {/* Public Routes - Only accessible when NOT logged in */}
                <Route element={<PublicRoute/>}>
                    <Route element={<AuthLayout/>}>
                        <Route path={path.signin} element={<SignIn/>}/>
                        <Route path={path.signup} element={<SignUp/>}/>
                    </Route>
                </Route>

                {/* Private Routes - Only accessible when logged in */}
                <Route element={<PrivateRoute/>}>
                    <Route path="/" element={<MainLayout/>}>
                        <Route index element={<Navigate to="/dashboard" replace/>}/>
                        <Route path="dashboard" element={<Dashboard/>}/>
                        <Route path={path.product} element={<Product/>}/>
                        <Route path={path.categories} element={<Categories/>}/>
                        <Route path={path.orders} element={<Orders/>}/>
                    </Route>
                </Route>

                {/* Catch all route - redirect based on auth status */}
                <Route path="*" element={<RedirectBasedOnAuth/>}/>
            </Routes>
        </AppProvider>
    );
}

export default App;