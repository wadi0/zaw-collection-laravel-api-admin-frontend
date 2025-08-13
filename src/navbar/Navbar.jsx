import React, {useEffect, useState} from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Home, Package, ShoppingCart, Users, BarChart3,
  Tag, Truck, Bell, Search, Menu, X, ChevronDown, LogOut, User, Sun, Moon
} from 'lucide-react';
import './navbar.scss';
import {useApp} from "../context/AppContext.jsx";

const Navbar = ({ setSidebarOpen, sidebarOpen, isMobile }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdown, setDropdown] = useState(null);
  const [profile, setProfile] = useState(false);

  // Get current location for active state checking
  const location = useLocation();

  // Use your existing context
  const { isDarkMode, toggleDarkMode } = useApp();

  // Debug: Check current location
  console.log('Current location:', location.pathname);

  const handleDropdownToggle = (itemName, e) => {
    e.stopPropagation();
    setDropdown(dropdown === itemName ? null : itemName);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.nav-item') && !event.target.closest('.dropdown-menu')) {
        setDropdown(null);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  // Close dropdowns when route changes
  useEffect(() => {
    setDropdown(null);
    setMobileOpen(false);
    setProfile(false);
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

  // Check if current path matches any dropdown item
  const isDropdownActive = (dropdown) => {
    return dropdown.some(item => location.pathname === item.href);
  };

  const handleLinkClick = (path) => {
    console.log('Navigating to:', path);
    setDropdown(null);
    setMobileOpen(false);
  };

  return (
    <nav className={`navbar ${isDarkMode ? 'dark-mode' : ''}`}>
      <div className="container">
        {/* Brand */}
        <div className="brand">
          <Link to="/admin/dashboard" className="brand-link" style={{display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none'}}>
            <div className="logo">A</div>
            <span className="brand-text">Admin Panel</span>
          </Link>
        </div>

        {/* Desktop Menu */}
        <div className="nav-menu">
          {navItems.map((item) => (
            <div key={item.name} className="nav-item">
              {item.dropdown ? (
                <>
                  <button
                    onClick={(e) => handleDropdownToggle(item.name, e)}
                    className={`nav-link ${isDropdownActive(item.dropdown) ? 'active' : ''} ${dropdown === item.name ? 'dropdown-open' : ''}`}
                  >
                    <item.icon size={20} />
                    <div className="nav-text">
                      <span>{item.name}</span>
                      <ChevronDown size={12} className="dropdown-arrow" />
                    </div>
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
                  <item.icon size={20} />
                  <span>{item.name}</span>
                </Link>
              )}
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="actions">
          {/* Sidebar Toggle for Desktop */}
          {!isMobile && (
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="sidebar-toggle"
              style={{
                padding: '0.5rem',
                background: 'none',
                border: 'none',
                borderRadius: '0.5rem',
                cursor: 'pointer',
                color: isDarkMode ? '#d1d5db' : '#6b7280'
              }}
            >
              <Menu size={20} />
            </button>
          )}

          {/* Search */}
          <div className="search">
            <Search className="search-icon" />
            <input type="text" placeholder="Search..." className="search-input" />
          </div>

          {/* Theme Toggle */}
          <button onClick={toggleDarkMode} className="theme-toggle">
            {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {/* Notifications */}
          <button className="notification">
            <Bell size={20} />
            <span className="badge">3</span>
          </button>

          {/* Profile */}
          <div className="profile">
            <button onClick={() => setProfile(!profile)} className="profile-btn">
              <div className="avatar">JD</div>
              <ChevronDown size={16} />
            </button>
            {profile && (
              <div className="profile-dropdown">
                <div className="profile-info">
                  <p className="profile-name">John Doe</p>
                  <p className="profile-email">john@example.com</p>
                </div>
                <Link to="/admin/profile" className="profile-item" onClick={handleLinkClick}>
                  <User size={16} />
                  Profile
                </Link>
                <button className="profile-item logout" onClick={() => {
                  // Add your logout logic here
                  console.log('Logging out...');
                }}>
                  <LogOut size={16} />
                  Sign Out
                </button>
              </div>
            )}
          </div>

          {/* Mobile Toggle */}
          <button
            onClick={() => {
              if (isMobile) {
                setSidebarOpen(!sidebarOpen);
              } else {
                setMobileOpen(!mobileOpen);
              }
            }}
            className="mobile-btn"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="mobile-menu">
          {/* Mobile Search */}
          <div className="mobile-search">
            <div className="mobile-search-container">
              <Search className="search-icon" size={16} />
              <input type="text" placeholder="Search..." className="search-input" />
            </div>
          </div>

          {/* Mobile Nav Items */}
          {navItems.map((item) => (
            <div key={item.name} className="mobile-nav-item">
              {item.dropdown ? (
                <>
                  <button
                    onClick={() => setDropdown(dropdown === item.name ? null : item.name)}
                    className={`mobile-nav-link ${isDropdownActive(item.dropdown) ? 'active' : ''}`}
                  >
                    <div className="mobile-nav-content">
                      <item.icon size={18} />
                      {item.name}
                    </div>
                    <ChevronDown size={16} />
                  </button>
                  {dropdown === item.name && (
                    <div className="mobile-dropdown">
                      {item.dropdown.map((subItem) => (
                        <Link
                          key={subItem.name}
                          to={subItem.href}
                          className="mobile-dropdown-item"
                          onClick={handleLinkClick}
                        >
                          {subItem.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <Link
                  to={item.href}
                  className={`mobile-nav-link ${item.active ? 'active' : ''}`}
                  onClick={handleLinkClick}
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