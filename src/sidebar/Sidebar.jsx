import React, {useState, useEffect} from 'react';
import {useNavigate, useLocation} from 'react-router-dom';
import {useApp} from '../context/AppContext';
import {
    X, BarChart3, Package, Grid, UserCircle, Settings, LogOut,
    ChevronDown, ChevronRight, Home, Users, ShoppingCart,
    FileText, Bell, HelpCircle, Star, TrendingUp, Boxes, Truck
} from 'lucide-react';
import "./sidebar.scss"
import path from "../routes/path.jsx";
import logo from "../assets/logo.png";

const Sidebar = ({isVisible, onClose}) => {
    const [activeAccordion, setActiveAccordion] = useState('');
    const [collapsedGroups, setCollapsedGroups] = useState(new Set());
    const {isDarkMode, logout} = useApp();
    const navigate = useNavigate();
    const location = useLocation();

    // Menu Configuration
    const menuItems = [
        {
            id: 'home',
            label: 'Dashboard',
            icon: Home,
            path: '/admin/dashboard',
            badge: null
        },
        {
            id: 'products',
            label: 'Products',
            icon: Package,
            children: [
                {id: 'all-product', label: 'All Products', path: path.product},
                {id: 'categories', label: 'Categories', path: path.categories}
            ]
        },
        {
            id: 'orders',
            label: 'Orders',
            icon: ShoppingCart,
            // badge: '5',
            children: [
                {id: 'all-orders', label: 'All Orders', path: '/admin/orders'},
                {id: 'pending-orders', label: 'Pending', path: '/admin/orders/pending'},
                {id: 'completed-orders', label: 'Completed', path: '/admin/orders/completed'}
            ]
        },
        {
            id: 'customers',
            label: 'Customers',
            icon: Users,
            path: '/admin/customers',
            badge: null
        },
        {
            id: 'reports',
            label: 'Reports',
            icon: TrendingUp,
            children: [
                {id: 'sales-report', label: 'Sales Report', path: '/admin/reports/sales'},
                {id: 'analytics', label: 'Analytics', path: '/admin/reports/analytics'},
                {id: 'export', label: 'Export Data', path: '/admin/reports/export'}
            ]
        },
        {
            id: 'shipping',
            label: 'Shipping',
            icon: Truck,
            path: '/admin/shipping',
            badge: null
        },
        {
            id: 'settings',
            label: 'Settings',
            icon: Settings,
            path: '/admin/settings',
            badge: null
        }
    ];

    // Quick Actions
    const quickActions = [
        {id: 'help', label: 'Help & Support', icon: HelpCircle, path: '/admin/help'},
        {id: 'notifications', label: 'Notifications', icon: Bell, path: '/admin/notifications'}
    ];

    // Initialize accordion state based on current route
    useEffect(() => {
        const currentItem = menuItems.find(item =>
            item.children && item.children.some(child => location.pathname === child.path)
        );
        if (currentItem) {
            setActiveAccordion(currentItem.id);
        }
    }, [location.pathname]);

    const handleNavigation = (path) => {
        navigate(path);
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
        return children?.some(child => location.pathname === child.path);
    };

    const toggleAccordion = (itemId) => {
        setActiveAccordion(activeAccordion === itemId ? '' : itemId);
    };

    const getSidebarClasses = () => {
        let classes = 'sidebar';
        if (isVisible) classes += ' show';
        if (isDarkMode) classes += ' dark-mode';
        return classes;
    };

    return (
        <aside className={getSidebarClasses()}>
            {/* Sidebar Header */}
            <div className="sidebar-header">
                <div className="sidebar-brand">
                    <img className="sidebar-logo" src={logo}/>
                </div>
                <button
                    className="sidebar-close-btn"
                    onClick={onClose}
                    title="Close Sidebar"
                >
                    <X size={18}/>
                </button>
            </div>

            {/* Sidebar Content */}
            <div className="sidebar-content">
                {/* Main Navigation */}
                <nav className="sidebar-nav">
                    <div className="nav-section">
                        <span className="nav-section-title">Main Menu</span>
                        {menuItems.map((item) => (
                            <div key={item.id} className="sidebar-nav-item">
                                <button
                                    className={`sidebar-nav-link ${
                                        isActiveRoute(item.path) ||
                                        (item.children && isActiveParent(item.children))
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
                                    <div className="nav-link-content">
                                        <item.icon size={18} className="nav-icon"/>
                                        <span className="nav-label">{item.label}</span>
                                        {item.badge && (
                                            <span className="nav-badge">{item.badge}</span>
                                        )}
                                    </div>
                                    {item.children && (
                                        <span className="nav-arrow">
                                            {activeAccordion === item.id
                                                ? <ChevronDown size={16}/>
                                                : <ChevronRight size={16}/>
                                            }
                                        </span>
                                    )}
                                </button>

                                {/* Submenu with smooth animation */}
                                {item.children && (
                                    <div className={`sidebar-submenu ${activeAccordion === item.id ? 'open' : ''}`}>
                                        <div className="submenu-content">
                                            {item.children.map((child) => (
                                                <button
                                                    key={child.id}
                                                    className={`sidebar-submenu-link ${
                                                        isActiveRoute(child.path) ? 'active' : ''
                                                    }`}
                                                    onClick={() => handleNavigation(child.path)}
                                                >
                                                    <span className="submenu-dot"></span>
                                                    {child.label}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Quick Actions Section */}
                    <div className="nav-section">
                        <span className="nav-section-title">Quick Actions</span>
                        {quickActions.map((action) => (
                            <div key={action.id} className="sidebar-nav-item">
                                <button
                                    className={`sidebar-nav-link ${
                                        isActiveRoute(action.path) ? 'active' : ''
                                    }`}
                                    onClick={() => handleNavigation(action.path)}
                                >
                                    <div className="nav-link-content">
                                        <action.icon size={18} className="nav-icon"/>
                                        <span className="nav-label">{action.label}</span>
                                    </div>
                                </button>
                            </div>
                        ))}
                    </div>
                </nav>

                {/* User Profile Section */}
                <div className="sidebar-user">
                    <div className="user-avatar">
                        <UserCircle size={32}/>
                    </div>
                    <div className="user-info">
                        <span className="user-name">Admin User</span>
                        <span className="user-role">Administrator</span>
                    </div>
                    <div className="user-status">
                        <div className="status-dot online"></div>
                    </div>
                </div>
            </div>

            {/* Sidebar Footer */}
            <div className="sidebar-footer">
                <button
                    className="logout-btn"
                    onClick={handleLogout}
                >
                    <LogOut size={16}/>
                    <span>Logout</span>
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;