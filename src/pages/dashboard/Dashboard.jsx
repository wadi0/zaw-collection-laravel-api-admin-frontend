import React from 'react';

const DashboardComponent = ({
  isDarkMode,
  isMobile,
  theme,
  products = [
    { id: 1, name: 'MacBook Pro', price: 1299, category: 'Electronics' },
    { id: 2, name: 'iPhone 15', price: 999, category: 'Electronics' },
    { id: 3, name: 'Nike Shoes', price: 150, category: 'Fashion' }
  ],
  categories = [
    { id: 1, name: 'Electronics', count: 15 },
    { id: 2, name: 'Fashion', count: 8 },
    { id: 3, name: 'Home', count: 12 }
  ]
}) => {
  const t = isDarkMode ? theme.dark : theme.light;

  return (
    <div>
      <h1 style={{
        margin: '0 0 2rem',
        color: t.text,
        fontSize: '2rem'
      }}>
        Dashboard
      </h1>

      <div style={{
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)',
        gap: '1.5rem'
      }}>
        <div style={{
          background: t.cardBg,
          padding: '1.5rem',
          borderRadius: '12px',
          border: `1px solid ${t.border}`,
          textAlign: 'center'
        }}>
          <h3 style={{
            margin: '0 0 0.5rem',
            fontSize: '2rem',
            color: t.primary
          }}>
            {products.length}
          </h3>
          <p style={{ margin: 0, color: t.textSec }}>Total Products</p>
        </div>

        <div style={{
          background: t.cardBg,
          padding: '1.5rem',
          borderRadius: '12px',
          border: `1px solid ${t.border}`,
          textAlign: 'center'
        }}>
          <h3 style={{
            margin: '0 0 0.5rem',
            fontSize: '2rem',
            color: t.success
          }}>
            {categories.length}
          </h3>
          <p style={{ margin: 0, color: t.textSec }}>Categories</p>
        </div>

        <div style={{
          background: t.cardBg,
          padding: '1.5rem',
          borderRadius: '12px',
          border: `1px solid ${t.border}`,
          textAlign: 'center'
        }}>
          <h3 style={{
            margin: '0 0 0.5rem',
            fontSize: '2rem',
            color: t.danger
          }}>
            $12,450
          </h3>
          <p style={{ margin: 0, color: t.textSec }}>Revenue</p>
        </div>
      </div>
    </div>
  );
};

// Demo usage
const DashBoard = () => {
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

  return (
    <div style={{
      minHeight: '100vh',
      background: isDarkMode ? theme.dark.bg : theme.light.bg,
      padding: '2rem'
    }}>
      <div style={{ marginBottom: '2rem' }}>
        <button
          onClick={() => setIsDarkMode(!isDarkMode)}
          style={{
            padding: '0.5rem 1rem',
            borderRadius: '4px',
            border: 'none',
            background: '#3b82f6',
            color: 'white',
            cursor: 'pointer'
          }}
        >
          Toggle Dark Mode
        </button>
      </div>

      <DashboardComponent
        isDarkMode={isDarkMode}
        isMobile={false}
        theme={theme}
      />
    </div>
  );
};

export default DashBoard;
