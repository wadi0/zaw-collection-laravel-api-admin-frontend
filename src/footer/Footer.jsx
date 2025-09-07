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
  Shield
} from 'lucide-react';
import { useApp } from "../context/AppContext.jsx";
import logo1 from "../assets/logo.png";
import "./footer.scss";

const Footer = () => {
  const { isDarkMode } = useApp();
  const currentYear = new Date().getFullYear();
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const quickLinks = [
    { name: 'Dashboard', href: '/dashboard' },
    { name: 'Products', href: '/products' },
    { name: 'Orders', href: '/orders' },
    { name: 'Customers', href: '/customers' },
    { name: 'Analytics', href: '/analytics' },
    { name: 'Settings', href: '/settings' }
  ];

  const supportLinks = [
    { name: 'Help Center', href: '/help' },
    { name: 'Documentation', href: '/docs' },
    { name: 'Contact Support', href: '/support' },
    { name: 'System Status', href: '/status' }
  ];

  const companyLinks = [
    { name: 'About Us', href: '/about' },
    { name: 'Privacy Policy', href: '/privacy' },
    { name: 'Terms of Service', href: '/terms' },
    { name: 'Contact', href: '/contact' }
  ];

  const socialLinks = [
    { name: 'Twitter', icon: Twitter, href: 'https://twitter.com', color: '#1DA1F2' },
    { name: 'Facebook', icon: Facebook, href: 'https://facebook.com', color: '#4267B2' },
    { name: 'Instagram', icon: Instagram, href: 'https://instagram.com', color: '#E4405F' },
    { name: 'LinkedIn', icon: Linkedin, href: 'https://linkedin.com', color: '#0077B5' },
    { name: 'GitHub', icon: Github, href: 'https://github.com', color: '#333333' }
  ];

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);
    
    setTimeout(() => {
      setIsSubscribed(true);
      setIsLoading(false);
      setEmail('');
      
      setTimeout(() => {
        setIsSubscribed(false);
      }, 3000);
    }, 1500);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className={`bootstrap-footer ${isDarkMode ? 'dark-mode' : 'light-mode'}`}>
      <button className="back-to-top" onClick={scrollToTop} title="Back to Top">
        <ArrowUp size={20} />
      </button>

      <div className="container">
        <div className="row">
          {/* Brand Section */}
          <div className="col">
            <div className="brand-section">
              <div className="brand-logo">
                <img src={logo1} alt="ZAW Collection" className="logo" />
                <div>
                  <h5 className="brand-name">ZAW Collection</h5>
                  <small className="brand-tagline">E-Commerce Excellence</small>
                </div>
              </div>
              <p className="description">
                Premium fashion and lifestyle products with seamless shopping experience. 
                Discover quality collections curated just for you.
              </p>
              <div className="contact-info">
                <div className="contact-item">
                  <Mail size={16} />
                  <a href="mailto:hello@zawcollection.com">hello@zawcollection.com</a>
                </div>
                <div className="contact-item">
                  <Phone size={16} />
                  <a href="tel:+8801234567890">+880 123 456 7890</a>
                </div>
                <div className="contact-item">
                  <MapPin size={16} />
                  <span>Chittagong, Bangladesh</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="col">
            <h6>Quick Access</h6>
            <ul>
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link to={link.href}>{link.name}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div className="col">
            <h6>Support</h6>
            <ul>
              {supportLinks.map((link) => (
                <li key={link.name}>
                  <Link to={link.href}>{link.name}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div className="col">
            <h6>Company</h6>
            <ul>
              {companyLinks.map((link) => (
                <li key={link.name}>
                  <Link to={link.href}>{link.name}</Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Newsletter */}
        <div className="newsletter">
          <div className="newsletter-content">
            <h6>Stay Updated</h6>
            <p>Get the latest updates and exclusive insights delivered to your inbox.</p>
            
            <form onSubmit={handleSubscribe} className="newsletter-form">
              <div className="input-group">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  disabled={isLoading || isSubscribed}
                />
                <button
                  type="submit"
                  disabled={isLoading || isSubscribed}
                  className={`btn ${isLoading ? 'loading' : ''} ${isSubscribed ? 'success' : ''}`}
                >
                  {isSubscribed ? (
                    <>
                      <CheckCircle size={16} />
                      Subscribed!
                    </>
                  ) : isLoading ? (
                    <>
                      <div className="spinner"></div>
                      Subscribing...
                    </>
                  ) : (
                    <>
                      <Send size={16} />
                      Subscribe
                    </>
                  )}
                </button>
              </div>
              <small className="note">
                <Shield size={12} />
                We respect your privacy. Unsubscribe anytime.
              </small>
            </form>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="footer-bottom">
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
                <social.icon size={18} />
              </a>
            ))}
          </div>

          <div className="copyright">
            <p>
              © {currentYear} ZAW Collection. Made with{' '}
              <Heart size={14} className="heart" />{' '}
              in Bangladesh.
            </p>
            <div className="links">
              <Link to="/changelog">v2.1.0</Link>
              <span>•</span>
              <Link to="/status">
                <div className="status-dot"></div>
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



