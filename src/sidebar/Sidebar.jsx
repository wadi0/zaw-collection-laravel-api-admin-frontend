import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import {
    X, BarChart3, Package, Grid, UserCircle, Settings, LogOut,
    ChevronDown, ChevronRight
} from 'lucide-react';
import './sidebar.scss';

const Sidebar = ({ isVisible, onClose }) => {
    const [activeAccordion, setActiveAccordion] = useState('');
    const { isDarkMode, theme, logout } = useApp();
    const navigate = useNavigate();
    const location = useLocation();
    const t = isDarkMode ? theme.dark : theme.light;

    const menuItems = [
        { id: 'dashboard', label: 'Dashboard', icon: BarChart3, path: '/admin/dashboard' },
        {
            id: 'products', label: 'Products', icon: Package,
            children: [
                { id: 'all-products', label: 'All Products', path: '/admin/products' },
                { id: 'add-product', label: 'Add Product', path: '/admin/products/add' }
            ]
        },
        { id: 'categories', label: 'Categories', icon: Grid, path: '/admin/categories' },
        { id: 'profile', label: 'Profile', icon: UserCircle, path: '/admin/profile' },
        { id: 'settings', label: 'Settings', icon: Settings, path: '/admin/settings' }
    ];

    const handleNavigation = (path) => {
        navigate(path);
        // Close sidebar on mobile after navigation
        if (window.innerWidth <= 768) {
            onClose();
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const isActiveRoute = (path) => {
        return location.pathname === path;
    };

    const isActiveParent = (children) => {
        return children.some(child => location.pathname === child.path);
    };

    const toggleAccordion = (itemId) => {
        setActiveAccordion(activeAccordion === itemId ? '' : itemId);
    };

    return (
        <aside className={`sidebar ${isVisible ? 'show' : ''} ${isDarkMode ? 'dark-mode' : ''}`}>
            {/* Header */}
            <div className="sidebar-header">
                <h3>Menu</h3>
                <button
                    className="sidebar-close-btn"
                    onClick={onClose}
                    title="Close Sidebar"
                >
                    <X size={18} />
                </button>
            </div>

            {/* Navigation Menu */}
            <nav className="sidebar-nav">
                {menuItems.map((item) => (
                    <div key={item.id} className="sidebar-nav-item">
                        <button
                            className={`sidebar-nav-link ${
                                isActiveRoute(item.path) || (item.children && isActiveParent(item.children)) 
                                    ? 'active' 
                                    : ''
                            }`}
                            onClick={() => {
                                if (item.children) {
                                    toggleAccordion(item.id);
                                } else {
                                    handleNavigation(item.path);
                                }
                            }}
                        >
                            <item.icon size={18} />
                            <span className="nav-label">{item.label}</span>
                            {item.children && (
                                <span className="nav-arrow">
                                    {activeAccordion === item.id
                                        ? <ChevronDown size={16} />
                                        : <ChevronRight size={16} />
                                    }
                                </span>
                            )}
                        </button>

                        {/* Submenu */}
                        {item.children && activeAccordion === item.id && (
                            <div className="sidebar-submenu">
                                {item.children.map((child) => (
                                    <button
                                        key={child.id}
                                        className={`sidebar-submenu-link ${
                                            isActiveRoute(child.path) ? 'active' : ''
                                        }`}
                                        onClick={() => handleNavigation(child.path)}
                                    >
                                        {child.label}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </nav>

            {/* Logout Button */}
            <div className="sidebar-footer">
                <button
                    className="logout-btn"
                    onClick={handleLogout}
                >
                    <LogOut size={16} />
                    <span>Logout</span>
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;