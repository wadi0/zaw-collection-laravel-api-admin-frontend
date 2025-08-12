import React, { useState } from 'react';

// Reusable Profile component
const Profile = ({
  isDarkMode,
  theme,
  user = {
    name: 'Admin User',
    email: 'admin@modernshop.com',
    avatar: 'A'
  },
  onUpdateProfile
}) => {
  const [profileForm, setProfileForm] = useState({
    name: user.name || '',
    email: user.email || ''
  });

  const t = isDarkMode ? theme.dark : theme.light;

  const handleSubmit = () => {
    if (!profileForm.name.trim() || !profileForm.email.trim()) {
      alert('Please fill in all fields');
      return;
    }

    if (onUpdateProfile) {
      onUpdateProfile(profileForm);
    } else {
      alert('Profile updated successfully!');
    }
  };

  return (
    <div>
      <h1 style={{
        margin: '0 0 2rem',
        color: t.text,
        fontSize: '2rem'
      }}>
        Profile
      </h1>

      <div style={{
        background: t.cardBg,
        padding: '2rem',
        borderRadius: '12px',
        border: `1px solid ${t.border}`
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
          marginBottom: '2rem'
        }}>
          <div style={{
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            background: t.gradient,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontSize: '2rem',
            fontWeight: '700'
          }}>
            {user.avatar || user.name?.charAt(0) || 'U'}
          </div>
          <div>
            <h2 style={{
              margin: '0 0 0.5rem',
              color: t.text
            }}>
              {user.name || 'Admin User'}
            </h2>
            <p style={{
              margin: 0,
              color: t.textSec
            }}>
              {user.email || 'admin@modernshop.com'}
            </p>
          </div>
        </div>

        <div style={{ display: 'grid', gap: '1rem' }}>
          <div>
            <label style={{
              display: 'block',
              marginBottom: '0.5rem',
              color: t.text,
              fontWeight: '500'
            }}>
              Full Name
            </label>
            <input
              type="text"
              value={profileForm.name}
              onChange={(e) => setProfileForm({...profileForm, name: e.target.value})}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: `1px solid ${t.border}`,
                borderRadius: '8px',
                background: t.bg,
                color: t.text,
                boxSizing: 'border-box'
              }}
            />
          </div>

          <div>
            <label style={{
              display: 'block',
              marginBottom: '0.5rem',
              color: t.text,
              fontWeight: '500'
            }}>
              Email Address
            </label>
            <input
              type="email"
              value={profileForm.email}
              onChange={(e) => setProfileForm({...profileForm, email: e.target.value})}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: `1px solid ${t.border}`,
                borderRadius: '8px',
                background: t.bg,
                color: t.text,
                boxSizing: 'border-box'
              }}
            />
          </div>

          <div style={{ marginTop: '1rem' }}>
            <button
              onClick={handleSubmit}
              style={{
                background: t.gradient,
                color: 'white',
                border: 'none',
                padding: '0.75rem 1.5rem',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: '600',
                fontSize: '1rem'
              }}
            >
              Update Profile
            </button>
          </div>
        </div>
      </div>

      {/* Additional Profile Information */}
      <div style={{
        background: t.cardBg,
        padding: '2rem',
        borderRadius: '12px',
        border: `1px solid ${t.border}`,
        marginTop: '2rem'
      }}>
        <h3 style={{
          margin: '0 0 1rem',
          color: t.text
        }}>
          Account Information
        </h3>

        <div style={{
          display: 'grid',
          gap: '1rem'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '0.75rem',
            background: t.bg,
            borderRadius: '8px'
          }}>
            <span style={{ color: t.text }}>Account Type</span>
            <span style={{
              color: t.primary,
              fontWeight: '600',
              background: t.primary + '20',
              padding: '0.25rem 0.5rem',
              borderRadius: '4px',
              fontSize: '0.875rem'
            }}>
              Administrator
            </span>
          </div>

          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '0.75rem',
            background: t.bg,
            borderRadius: '8px'
          }}>
            <span style={{ color: t.text }}>Member Since</span>
            <span style={{ color: t.textSec }}>
              {new Date().toLocaleDateString()}
            </span>
          </div>

          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '0.75rem',
            background: t.bg,
            borderRadius: '8px'
          }}>
            <span style={{ color: t.text }}>Last Login</span>
            <span style={{ color: t.textSec }}>
              {new Date().toLocaleString()}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

// Demo component for testing Profile
const ProfileDemo = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [user, setUser] = useState({
    name: 'Admin User',
    email: 'admin@modernshop.com',
    avatar: 'A'
  });

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

  const handleUpdateProfile = (profileData) => {
    setUser({...user, ...profileData});
    alert('Profile updated successfully!');
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

      <Profile
        isDarkMode={isDarkMode}
        theme={theme}
        user={user}
        onUpdateProfile={handleUpdateProfile}
      />
    </div>
  );
};

export default ProfileDemo; // Export the demo component
export { Profile }; // Export the reusable component