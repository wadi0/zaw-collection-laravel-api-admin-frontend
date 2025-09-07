
import React, {useState, useEffect} from 'react';
import {useNavigate, useLocation} from 'react-router-dom';
import {useApp} from '../context/AppContext';
import {
    X, Package, Settings,
    ChevronDown, ChevronRight, Home, Users, ShoppingCart,
    Bell, HelpCircle, TrendingUp, Truck
} from 'lucide-react';
import "./sidebar.scss"
import path from "../routes/path.jsx";

const Sidebar = ({isVisible, onClose}) => {
    const [activeAccordion, setActiveAccordion] = useState('');
    const {isDarkMode} = useApp();
    const navigate = useNavigate();
    const location = useLocation();

    // Helper function to normalize paths for comparison
    const normalizePath = (pathStr) => {
        if (!pathStr) return '';

        // Handle relative paths by converting them to absolute
        if (!pathStr.startsWith('/')) {
            return `/${pathStr}`;
        }
        return pathStr;
    };

    // Enhanced path matching function
    const isPathActive = (href) => {
        if (!href) return false;

        const currentPath = location.pathname;
        const targetPath = normalizePath(href);

        console.log('Checking path:', {currentPath, targetPath, href}); // Debug log

        // Exact match first
        if (currentPath === targetPath) return true;

        // Handle nested paths (e.g., /product/123 should match /product)
        if (currentPath.startsWith(targetPath + '/')) return true;

        // Special handling for dashboard
        if (targetPath === '/dashboard' && currentPath === '/dashboard') return true;
        if (href === '/dashboard' && currentPath === '/dashboard') return true;

        // For relative paths like "product", "categories", "orders"
        if (!targetPath.startsWith('/')) {
            const pathSegment = targetPath;
            return currentPath.includes(`/${pathSegment}`) || currentPath.endsWith(`/${pathSegment}`);
        }

        const pathSegment = targetPath.replace('/', '');
        if (pathSegment) {
            const pathPattern = new RegExp(`^/(${pathSegment})(/|$)`);
            return pathPattern.test(currentPath);
        }

        return false;
    };

    // Helper function to check if any child is active
    const hasActiveChild = (children) => {
        if (!children) return false;
        return children.some(child => isPathActive(child.path));
    };

    // Menu Configuration
    const menuItems = [
        {
            id: 'home',
            label: 'Dashboard',
            icon: Home,
            path: '/dashboard',
            badge: null
        },
        {
            id: 'products',
            label: 'Products',
            icon: Package,
            children: [
                {id: 'all-product', label: 'All Products', path: `/${path.product}`},
                {id: 'categories', label: 'Categories', path: `/${path.categories}`}
            ]
        },
        {
            id: 'orders',
            label: 'Orders',
            icon: ShoppingCart,
            children: [
                {id: 'all-orders', label: 'All Orders', path: `/${path.orders}`},
                {id: 'pending-orders', label: 'Pending', path: `/${path.orders}/pending`},
                {id: 'completed-orders', label: 'Completed', path: `/${path.orders}/completed`}
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
            item.children && hasActiveChild(item.children)
        );
        if (currentItem) {
            setActiveAccordion(currentItem.id);
        }
    }, [location.pathname]);

    const handleNavigation = (path) => {
        console.log('Navigating to:', path); // Debug log
        navigate(path);
        if (window.innerWidth <= 768) {
            onClose();
        }
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
            {/* Sidebar Header - Only close button for mobile */}
            <div className="sidebar-header">
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
                        {menuItems.map((item) => {
                            const isActive = isPathActive(item.path) || (item.children && hasActiveChild(item.children));
                            console.log(`Item ${item.label}:`, {isActive, path: item.path, currentPath: location.pathname}); // Debug log

                            return (
                                <div key={item.id} className="sidebar-nav-item">
                                    <button
                                        className={`sidebar-nav-link ${isActive ? 'active' : ''}`}
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
                                                            isPathActive(child.path) ? 'active' : ''
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
                            );
                        })}
                    </div>

                    {/* Quick Actions Section */}
                    <div className="nav-section">
                        <span className="nav-section-title">Quick Actions</span>
                        {quickActions.map((action) => (
                            <div key={action.id} className="sidebar-nav-item">
                                <button
                                    className={`sidebar-nav-link ${
                                        isPathActive(action.path) ? 'active' : ''
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
            </div>
        </aside>
    );
};

export default Sidebar;