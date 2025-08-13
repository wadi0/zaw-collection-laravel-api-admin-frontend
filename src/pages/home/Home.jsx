import React from 'react';

const Home = ({
  isLoggedIn,
  setCurrentPage,
  isDarkMode,
  isMobile,
  theme = {
    light: {
      bg: '#f8fafc', cardBg: '#ffffff', text: '#1e293b', textSec: '#64748b',
      border: '#e2e8f0', primary: '#3b82f6', success: '#10b981', danger: '#ef4444',
      gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    },
    dark: {
      bg: '#0f172a', cardBg: '#1e293b', text: '#f1f5f9', textSec: '#94a3b8',
      border: '#334155', primary: '#60a5fa', success: '#34d399', danger: '#f87171',
      gradient: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)'
    }
  },
  products = [
    { id: 1, name: 'MacBook Pro', price: 1299, category: 'Electronics', image: 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=400&h=300&fit=crop' },
    { id: 2, name: 'iPhone 15', price: 999, category: 'Electronics', image: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400&h=300&fit=crop' },
    { id: 3, name: 'Nike Shoes', price: 150, category: 'Fashion', image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=300&fit=crop' }
  ]
}) => {
  const t = isDarkMode ? theme.dark : theme.light;

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
            onClick={() => setCurrentPage('auth')}
            style={{
              background: 'white',
              color: t.primary,
              border: 'none',
              padding: '1rem 2rem',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '1rem',
              fontWeight: '600'
            }}
          >
            Get Started
          </button>
        )}
        {isLoggedIn && (
          <button
            onClick={() => setCurrentPage('dashboard')}
            style={{
              background: 'white',
              color: t.primary,
              border: 'none',
              padding: '1rem 2rem',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '1rem',
              fontWeight: '600'
            }}
          >
            Go to Dashboard
          </button>
        )}
      </section>

      <section style={{
        padding: '3rem 1rem',
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
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
                border: `1px solid ${t.border}`
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
              <div style={{ padding: '1rem' }}>
                <h3 style={{
                  margin: '0 0 0.5rem',
                  color: t.text
                }}>
                  {product.name}
                </h3>
                <p style={{
                  margin: '0 0 1rem',
                  color: t.textSec
                }}>
                  {product.category}
                </p>
                <p style={{
                  margin: 0,
                  fontSize: '1.2rem',
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
    </div>
  );
};

// ডেমো কম্পোনেন্টের নাম পাল্টে দিলাম
const HomeDemo = () => {
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);
  const [isDarkMode, setIsDarkMode] = React.useState(false);

  const theme = {
    light: {
      bg: '#f8fafc', cardBg: '#ffffff', text: '#1e293b', textSec: '#64748b',
      border: '#e2e8f0', primary: '#3b82f6', success: '#10b981', danger: '#ef4444',
      gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    },
    dark: {
      bg: '#0f172a', cardBg: '#1e293b', text: '#f1f5f9', textSec: '#94a3b8',
      border: '#334155', primary: '#60a5fa', success: '#34d399', danger: '#f87171',
      gradient: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)'
    }
  };

  const setCurrentPage = (page) => {
    console.log('Navigate to:', page);
    if (page === 'auth') setIsLoggedIn(!isLoggedIn);
  };

  return (
    <div>
      <div style={{ padding: '1rem', background: isDarkMode ? theme.dark.cardBg : theme.light.cardBg }}>
        <button
          onClick={() => setIsDarkMode(!isDarkMode)}
          style={{
            padding: '0.5rem 1rem',
            borderRadius: '4px',
            border: 'none',
            background: '#3b82f6',
            color: 'white',
            cursor: 'pointer',
            marginRight: '1rem'
          }}
        >
          Toggle Dark Mode
        </button>
        <button
          onClick={() => setIsLoggedIn(!isLoggedIn)}
          style={{
            padding: '0.5rem 1rem',
            borderRadius: '4px',
            border: 'none',
            background: '#10b981',
            color: 'white',
            cursor: 'pointer'
          }}
        >
          Toggle Login Status
        </button>
      </div>

      <Home
        isLoggedIn={isLoggedIn}
        setCurrentPage={setCurrentPage}
        isDarkMode={isDarkMode}
        isMobile={false}
        theme={theme}
      />
    </div>
  );
};

export default Home;
