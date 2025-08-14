import React, {useEffect, useState} from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Home, Package, ShoppingCart, Users, BarChart3,
  Tag, Truck, Bell, Search, Menu, X, ChevronDown, LogOut, User, Sun, Moon, PanelRight
} from 'lucide-react';
import './navbar.scss';
import {useApp} from "../context/AppContext.jsx";

const Navbar = ({ setSidebarOpen, sidebarOpen, isMobile }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdown, setDropdown] = useState(null);
  const [profile, setProfile] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');

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
    setSearchOpen(false);
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
    setSearchOpen(false);
  };

  const handleSearchToggle = () => {
    setSearchOpen(!searchOpen);
    if (!searchOpen) {
      setDropdown(null);
      setProfile(false);
    }
  };

  const handleSearchClose = () => {
    setSearchOpen(false);
    setSearchValue('');
  };

  return (
    <nav className={`navbar ${isDarkMode ? 'dark-mode' : ''}`}>
      {/* Sidebar Toggle - একদম left এ fixed position */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="sidebar-toggle-fixed"
        title="Toggle Sidebar"
      >
        {sidebarOpen ? <PanelRight size={18} color='#3b82f6' /> : <PanelRight size={18} />}
      </button>

      <div className="container">
        {/* Brand - Logo center করার জন্য */}
        <div className="brand">
          <Link to="/admin/dashboard" className="brand-link">
            <div className="logo">A</div>
            <span className="brand-text">Admin Panel</span>
          </Link>
        </div>

        {/* Search Expanded View - শুধু menu এর জায়গায় */}
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
          /* Desktop Menu */
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
        )}

        {/* Actions - right side এ থাকবে */}
        <div className="actions">
          {/* Search Toggle Button */}
          <button
            onClick={handleSearchToggle}
            className="search-toggle"
            title={searchOpen ? "Close Search" : "Open Search"}
          >
            {searchOpen ? null : <Search size={18} />}
          </button>

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
              {/*<ChevronDown size={16} color='#9ca3af' />*/}
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
                  console.log('Logging out...');
                }}>
                  <LogOut size={16} />
                  Sign Out
                </button>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle - শুধু navbar menu এর জন্য */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="mobile-menu-toggle"
            title="Toggle Menu"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="mobile-menu">
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
                          onClick={() => handleLinkClick(subItem.href)}
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