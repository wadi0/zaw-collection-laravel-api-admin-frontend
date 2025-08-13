import React, { useState } from 'react';
import { 
  Home, Package, ShoppingCart, Users, BarChart3, 
  Tag, Truck, Bell, Search, Menu, X, ChevronDown, LogOut, User
} from 'lucide-react';

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdown, setDropdown] = useState(null);
  const [profile, setProfile] = useState(false);

  const navItems = [
    { name: 'Dashboard', icon: Home, href: '/', active: true },
    { 
      name: 'Products', 
      icon: Package, 
      dropdown: ['All Products', 'Add Product', 'Categories'] 
    },
    { 
      name: 'Orders', 
      icon: ShoppingCart, 
      dropdown: ['All Orders', 'Pending', 'Shipped'] 
    },
    { name: 'Customers', icon: Users, href: '/customers' },
    { 
      name: 'Analytics', 
      icon: BarChart3, 
      dropdown: ['Sales Report', 'Product Analytics'] 
    },
    { 
      name: 'Marketing', 
      icon: Tag, 
      dropdown: ['Coupons', 'Campaigns'] 
    },
    { name: 'Shipping', icon: Truck, href: '/shipping' }
  ];

  return (
    <>
      <style jsx>{`
        .navbar {
          background: white;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          position: sticky;
          top: 0;
          z-index: 50;
        }
        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 1rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          height: 4rem;
        }
        .brand {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        .logo {
          width: 2rem;
          height: 2rem;
          background: linear-gradient(45deg, #3b82f6, #8b5cf6);
          border-radius: 0.5rem;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: bold;
        }
        .nav-menu {
          display: none;
          gap: 0.5rem;
        }
        @media (min-width: 1024px) {
          .nav-menu { display: flex; }
        }
        .nav-item {
          position: relative;
        }
        .nav-link {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.25rem;
          padding: 0.75rem 0.5rem;
          border-radius: 0.5rem;
          font-size: 0.75rem;
          color: #6b7280;
          text-decoration: none;
          border: none;
          background: none;
          cursor: pointer;
          transition: all 0.2s;
          min-width: 4rem;
        }
        .nav-link:hover {
          background: #f3f4f6;
          color: #3b82f6;
          transform: translateY(-2px);
          box-shadow: 0 4px 8px rgba(0,0,0,0.1);
        }
        .nav-link.active, .nav-link.dropdown-open {
          background: #eff6ff;
          color: #3b82f6;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(59, 130, 246, 0.15);
        }
        .dropdown-menu {
          position: absolute;
          top: calc(100% + 0.5rem);
          left: 50%;
          transform: translateX(-50%);
          width: 12rem;
          background: white;
          border-radius: 0.5rem;
          box-shadow: 0 10px 25px rgba(0,0,0,0.15);
          border: 1px solid #e5e7eb;
          padding: 0.5rem 0;
          z-index: 50;
        }
        .dropdown-menu::before {
          content: '';
          position: absolute;
          top: -6px;
          left: 50%;
          transform: translateX(-50%);
          width: 12px;
          height: 12px;
          background: white;
          border: 1px solid #e5e7eb;
          border-bottom: none;
          border-right: none;
          transform: translateX(-50%) rotate(45deg);
        }
        .dropdown-item {
          display: block;
          padding: 0.5rem 1rem;
          color: #6b7280;
          text-decoration: none;
          font-size: 0.875rem;
          transition: all 0.2s;
          border-radius: 0.375rem;
          margin: 0 0.25rem;
        }
        .dropdown-item:hover {
          background: #f3f4f6;
          color: #3b82f6;
          transform: translateX(4px);
        }
        .actions {
          display: flex;
          align-items: center;
          gap: 1rem;
        }
        .search {
          display: none;
          position: relative;
        }
        @media (min-width: 768px) {
          .search { display: block; }
        }
        .search-input {
          padding: 0.5rem 0.75rem 0.5rem 2.25rem;
          width: 12rem;
          border: 1px solid #d1d5db;
          border-radius: 0.5rem;
          outline: none;
          font-size: 0.875rem;
        }
        .search-input:focus {
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }
        .search-icon {
          position: absolute;
          left: 0.75rem;
          top: 50%;
          transform: translateY(-50%);
          width: 1rem;
          height: 1rem;
          color: #9ca3af;
        }
        .notification {
          position: relative;
          padding: 0.5rem;
          background: none;
          border: none;
          border-radius: 0.5rem;
          cursor: pointer;
          color: #6b7280;
          transition: all 0.2s;
        }
        .notification:hover {
          background: #f3f4f6;
          color: #3b82f6;
        }
        .badge {
          position: absolute;
          top: -0.25rem;
          right: -0.25rem;
          width: 1rem;
          height: 1rem;
          background: #ef4444;
          color: white;
          border-radius: 50%;
          font-size: 0.75rem;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .profile {
          position: relative;
        }
        .profile-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem;
          background: none;
          border: none;
          border-radius: 0.5rem;
          cursor: pointer;
          transition: all 0.2s;
        }
        .profile-btn:hover {
          background: #f3f4f6;
        }
        .avatar {
          width: 2rem;
          height: 2rem;
          background: linear-gradient(45deg, #10b981, #3b82f6);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: 600;
          font-size: 0.875rem;
        }
        .profile-dropdown {
          position: absolute;
          right: 0;
          top: 100%;
          width: 12rem;
          background: white;
          border-radius: 0.5rem;
          box-shadow: 0 10px 25px rgba(0,0,0,0.15);
          border: 1px solid #e5e7eb;
          padding: 0.5rem 0;
          margin-top: 0.25rem;
          z-index: 50;
        }
        .profile-info {
          padding: 0.5rem 1rem;
          border-bottom: 1px solid #e5e7eb;
          margin-bottom: 0.5rem;
        }
        .profile-name {
          font-weight: 600;
          color: #111827;
          margin: 0;
        }
        .profile-email {
          font-size: 0.75rem;
          color: #6b7280;
          margin: 0;
        }
        .profile-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 1rem;
          color: #6b7280;
          text-decoration: none;
          font-size: 0.875rem;
          transition: all 0.2s;
        }
        .profile-item:hover {
          background: #f3f4f6;
          color: #3b82f6;
        }
        .profile-item.logout {
          color: #dc2626;
          border-top: 1px solid #e5e7eb;
          margin-top: 0.5rem;
          padding-top: 0.75rem;
        }
        .mobile-btn {
          display: block;
          padding: 0.5rem;
          background: none;
          border: none;
          color: #6b7280;
          cursor: pointer;
          border-radius: 0.5rem;
          transition: all 0.2s;
        }
        @media (min-width: 1024px) {
          .mobile-btn { display: none; }
        }
        .mobile-btn:hover {
          background: #f3f4f6;
          color: #3b82f6;
        }
        .mobile-menu {
          background: white;
          border-top: 1px solid #e5e7eb;
          padding: 1rem;
        }
        @media (min-width: 1024px) {
          .mobile-menu { display: none; }
        }
        .mobile-search {
          margin-bottom: 1rem;
        }
        @media (min-width: 768px) {
          .mobile-search { display: none; }
        }
        .mobile-nav-item {
          margin-bottom: 0.5rem;
        }
        .mobile-nav-link {
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: 100%;
          padding: 0.75rem;
          background: none;
          border: none;
          border-radius: 0.5rem;
          color: #6b7280;
          text-decoration: none;
          cursor: pointer;
          transition: all 0.2s;
        }
        .mobile-nav-link:hover {
          background: #f3f4f6;
          color: #3b82f6;
        }
        .mobile-nav-link.active {
          background: #eff6ff;
          color: #3b82f6;
        }
        .mobile-dropdown {
          margin-left: 2rem;
          margin-top: 0.5rem;
        }
        .mobile-dropdown-item {
          display: block;
          padding: 0.5rem 0.75rem;
          color: #6b7280;
          text-decoration: none;
          border-radius: 0.375rem;
          margin-bottom: 0.25rem;
          transition: all 0.2s;
        }
        .mobile-dropdown-item:hover {
          background: #f3f4f6;
          color: #3b82f6;
        }
      `}</style>

      <nav className="navbar">
        <div className="container">
          {/* Brand */}
          <div className="brand">
            <div className="logo">A</div>
            <span style={{fontWeight: 'bold', fontSize: '1.25rem'}}>Admin Panel</span>
          </div>

          {/* Desktop Menu */}
          <div className="nav-menu">
            {navItems.map((item) => (
              <div key={item.name} className="nav-item">
                {item.dropdown ? (
                  <>
                    <button
                      onClick={() => setDropdown(dropdown === item.name ? null : item.name)}
                      className={`nav-link ${item.active ? 'active' : ''} ${dropdown === item.name ? 'dropdown-open' : ''}`}
                    >
                      <item.icon size={20} />
                      <div style={{display: 'flex', alignItems: 'center', gap: '0.25rem'}}>
                        <span>{item.name}</span>
                        <ChevronDown 
                          size={12} 
                          style={{
                            transform: dropdown === item.name ? 'rotate(180deg)' : 'rotate(0deg)',
                            transition: 'transform 0.2s ease'
                          }} 
                        />
                      </div>
                    </button>
                    {dropdown === item.name && (
                      <div className="dropdown-menu">
                        {item.dropdown.map((subItem) => (
                          <a key={subItem} href="#" className="dropdown-item">
                            {subItem}
                          </a>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <a href={item.href} className={`nav-link ${item.active ? 'active' : ''}`}>
                    <item.icon size={20} />
                    <span>{item.name}</span>
                  </a>
                )}
              </div>
            ))}
          </div>

          {/* Actions */}
          <div className="actions">
            {/* Search */}
            <div className="search">
              <Search className="search-icon" />
              <input type="text" placeholder="Search..." className="search-input" />
            </div>

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
                  <a href="#" className="profile-item">
                    <User size={16} />
                    Profile
                  </a>
                  <a href="#" className="profile-item logout">
                    <LogOut size={16} />
                    Sign Out
                  </a>
                </div>
              )}
            </div>

            {/* Mobile Toggle */}
            <button onClick={() => setMobileOpen(!mobileOpen)} className="mobile-btn">
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="mobile-menu">
            {/* Mobile Search */}
            <div className="mobile-search">
              <div style={{position: 'relative'}}>
                <Search style={{position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af'}} size={16} />
                <input 
                  type="text" 
                  placeholder="Search..." 
                  style={{width: '100%', padding: '0.75rem 0.75rem 0.75rem 2.25rem', border: '1px solid #d1d5db', borderRadius: '0.5rem', outline: 'none'}}
                />
              </div>
            </div>

            {/* Mobile Nav Items */}
            {navItems.map((item) => (
              <div key={item.name} className="mobile-nav-item">
                {item.dropdown ? (
                  <>
                    <button
                      onClick={() => setDropdown(dropdown === item.name ? null : item.name)}
                      className={`mobile-nav-link ${item.active ? 'active' : ''}`}
                    >
                      <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
                        <item.icon size={18} />
                        {item.name}
                      </div>
                      <ChevronDown size={16} />
                    </button>
                    {dropdown === item.name && (
                      <div className="mobile-dropdown">
                        {item.dropdown.map((subItem) => (
                          <a key={subItem} href="#" className="mobile-dropdown-item">
                            {subItem}
                          </a>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <a href={item.href} className={`mobile-nav-link ${item.active ? 'active' : ''}`}>
                    <item.icon size={18} />
                    {item.name}
                  </a>
                )}
              </div>
            ))}
          </div>
        )}
      </nav>
    </>
  );
};

export default Navbar;