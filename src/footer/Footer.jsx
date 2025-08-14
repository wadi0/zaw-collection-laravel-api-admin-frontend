import React from 'react';
import { Link } from 'react-router-dom';
import {
  Heart,
  Mail,
  Phone,
  MapPin,
  Twitter,
  Facebook,
  Instagram,
  Linkedin,
  Github,
  ExternalLink
} from 'lucide-react';
import { useApp } from "../context/AppContext.jsx";
import './footer.scss';

const Footer = ({ sidebarOpen, isMobile }) => {
  const { isDarkMode } = useApp();
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { name: 'Dashboard', href: '/admin/dashboard' },
    { name: 'Products', href: '/admin/products' },
    { name: 'Orders', href: '/admin/orders' },
    { name: 'Customers', href: '/admin/customers' },
    { name: 'Analytics', href: '/admin/analytics/sales' },
    { name: 'Settings', href: '/admin/settings' }
  ];

  const supportLinks = [
    { name: 'Help Center', href: '/admin/help' },
    { name: 'Documentation', href: '/admin/docs' },
    { name: 'API Reference', href: '/admin/api' },
    { name: 'Contact Support', href: '/admin/support' },
    { name: 'System Status', href: '/admin/status' },
    { name: 'Release Notes', href: '/admin/releases' }
  ];

  const legalLinks = [
    { name: 'Privacy Policy', href: '/privacy' },
    { name: 'Terms of Service', href: '/terms' },
    { name: 'Cookie Policy', href: '/cookies' },
    { name: 'GDPR Compliance', href: '/gdpr' }
  ];

  const socialLinks = [
    { name: 'Twitter', icon: Twitter, href: 'https://twitter.com' },
    { name: 'Facebook', icon: Facebook, href: 'https://facebook.com' },
    { name: 'Instagram', icon: Instagram, href: 'https://instagram.com' },
    { name: 'LinkedIn', icon: Linkedin, href: 'https://linkedin.com' },
    { name: 'GitHub', icon: Github, href: 'https://github.com' }
  ];

  return (
    <footer className={`admin-footer ${isDarkMode ? 'dark-mode' : ''} ${!isMobile && sidebarOpen ? 'with-sidebar' : ''}`}>
      <div className="footer-container">
        {/* Main Footer Content */}
        <div className="footer-main">
          {/* Brand Section */}
          <div className="footer-brand">
            <div className="footer-logo">
              <div className="logo">A</div>
              <span className="brand-text">Admin Panel</span>
            </div>
            <p className="footer-description">
              A powerful and intuitive admin dashboard for managing your business operations efficiently.
              Built with modern technologies and best practices.
            </p>

            {/* Contact Info */}
            <div className="contact-info">
              <div className="contact-item">
                <Mail size={16} />
                <span>admin@yourcompany.com</span>
              </div>
              <div className="contact-item">
                <Phone size={16} />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="contact-item">
                <MapPin size={16} />
                <span>123 Business St, City, ST 12345</span>
              </div>
            </div>

            {/* Social Links */}
            <div className="social-links">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-link"
                  title={social.name}
                >
                  <social.icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="footer-links">
            <h3>Quick Links</h3>
            <ul>
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link to={link.href} className="footer-link">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div className="footer-links">
            <h3>Support</h3>
            <ul>
              {supportLinks.map((link) => (
                <li key={link.name}>
                  <Link to={link.href} className="footer-link">
                    {link.name}
                    <ExternalLink size={12} />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div className="footer-links">
            <h3>Legal</h3>
            <ul>
              {legalLinks.map((link) => (
                <li key={link.name}>
                  <Link to={link.href} className="footer-link">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter Signup */}
          <div className="footer-newsletter">
            <h3>Stay Updated</h3>
            <p>Subscribe to get the latest updates and feature announcements.</p>
            <div className="newsletter-form">
              <input
                type="email"
                placeholder="Enter your email"
                className="newsletter-input"
              />
              <button className="newsletter-btn">
                Subscribe
              </button>
            </div>
            <p className="newsletter-note">
              We respect your privacy. Unsubscribe at any time.
            </p>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="footer-bottom">
          <div className="footer-bottom-content">
            <div className="copyright">
              <p>
                © {currentYear} Admin Panel. Made with{' '}
                <Heart size={16} className="heart-icon" />{' '}
                by Your Company.
              </p>
            </div>

            <div className="footer-bottom-links">
              <span>Version 2.1.0</span>
              <span>•</span>
              <a href="/admin/changelog" className="version-link">
                What's New
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;