import React, { useState } from 'react';
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
  ExternalLink,
  Send,
  CheckCircle,
  ArrowUp,
  Globe,
  Shield,
  Award,
  Users,
  Zap
} from 'lucide-react';
import { useApp } from "../context/AppContext.jsx";
import "./footer.scss";

const Footer = () => {
  const { isDarkMode } = useApp();
  const currentYear = new Date().getFullYear();
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const quickLinks = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: null },
    { name: 'Products', href: '/admin/products', icon: null },
    { name: 'Orders', href: '/admin/orders', icon: null },
    { name: 'Customers', href: '/admin/customers', icon: null },
    { name: 'Analytics', href: '/admin/analytics/sales', icon: null },
    { name: 'Settings', href: '/admin/settings', icon: null }
  ];

  const supportLinks = [
    { name: 'Help Center', href: '/admin/help', external: true },
    { name: 'Documentation', href: '/admin/docs', external: true },
    { name: 'API Reference', href: '/admin/api', external: true },
    { name: 'Contact Support', href: '/admin/support', external: false },
    { name: 'System Status', href: '/admin/status', external: true },
    { name: 'Release Notes', href: '/admin/releases', external: false }
  ];

  const companyLinks = [
    { name: 'About Us', href: '/about' },
    { name: 'Careers', href: '/careers' },
    { name: 'Privacy Policy', href: '/privacy' },
    { name: 'Terms of Service', href: '/terms' },
    { name: 'Cookie Policy', href: '/cookies' },
    { name: 'GDPR Compliance', href: '/gdpr' }
  ];

  const socialLinks = [
    {
      name: 'Twitter',
      icon: Twitter,
      href: 'https://twitter.com',
      color: '#1DA1F2'
    },
    {
      name: 'Facebook',
      icon: Facebook,
      href: 'https://facebook.com',
      color: '#4267B2'
    },
    {
      name: 'Instagram',
      icon: Instagram,
      href: 'https://instagram.com',
      color: '#E4405F'
    },
    {
      name: 'LinkedIn',
      icon: Linkedin,
      href: 'https://linkedin.com',
      color: '#0077B5'
    },
    {
      name: 'GitHub',
      icon: Github,
      href: 'https://github.com',
      color: '#333333'
    }
  ];

  const features = [
    { icon: Shield, text: 'Security First' },
    { icon: Zap, text: 'Lightning Fast' },
    { icon: Users, text: '24/7 Support' },
    { icon: Award, text: 'Award Winning' }
  ];

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      setIsSubscribed(true);
      setIsLoading(false);
      setEmail('');

      // Reset after 3 seconds
      setTimeout(() => {
        setIsSubscribed(false);
      }, 3000);
    }, 1500);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className={`modern-footer ${isDarkMode ? 'dark-mode' : 'light-mode'}`}>
      {/* Back to Top Button */}
      <button className="back-to-top" onClick={scrollToTop} title="Back to Top">
        <ArrowUp size={20} />
      </button>

      <div className="footer-container">
        {/* Features Banner */}
        <div className="features-banner">
          {features.map((feature, index) => (
            <div key={index} className="feature-item">
              <feature.icon size={24} />
              <span>{feature.text}</span>
            </div>
          ))}
        </div>

        {/* Main Footer Content */}
        <div className="footer-main">
          {/* Brand Section */}
          <div className="footer-brand">
            <div className="footer-logo">
              <div className="logo-icon">
                <Globe size={24} />
              </div>
              <div className="logo-text">
                <span className="brand-name">AdminPro</span>
                <span className="brand-tagline">Dashboard Excellence</span>
              </div>
            </div>

            <p className="footer-description">
              Empowering businesses with intelligent analytics, seamless operations,
              and data-driven insights. Transform your workflow with our cutting-edge admin platform.
            </p>

            {/* Stats */}
            <div className="footer-stats">
              <div className="stat-item">
                <span className="stat-number">50K+</span>
                <span className="stat-label">Active Users</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">99.9%</span>
                <span className="stat-label">Uptime</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">24/7</span>
                <span className="stat-label">Support</span>
              </div>
            </div>

            {/* Contact Info */}
            <div className="contact-info">
              <div className="contact-item">
                <Mail size={16} />
                <a href="mailto:hello@adminpro.com">hello@adminpro.com</a>
              </div>
              <div className="contact-item">
                <Phone size={16} />
                <a href="tel:+15551234567">+1 (555) 123-4567</a>
              </div>
              <div className="contact-item">
                <MapPin size={16} />
                <span>San Francisco, CA 94105</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="footer-links">
            <h3>Quick Access</h3>
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
            <h3>Resources</h3>
            <ul>
              {supportLinks.map((link) => (
                <li key={link.name}>
                  {link.external ? (
                    <a
                      href={link.href}
                      className="footer-link"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {link.name}
                      <ExternalLink size={12} />
                    </a>
                  ) : (
                    <Link to={link.href} className="footer-link">
                      {link.name}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div className="footer-links">
            <h3>Company</h3>
            <ul>
              {companyLinks.map((link) => (
                <li key={link.name}>
                  <Link to={link.href} className="footer-link">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Newsletter Section */}
        <div className="newsletter-section">
          <div className="newsletter-content">
            <div className="newsletter-header">
              <h3>Stay in the Loop</h3>
              <p>Get the latest updates, feature releases, and exclusive insights delivered to your inbox.</p>
            </div>

            <form className="newsletter-form" onSubmit={handleSubscribe}>
              <div className="input-group">
                <Mail size={18} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="newsletter-input"
                  required
                  disabled={isLoading || isSubscribed}
                />
                <button
                  type="submit"
                  className={`newsletter-btn ${isLoading ? 'loading' : ''} ${isSubscribed ? 'success' : ''}`}
                  disabled={isLoading || isSubscribed}
                >
                  {isSubscribed ? (
                    <>
                      <CheckCircle size={18} />
                      <span>Subscribed!</span>
                    </>
                  ) : isLoading ? (
                    <>
                      <div className="loading-spinner"></div>
                      <span>Subscribing...</span>
                    </>
                  ) : (
                    <>
                      <Send size={18} />
                      <span>Subscribe</span>
                    </>
                  )}
                </button>
              </div>

              <p className="newsletter-note">
                <Shield size={12} />
                We respect your privacy. Unsubscribe anytime with one click.
              </p>
            </form>
          </div>
        </div>

        {/* Social & Bottom Section */}
        <div className="footer-bottom">
          {/* Social Links */}
          <div className="social-section">
            <h4>Connect With Us</h4>
            <div className="social-links">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-link"
                  title={social.name}
                  style={{ '--social-color': social.color }}
                >
                  <social.icon size={20} />
                  <span>{social.name}</span>
                </a>
              ))}
            </div>
          </div>

          {/* Copyright & Links */}
          <div className="footer-copyright">
            <div className="copyright-text">
              <p>
                © {currentYear} AdminPro. Crafted with{' '}
                <Heart size={16} className="heart-icon" />{' '}
                in San Francisco.
              </p>
            </div>

            <div className="footer-meta">
              <span className="version-info">v2.1.0</span>
              <span className="separator">•</span>
              <Link to="/admin/changelog" className="version-link">
                What's New
              </Link>
              <span className="separator">•</span>
              <Link to="/admin/status" className="status-link">
                <div className="status-indicator"></div>
                All Systems Operational
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;