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

    // Sidebar.jsx এর sidebarStyles object টা এভাবে update করুন:

const sidebarStyles = {
    // Remove fixed positioning - let it be in normal document flow
    width: '100%',
    height: '100%', // Take full height of middle section
    background: t.cardBg,
    borderRight: `1px solid ${t.border}`,
    display: 'flex',
    flexDirection: 'column',
    // Remove position, top, left properties for normal flow
};

// Mobile এর জন্য আলাদা styles
const mobileSidebarStyles = {
    position: 'fixed',
    top: '4rem',
    left: sidebarOpen ? '0' : '-280px',
    width: '280px',
    height: 'calc(100vh - 4rem)',
    background: t.cardBg,
    borderRight: `1px solid ${t.border}`,
    transition: 'left 0.3s ease',
    zIndex: 1000,
    display: 'flex',
    flexDirection: 'column'
};

// Sidebar component এ condition অনুযায়ী style apply করুন:
const finalStyles = isMobile ? mobileSidebarStyles : sidebarStyles;

    return (
        <aside style={sidebarStyles}>
            {/* Header */}
            <div style={{
                padding: '1rem',
                borderBottom: `1px solid ${t.border}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexShrink: 0
            }}>
                <h3 style={{
                    margin: 0,
                    color: t.text,
                    fontSize: '1rem',
                    fontWeight: '600'
                }}>
                    Menu
                </h3>
                {isMobile && (
                    <button
                        onClick={() => setSidebarOpen(false)}
                        style={{
                            background: 'none',
                            border: 'none',
                            color: t.text,
                            cursor: 'pointer',
                            padding: '0.25rem',
                            borderRadius: '0.25rem',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                    >
                        <X size={18} />
                    </button>
                )}
            </div>

            {/* Navigation Menu */}
            <nav style={{
                flex: 1,
                padding: '0.5rem 0'
            }}>
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
                                background: isActiveRoute(item.path) || (item.children && isActiveParent(item.children))
                                    ? t.primary
                                    : 'transparent',
                                border: 'none',
                                color: isActiveRoute(item.path) || (item.children && isActiveParent(item.children))
                                    ? 'white'
                                    : t.text,
                                padding: '0.75rem 1rem',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.75rem',
                                cursor: 'pointer',
                                fontSize: '0.9rem',
                                transition: 'all 0.2s ease',
                                textAlign: 'left'
                            }}
                            onMouseEnter={(e) => {
                                if (!isActiveRoute(item.path) && !(item.children && isActiveParent(item.children))) {
                                    e.target.style.background = isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)';
                                }
                            }}
                            onMouseLeave={(e) => {
                                if (!isActiveRoute(item.path) && !(item.children && isActiveParent(item.children))) {
                                    e.target.style.background = 'transparent';
                                }
                            }}
                        >
                            <item.icon size={18} />
                            <span style={{ flex: 1 }}>{item.label}</span>
                            {item.children && (
                                activeAccordion === item.id
                                    ? <ChevronDown size={16} />
                                    : <ChevronRight size={16} />
                            )}
                        </button>

                        {/* Submenu */}
                        {item.children && activeAccordion === item.id && (
                            <div style={{
                                backgroundColor: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
                                borderLeft: `3px solid ${t.primary}`,
                                marginLeft: '1rem',
                                marginRight: '1rem',
                                borderRadius: '0 0.25rem 0.25rem 0'
                            }}>
                                {item.children.map((child) => (
                                    <button
                                        key={child.id}
                                        onClick={() => handleNavigation(child.path)}
                                        style={{
                                            width: '100%',
                                            background: isActiveRoute(child.path) ? t.primary : 'transparent',
                                            border: 'none',
                                            color: isActiveRoute(child.path) ? 'white' : t.textSec,
                                            padding: '0.5rem 1.5rem',
                                            cursor: 'pointer',
                                            fontSize: '0.85rem',
                                            textAlign: 'left',
                                            transition: 'all 0.2s ease'
                                        }}
                                        onMouseEnter={(e) => {
                                            if (!isActiveRoute(child.path)) {
                                                e.target.style.background = isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)';
                                            }
                                        }}
                                        onMouseLeave={(e) => {
                                            if (!isActiveRoute(child.path)) {
                                                e.target.style.background = 'transparent';
                                            }
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

            {/* Logout Button */}
            <div style={{
                padding: '1rem',
                borderTop: `1px solid ${t.border}`,
                flexShrink: 0,
                background: t.cardBg
            }}>
                <button
                    onClick={handleLogout}
                    style={{
                        width: '100%',
                        background: t.danger || '#ef4444',
                        color: 'white',
                        border: 'none',
                        padding: '0.75rem',
                        borderRadius: '0.5rem',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.5rem',
                        fontSize: '0.9rem',
                        fontWeight: '500',
                        transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                        e.target.style.background = '#dc2626';
                        e.target.style.transform = 'translateY(-1px)';
                    }}
                    onMouseLeave={(e) => {
                        e.target.style.background = t.danger || '#ef4444';
                        e.target.style.transform = 'translateY(0)';
                    }}
                >
                    <LogOut size={16} />
                    Logout
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;