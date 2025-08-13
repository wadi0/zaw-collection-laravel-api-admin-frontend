import React from 'react';
import { useApp } from '../../context/AppContext.jsx';
import Dashboard from "../dashboard/Dashboard.jsx";

const Home = () => {
  // Context থেকে data নিন
  const { isDarkMode, theme, isLoggedIn } = useApp();

  // Demo products - এগুলো context থেকেও আনতে পারেন
  const products = [
    { id: 1, name: 'MacBook Pro', price: 1299, category: 'Electronics', image: 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=400&h=300&fit=crop' },
    { id: 2, name: 'iPhone 15', price: 999, category: 'Electronics', image: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400&h=300&fit=crop' },
    { id: 3, name: 'Nike Shoes', price: 150, category: 'Fashion', image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=300&fit=crop' }
  ];

  // Mobile detection
  const isMobile = window.innerWidth < 768;

  const t = isDarkMode ? theme.dark : theme.light;

  const handleNavigation = (page) => {
    if (page === 'auth') {
      window.location.href = '/signin';
    } else if (page === 'dashboard') {
      window.location.href = '/admin/dashboard';
    }
  };

  return (
    <div style={{ background: t.bg, minHeight: '100vh' }}>
      <section style={{
        background: t.gradient,
        color: 'white',
        padding: '4rem 1rem',
        textAlign: 'center'
      }}>
        <h1 style={{
          fontSize: isMobile ? '2rem' : '3rem',
          margin: '0 0 1rem',
          fontWeight: '800'
        }}>
          Modern E-Commerce Admin
        </h1>
        <p style={{
          fontSize: '1.1rem',
          margin: '0 0 2rem',
          opacity: 0.9
        }}>
          Manage your products and categories with ease
        </p>
        {!isLoggedIn && (
          <button
            onClick={() => handleNavigation('auth')}
            style={{
              background: 'white',
              color: t.primary,
              border: 'none',
              padding: '1rem 2rem',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '1rem',
              fontWeight: '600',
              transition: 'transform 0.2s ease',
            }}
            onMouseOver={(e) => e.target.style.transform = 'translateY(-2px)'}
            onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}
          >
            Get Started
          </button>
        )}
        {isLoggedIn && (
          <button
            onClick={() => handleNavigation('dashboard')}
            style={{
              background: 'white',
              color: t.primary,
              border: 'none',
              padding: '1rem 2rem',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '1rem',
              fontWeight: '600',
              transition: 'transform 0.2s ease',
            }}
            onMouseOver={(e) => e.target.style.transform = 'translateY(-2px)'}
            onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}
          >
            Go to Dashboard
          </button>
        )}
        <Dashboard />
      </section>

      <section style={{
        padding: '3rem 1rem',
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        <h2 style={{
          textAlign: 'center',
          color: t.text,
          marginBottom: '2rem',
          fontSize: '2rem',
          fontWeight: '700'
        }}>
          Featured Products
        </h2>

        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)',
          gap: '2rem'
        }}>
          {products.slice(0, 3).map(product => (
            <div
              key={product.id}
              style={{
                background: t.cardBg,
                borderRadius: '12px',
                overflow: 'hidden',
                border: `1px solid ${t.border}`,
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                cursor: 'pointer'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-8px)';
                e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.1)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <img
                src={product.image}
                alt={product.name}
                style={{
                  width: '100%',
                  height: '200px',
                  objectFit: 'cover'
                }}
              />
              <div style={{ padding: '1.5rem' }}>
                <h3 style={{
                  margin: '0 0 0.5rem',
                  color: t.text,
                  fontSize: '1.2rem',
                  fontWeight: '600'
                }}>
                  {product.name}
                </h3>
                <p style={{
                  margin: '0 0 1rem',
                  color: t.textSec,
                  fontSize: '0.9rem'
                }}>
                  {product.category}
                </p>
                <p style={{
                  margin: 0,
                  fontSize: '1.3rem',
                  fontWeight: '700',
                  color: t.primary
                }}>
                  ${product.price}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section style={{
        background: t.cardBg,
        padding: '3rem 1rem',
        borderTop: `1px solid ${t.border}`
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          textAlign: 'center'
        }}>
          <h2 style={{
            color: t.text,
            marginBottom: '1rem',
            fontSize: '2rem',
            fontWeight: '700'
          }}>
            Why Choose Our Admin Panel?
          </h2>
          <p style={{
            color: t.textSec,
            fontSize: '1.1rem',
            lineHeight: '1.6',
            maxWidth: '600px',
            margin: '0 auto'
          }}>
            Experience seamless product management with our intuitive interface.
            Built with modern React technologies and designed for efficiency.
          </p>
        </div>
      </section>
    </div>
  );
};

export default Home;