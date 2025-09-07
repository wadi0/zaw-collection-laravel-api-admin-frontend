import React, {useEffect, useState} from 'react';
import {Link, useLocation, useNavigate} from 'react-router-dom';
import {
    Home, Package, ShoppingCart, Users, BarChart3,
    Tag, Truck, Bell, Search, PanelLeft, PanelLeftClose, X, ChevronDown, LogOut, User, Sun, Moon, Menu, TrendingUp
} from 'lucide-react';
import './navbar.scss';
import {useApp} from "../context/AppContext.jsx";
import path from "../routes/path.jsx";
import logo1 from "../assets/logo.png";

const Navbar = ({onToggleSidebar, sidebarVisible}) => {
    const [mobileOpen, setMobileOpen] = useState(false);
    const [dropdown, setDropdown] = useState(null);
    const [mobileDropdown, setMobileDropdown] = useState(null);
    const [profile, setProfile] = useState(false);
    const [notifications, setNotifications] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false);
    const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
    const [searchValue, setSearchValue] = useState('');
    const [mobileSearchValue, setMobileSearchValue] = useState('');

    const navigate = useNavigate();
    const location = useLocation();
    const {isDarkMode, toggleDarkMode, logout, user} = useApp();

    // Helper function to get user initials
    const getUserInitials = (user) => {
        if (!user) return 'U';
        
        if (user.name) {
            return user.name
                .split(' ')
                .map(word => word.charAt(0))
                .join('')
                .toUpperCase()
                .slice(0, 2);
        }
        
        if (user.email) {
            return user.email.charAt(0).toUpperCase();
        }
        
        return 'U';
    };

    // Helper function to get display name
    const getDisplayName = (user) => {
        if (!user) return 'User';
        return user.name || user.username || 'User';
    };

    // Helper function to get display email
    const getDisplayEmail = (user) => {
        if (!user) return 'user@example.com';
        return user.email || 'No email provided';
    };

    // Helper function to normalize paths for comparison
    const normalizePath = (pathStr) => {
        if (!pathStr) return '';
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

        // Exact match first
        if (currentPath === targetPath) return true;

        // Handle nested paths
        if (currentPath.startsWith(targetPath + '/')) return true;

        // Special handling for dashboard
        if (targetPath === '/dashboard' && currentPath === '/dashboard') return true;
        if (href === '/dashboard' && currentPath === '/dashboard') return true;
        if (targetPath === '/admin/dashboard' && currentPath === '/dashboard') return true;
        if (href === '/admin/dashboard' && currentPath === '/dashboard') return true;

        // Handle admin routes specifically
        if (targetPath.includes('/admin/')) {
            return currentPath === targetPath || currentPath.startsWith(targetPath + '/');
        }

        // For relative paths
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

    // Helper function to check if any dropdown item is active
    const isDropdownActive = (dropdownItems) => {
        return dropdownItems.some(item => isPathActive(item.href));
    };

    const notificationData = [
        {
            id: 1,
            type: 'info',
            title: 'New Order Received',
            message: 'Order #12345 has been placed by John Doe',
            time: '5 min ago',
            icon: ShoppingCart
        },
        {
            id: 2,
            type: 'success',
            title: 'Payment Confirmed',
            message: 'Payment of $299.00 has been confirmed',
            time: '10 min ago',
            icon: Package
        },
        {
            id: 3,
            type: 'warning',
            title: 'Low Stock Alert',
            message: 'Product "iPhone 15" is running low on stock',
            time: '1 hour ago',
            icon: Bell
        }
    ];

    const handleDropdownToggle = (itemName, e) => {
        e.stopPropagation();
        setDropdown(dropdown === itemName ? null : itemName);
        if (dropdown !== itemName) {
            setProfile(false);
            setNotifications(false);
            setMobileSearchOpen(false);
        }
    };

    const handleMobileDropdownToggle = (itemName) => {
        setMobileDropdown(mobileDropdown === itemName ? null : itemName);
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (!event.target.closest('.nav-item') && !event.target.closest('.submenu-dropdown')) {
                setDropdown(null);
            }
            if (!event.target.closest('.profile-panel')) {
                setProfile(false);
            }
            if (!event.target.closest('.notification-panel')) {
                setNotifications(false);
            }
            if (!event.target.closest('.mobile-search-panel') && !event.target.closest('.search-trigger')) {
                setMobileSearchOpen(false);
            }
        };
        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, []);

    useEffect(() => {
        setDropdown(null);
        setMobileDropdown(null);
        setMobileOpen(false);
        setProfile(false);
        setNotifications(false);
        setSearchOpen(false);
        setMobileSearchOpen(false);
    }, [location.pathname]);

    const navItems = [
        {
            name: 'Dashboard',
            icon: Home,
            href: '/dashboard',
        },
        {
            name: 'Products',
            icon: Package,
            dropdown: [
                {name: 'All Products', href: `/${path.product}`},
                {name: 'Categories', href: `/${path.categories}`}
            ]
        },
        {
            name: 'Orders',
            icon: ShoppingCart,
            dropdown: [
                {name: 'All Orders', href: `/${path.orders}`},
                {name: 'Pending', href: `/${path.orders}/pending`},
                {name: 'Shipped', href: `/${path.orders}/shipped`}
            ]
        },
        {
            name: 'Customers',
            icon: Users,
            href: '/admin/customers',
        },
        {
            name: 'Reports',
            icon: TrendingUp,
            dropdown: [
                {name: 'Sales Report', href: '/admin/reports/sales'},
                {name: 'Analytics', href: '/admin/reports/analytics'},
                {name: 'Export Data', href: '/admin/reports/export'},
            ]
        },
        {
            name: 'Shipping',
            icon: Truck,
            href: '/admin/shipping',
        }
    ];

    const handleLinkClick = (path) => {
        setDropdown(null);
        setMobileDropdown(null);
        setMobileOpen(false);
        setSearchOpen(false);
        setMobileSearchOpen(false);
        setProfile(false);
        setNotifications(false);
    };

    const handleSearchToggle = () => {
        setSearchOpen(!searchOpen);
        if (!searchOpen) {
            setDropdown(null);
            setProfile(false);
            setNotifications(false);
            setMobileSearchOpen(false);
        }
    };

    const handleSearchClose = () => {
        setSearchOpen(false);
        setSearchValue('');
    };

    const handleMobileSearchToggle = () => {
        setMobileSearchOpen(!mobileSearchOpen);
        if (!mobileSearchOpen) {
            setProfile(false);
            setNotifications(false);
            setMobileOpen(false);
            setDropdown(null);
        }
    };

    const handleMobileSearchClose = () => {
        setMobileSearchOpen(false);
        setMobileSearchValue('');
    };

    const handleMobileSearch = () => {
        console.log('Mobile Search:', mobileSearchValue);
        handleMobileSearchClose();
    };

    const handleProfileToggle = () => {
        setProfile(!profile);
        if (!profile) {
            setNotifications(false);
            setDropdown(null);
            setMobileSearchOpen(false);
        }
    };

    const handleNotificationToggle = () => {
        setNotifications(!notifications);
        if (!notifications) {
            setProfile(false);
            setDropdown(null);
            setMobileSearchOpen(false);
        }
    };

    const handleMobileMenuToggle = () => {
        setMobileOpen(!mobileOpen);
        if (!mobileOpen) {
            setProfile(false);
            setNotifications(false);
            setDropdown(null);
            setMobileDropdown(null);
            setMobileSearchOpen(false);
        }
    };

    const handleSidebarToggle = () => {
        onToggleSidebar();
        // Scroll to top when sidebar is opened
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleLogout = () => {
        logout();
        navigate(path.signin);
    };

    return (
        <nav className={`custom-navbar ${isDarkMode ? 'theme-dark' : 'theme-light'}`}>
            <div className="navbar-wrapper">
                <div className="navbar-start">
                    <button
                        onClick={handleSidebarToggle}
                        className="sidebar-toggle-btn"
                        title="Toggle Sidebar"
                    >
                        {sidebarVisible ? <PanelLeftClose size={20}/> : <PanelLeft size={20}/>}
                    </button>
                    <Link to={path.home} className="brand-logo">
                        <img src={logo1} className="navbar-logo" alt="Logo" />
                    </Link>
                </div>

                {searchOpen ? (
                    <div className="search-bar-expanded">
                        <div className="search-field-wrapper">
                            <input
                                type="text"
                                placeholder="Search anything..."
                                className="search-field-input"
                                value={searchValue}
                                onChange={(e) => setSearchValue(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && console.log('Search:', searchValue)}
                                autoFocus
                            />
                            <button
                                onClick={() => console.log('Search:', searchValue)}
                                className="search-submit-button"
                                title="Search"
                            >
                                <Search size={16}/>
                            </button>
                            <button
                                onClick={handleSearchClose}
                                className="search-close-button"
                                title="Close Search"
                            >
                                <X size={16}/>
                            </button>
                        </div>
                    </div>
                ) : (
                    <ul className="navigation-menu">
                        {navItems.map((item) => (
                            <li key={item.name} className="menu-item">
                                {item.dropdown ? (
                                    <>
                                        <button
                                            onClick={(e) => handleDropdownToggle(item.name, e)}
                                            className={`menu-link ${isDropdownActive(item.dropdown) ? 'is-active' : ''} ${dropdown === item.name ? 'dropdown-expanded' : ''}`}
                                        >
                                            <item.icon size={18}/>
                                            <span>{item.name}</span>
                                            <ChevronDown size={12} className="dropdown-indicator"/>
                                        </button>
                                        <div
                                            className={`submenu-dropdown ${dropdown === item.name ? 'is-visible' : ''}`}>
                                            {item.dropdown.map((subItem) => (
                                                <Link
                                                    key={subItem.name}
                                                    to={subItem.href}
                                                    className={`submenu-link ${isPathActive(subItem.href) ? 'is-active' : ''}`}
                                                    onClick={() => handleLinkClick(subItem.href)}
                                                >
                                                    {subItem.name}
                                                </Link>
                                            ))}
                                        </div>
                                    </>
                                ) : (
                                    <Link
                                        to={item.href}
                                        className={`menu-link ${isPathActive(item.href) ? 'is-active' : ''}`}
                                        onClick={handleLinkClick}
                                    >
                                        <item.icon size={18}/>
                                        <span>{item.name}</span>
                                    </Link>
                                )}
                            </li>
                        ))}
                    </ul>
                )}

                <div className="navbar-end">
                    {!searchOpen && !mobileSearchOpen && (
                        <button
                            onClick={window.innerWidth <= 1024 ? handleMobileSearchToggle : handleSearchToggle}
                            className="action-button search-trigger"
                            title="Open Search"
                        >
                            <Search size={18}/>
                        </button>
                    )}

                    <button
                        onClick={toggleDarkMode}
                        className="action-button theme-switcher"
                        title={isDarkMode ? "Light Mode" : "Dark Mode"}
                    >
                        {isDarkMode ? <Sun size={18}/> : <Moon size={18}/>}
                    </button>

                    <div className={`notification-panel ${notifications ? 'is-open' : ''}`}>
                        <button
                            onClick={handleNotificationToggle}
                            className={`action-button notification-trigger ${notifications ? 'is-active' : ''}`}
                            title="Notifications"
                        >
                            <Bell size={18}/>
                            <span className="notification-counter">3</span>
                        </button>
                        {notifications && (
                            <div className={`notification-popup ${notifications ? 'is-visible' : ''}`}>
                                <div className="notification-header">
                                    <h3>Notifications</h3>
                                </div>
                                <div className="notification-list">
                                    {notificationData.map((notification) => (
                                        <div key={notification.id} className="notification-item">
                                            <div className={`notification-icon status-${notification.type}`}>
                                                <notification.icon size={16}/>
                                            </div>
                                            <div className="notification-content">
                                                <p className="notification-title">{notification.title}</p>
                                                <p className="notification-message">{notification.message}</p>
                                                <p className="notification-time">{notification.time}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="notification-footer">
                                    <a href="#" className="view-all-link">View All Notifications</a>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className={`profile-panel ${profile ? 'is-open' : ''}`}>
                        <button
                            onClick={handleProfileToggle}
                            className={`profile-trigger ${profile ? 'is-active' : ''}`}
                            title="Profile Menu"
                        >
                            <div className="user-avatar">{getUserInitials(user)}</div>
                        </button>
                        {profile && (
                            <div className={`profile-popup ${profile ? 'is-visible' : ''}`}>
                                <div className="profile-info">
                                    <p className="user-name">{getDisplayName(user)}</p>
                                    <p className="user-email">{getDisplayEmail(user)}</p>
                                </div>
                                <Link to="/admin/profile" className="profile-link" onClick={handleLinkClick}>
                                    <User size={16}/>
                                    Profile
                                </Link>
                                <button className="profile-link logout-button" onClick={handleLogout}>
                                    <LogOut size={16}/>
                                    Sign Out
                                </button>
                            </div>
                        )}
                    </div>

                    <button
                        onClick={handleMobileMenuToggle}
                        className="mobile-toggle"
                        title="Toggle Menu"
                    >
                        {mobileOpen ? <X size={20}/> : <Menu size={20}/>}
                    </button>
                </div>
            </div>

            {mobileSearchOpen && (
                <div className={`mobile-search-panel ${mobileSearchOpen ? 'is-visible' : ''}`}>
                    <div className="mobile-search-wrapper">
                        <input
                            type="text"
                            placeholder="Search anything..."
                            className="mobile-search-field"
                            value={mobileSearchValue}
                            onChange={(e) => setMobileSearchValue(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleMobileSearch()}
                            autoFocus
                        />
                        <button
                            onClick={handleMobileSearch}
                            className="mobile-search-button"
                            title="Search"
                        >
                            <Search size={14}/>
                        </button>
                        <button
                            onClick={handleMobileSearchClose}
                            className="mobile-search-close"
                            title="Close Search"
                        >
                            <X size={14}/>
                        </button>
                    </div>
                </div>
            )}

            {mobileOpen && (
                <div className={`mobile-navigation ${isDarkMode ? 'theme-dark' : 'theme-light'}`}>
                    {navItems.map((item) => (
                        <div key={item.name} className="mobile-menu-item">
                            {item.dropdown ? (
                                <>
                                    <button
                                        onClick={() => handleMobileDropdownToggle(item.name)}
                                        className={`mobile-menu-link ${isDropdownActive(item.dropdown) ? 'is-active' : ''}`}
                                    >
                                        <div className="mobile-menu-content">
                                            <item.icon size={18}/>
                                            {item.name}
                                        </div>
                                        <ChevronDown
                                            size={16}
                                            className={`mobile-dropdown-indicator ${mobileDropdown === item.name ? 'is-expanded' : ''}`}
                                        />
                                    </button>
                                    <div
                                        className={`mobile-submenu ${mobileDropdown === item.name ? 'is-visible' : ''}`}>
                                        {item.dropdown.map((subItem) => (
                                            <Link
                                                key={subItem.name}
                                                to={subItem.href}
                                                className={`mobile-submenu-link ${isPathActive(subItem.href) ? 'is-active' : ''}`}
                                                onClick={() => handleLinkClick(subItem.href)}
                                            >
                                                {subItem.name}
                                            </Link>
                                        ))}
                                    </div>
                                </>
                            ) : (
                                <Link
                                    to={item.href}
                                    className={`mobile-menu-link ${isPathActive(item.href) ? 'is-active' : ''}`}
                                    onClick={() => handleLinkClick(item.href)}
                                >
                                    <item.icon size={18}/>
                                    {item.name}
                                </Link>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </nav>
    );
};

export default Navbar;