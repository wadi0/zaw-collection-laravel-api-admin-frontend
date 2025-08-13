import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import {
    X, BarChart3, Package, Grid, UserCircle, Settings, LogOut,
    ChevronDown, ChevronRight
} from 'lucide-react';

const Sidebar = ({ sidebarOpen, setSidebarOpen, isMobile }) => {
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
        if (isMobile) {
            setSidebarOpen(false);
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

    return (
        <div style={{
            position: 'fixed',
            left: sidebarOpen ? 0 : '-280px',
            top: '4rem',
            width: '280px',
            height: 'calc(100vh - 4rem)',
            background: t.cardBg,
            borderRight: `1px solid ${t.border}`,
            transition: 'left 0.3s ease',
            zIndex: 1000,
            overflow: 'auto'
        }}>
            {/* Header */}
            <div style={{
                padding: '1rem',
                borderBottom: `1px solid ${t.border}`
            }}>
                <h3 style={{ margin: 0, color: t.text }}>Menu</h3>
            </div>

            {/* Menu Items */}
            <nav style={{ padding: '1rem 0' }}>
                {menuItems.map((item) => (
                    <div key={item.id}>
                        <button
                            onClick={() => {
                                if (item.children) {
                                    setActiveAccordion(activeAccordion === item.id ? '' : item.id);
                                } else {
                                    handleNavigation(item.path);
                                }
                            }}
                            style={{
                                width: '100%',
                                background: isActiveRoute(item.path) || (item.children && isActiveParent(item.children)) ? t.primary : 'none',
                                border: 'none',
                                color: isActiveRoute(item.path) || (item.children && isActiveParent(item.children)) ? 'white' : t.text,
                                padding: '0.75rem 1rem',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.75rem',
                                cursor: 'pointer'
                            }}
                        >
                            <item.icon size={18} />
                            <span style={{ flex: 1, textAlign: 'left' }}>{item.label}</span>
                            {item.children && (activeAccordion === item.id ? <ChevronDown size={16} /> : <ChevronRight size={16} />)}
                        </button>

                        {/* Submenu */}
                        {item.children && activeAccordion === item.id && (
                            <div style={{ backgroundColor: 'rgba(0,0,0,0.05)' }}>
                                {item.children.map((child) => (
                                    <button
                                        key={child.id}
                                        onClick={() => handleNavigation(child.path)}
                                        style={{
                                            width: '100%',
                                            background: isActiveRoute(child.path) ? t.primary : 'none',
                                            border: 'none',
                                            color: isActiveRoute(child.path) ? 'white' : t.textSec,
                                            padding: '0.5rem 3rem',
                                            cursor: 'pointer',
                                            fontSize: '0.85rem'
                                        }}
                                    >
                                        {child.label}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </nav>

            {/* Logout */}
            <div style={{ position: 'absolute', bottom: '1rem', left: '1rem', right: '1rem' }}>
                <button
                    onClick={handleLogout}
                    style={{
                        width: '100%',
                        background: t.danger,
                        color: 'white',
                        border: 'none',
                        padding: '0.75rem',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.5rem'
                    }}
                >
                    <LogOut size={16} /> Logout
                </button>
            </div>
        </div>
    );
};

export default Sidebar;