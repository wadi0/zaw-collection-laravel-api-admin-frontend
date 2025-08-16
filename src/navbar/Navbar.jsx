import React, {useEffect, useState} from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
    Home, Package, ShoppingCart, Users, BarChart3,
    Tag, Truck, Bell, Search, PanelLeft, PanelLeftClose, X, ChevronDown, LogOut, User, Sun, Moon, Menu
} from 'lucide-react';
import './navbar.scss';
import {useApp} from "../context/AppContext.jsx";

const Navbar = ({ onToggleSidebar, sidebarVisible }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdown, setDropdown] = useState(null);
  const [mobileDropdown, setMobileDropdown] = useState(null); // Separate state for mobile
  const [profile, setProfile] = useState(false);
  const [notifications, setNotifications] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [mobileSearchValue, setMobileSearchValue] = useState('');

  const location = useLocation();
  const { isDarkMode, toggleDarkMode } = useApp();

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
      if (!event.target.closest('.nav-item') && !event.target.closest('.dropdown-menu')) {
        setDropdown(null);
      }
      if (!event.target.closest('.profile-dropdown')) {
        setProfile(false);
      }
      if (!event.target.closest('.notification-dropdown')) {
        setNotifications(false);
      }
      if (!event.target.closest('.mobile-search-dropdown') && !event.target.closest('.search-toggle')) {
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
      href: '/admin/dashboard',
      active: location.pathname === '/admin/dashboard'
    },
    {
      name: 'Products',
      icon: Package,
      dropdown: [
        { name: 'All Products', href: '/admin/products' },
        { name: 'Add Product', href: '/admin/products/add' },
        { name: 'Categories', href: '/admin/categories' }
      ]
    },
    {
      name: 'Orders',
      icon: ShoppingCart,
      dropdown: [
        { name: 'All Orders', href: '/admin/orders' },
        { name: 'Pending', href: '/admin/orders/pending' },
        { name: 'Shipped', href: '/admin/orders/shipped' }
      ]
    },
    {
      name: 'Customers',
      icon: Users,
      href: '/admin/customers',
      active: location.pathname === '/admin/customers'
    },
    {
      name: 'Analytics',
      icon: BarChart3,
      dropdown: [
        { name: 'Sales Report', href: '/admin/analytics/sales' },
        { name: 'Product Analytics', href: '/admin/analytics/products' }
      ]
    },
    {
      name: 'Marketing',
      icon: Tag,
      dropdown: [
        { name: 'Coupons', href: '/admin/marketing/coupons' },
        { name: 'Campaigns', href: '/admin/marketing/campaigns' }
      ]
    },
    {
      name: 'Shipping',
      icon: Truck,
      href: '/admin/shipping',
      active: location.pathname === '/admin/shipping'
    }
  ];

  const isDropdownActive = (dropdown) => {
    return dropdown.some(item => location.pathname === item.href);
  };

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

  return (
    <nav className={`navbar ${isDarkMode ? 'dark-mode' : 'light-mode'}`}>
      <div className="container">
        <div className="navbar-left">
          <button
            onClick={onToggleSidebar}
            className="sidebar-toggle"
            title="Toggle Sidebar"
          >
            {/* Conditional sidebar icon - now it should work properly */}
            {sidebarVisible ? <PanelLeftClose size={20} /> : <PanelLeft size={20} />}
          </button>
          <Link to="/admin/dashboard" className="logo">
            <div className="logo-icon">A</div>
            <span className="logo-text">Admin Panel</span>
          </Link>
        </div>

        {searchOpen ? (
          <div className="search-expanded">
            <div className="search-input-container">
              <input
                type="text"
                placeholder="Search anything..."
                className="search-input-expanded"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && console.log('Search:', searchValue)}
                autoFocus
              />
              <button
                onClick={() => console.log('Search:', searchValue)}
                className="search-submit-btn"
                title="Search"
              >
                <Search size={16} />
              </button>
              <button
                onClick={handleSearchClose}
                className="search-close-btn"
                title="Close Search"
              >
                <X size={16} />
              </button>
            </div>
          </div>
        ) : (
          <ul className="nav-links">
            {navItems.map((item) => (
              <li key={item.name} className="nav-item">
                {item.dropdown ? (
                  <>
                    <button
                      onClick={(e) => handleDropdownToggle(item.name, e)}
                      className={`nav-link ${isDropdownActive(item.dropdown) ? 'active' : ''} ${dropdown === item.name ? 'dropdown-open' : ''}`}
                    >
                      <item.icon size={18} />
                      <span>{item.name}</span>
                      <ChevronDown size={12} className="dropdown-arrow" />
                    </button>
                    <div className={`dropdown-menu ${dropdown === item.name ? 'show' : ''}`}>
                      {item.dropdown.map((subItem) => (
                        <Link
                          key={subItem.name}
                          to={subItem.href}
                          className="dropdown-item"
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
                    className={`nav-link ${item.active ? 'active' : ''}`}
                    onClick={handleLinkClick}
                  >
                    <item.icon size={18} />
                    <span>{item.name}</span>
                  </Link>
                )}
              </li>
            ))}
          </ul>
        )}

        <div className="navbar-actions">
          {!searchOpen && !mobileSearchOpen && (
            <button
              onClick={window.innerWidth <= 1024 ? handleMobileSearchToggle : handleSearchToggle}
              className="action-btn search-toggle"
              title="Open Search"
            >
              <Search size={18} />
            </button>
          )}

          <button
            onClick={toggleDarkMode}
            className="action-btn theme-toggle"
            title={isDarkMode ? "Light Mode" : "Dark Mode"}
          >
            {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          <div className={`notification-dropdown ${notifications ? 'show' : ''}`}>
            <button
              onClick={handleNotificationToggle}
              className={`action-btn notification-btn ${notifications ? 'active' : ''}`}
              title="Notifications"
            >
              <Bell size={18} />
              <span className="notification-badge">3</span>
            </button>
            {notifications && (
              <div className={`notification-menu ${notifications ? 'show' : ''}`}>
                <div className="notification-header">
                  <h3>Notifications</h3>
                </div>
                <div className="notification-list">
                  {notificationData.map((notification) => (
                    <div key={notification.id} className="notification-item">
                      <div className={`notification-icon ${notification.type}`}>
                        <notification.icon size={16} />
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
                  <a href="#" className="view-all-btn">View All Notifications</a>
                </div>
              </div>
            )}
          </div>

          <div className={`profile-dropdown ${profile ? 'show' : ''}`}>
            <button
              onClick={handleProfileToggle}
              className={`profile-btn ${profile ? 'active' : ''}`}
              title="Profile Menu"
            >
              <div className="avatar">JD</div>
            </button>
            {profile && (
              <div className={`profile-menu ${profile ? 'show' : ''}`}>
                <div className="profile-info">
                  <p className="profile-name">John Doe</p>
                  <p className="profile-email">john@example.com</p>
                </div>
                <Link to="/admin/profile" className="profile-item" onClick={handleLinkClick}>
                  <User size={16} />
                  Profile
                </Link>
                <button className="profile-item logout" onClick={() => {
                  console.log('Logging out...');
                }}>
                  <LogOut size={16} />
                  Sign Out
                </button>
              </div>
            )}
          </div>

          <button
            onClick={handleMobileMenuToggle}
            className="mobile-menu-toggle"
            title="Toggle Menu"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {mobileSearchOpen && (
        <div className={`mobile-search-dropdown ${mobileSearchOpen ? 'show' : ''}`}>
          <div className="mobile-search-container">
            <input
              type="text"
              placeholder="Search anything..."
              className="mobile-search-input"
              value={mobileSearchValue}
              onChange={(e) => setMobileSearchValue(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleMobileSearch()}
              autoFocus
            />
            <button
              onClick={handleMobileSearch}
              className="mobile-search-btn"
              title="Search"
            >
              <Search size={14} />
            </button>
            <button
              onClick={handleMobileSearchClose}
              className="mobile-search-close"
              title="Close Search"
            >
              <X size={14} />
            </button>
          </div>
        </div>
      )}

      {mobileOpen && (
        <div className={`mobile-menu ${isDarkMode ? 'dark-mode' : 'light-mode'}`}>
          {navItems.map((item) => (
            <div key={item.name} className="mobile-nav-item">
              {item.dropdown ? (
                <>
                  <button
                    onClick={() => handleMobileDropdownToggle(item.name)}
                    className={`mobile-nav-link ${isDropdownActive(item.dropdown) ? 'active' : ''}`}
                  >
                    <div className="mobile-nav-content">
                      <item.icon size={18} />
                      {item.name}
                    </div>
                    <ChevronDown
                      size={16}
                      className={`mobile-dropdown-arrow ${mobileDropdown === item.name ? 'open' : ''}`}
                    />
                  </button>
                  <div className={`mobile-dropdown ${mobileDropdown === item.name ? 'show' : ''}`}>
                    {item.dropdown.map((subItem) => (
                      <Link
                        key={subItem.name}
                        to={subItem.href}
                        className="mobile-dropdown-item"
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
                  className={`mobile-nav-link ${item.active ? 'active' : ''}`}
                  onClick={() => handleLinkClick(item.href)}
                >
                  <item.icon size={18} />
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