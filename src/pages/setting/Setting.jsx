import React, { useState } from 'react';

const SettingsComponent = ({
  isDarkMode,
  setIsDarkMode,
  theme,
  settings = {
    notifications: true,
    emailAlerts: false,
    autoSave: true,
    language: 'English'
  },
  onUpdateSettings
}) => {
  const [localSettings, setLocalSettings] = useState(settings);
  const t = isDarkMode ? theme.dark : theme.light;

  const handleToggle = (key) => {
    const newSettings = { ...localSettings, [key]: !localSettings[key] };
    setLocalSettings(newSettings);
    if (onUpdateSettings) {
      onUpdateSettings(newSettings);
    }
  };

  const handleLanguageChange = (language) => {
    const newSettings = { ...localSettings, language };
    setLocalSettings(newSettings);
    if (onUpdateSettings) {
      onUpdateSettings(newSettings);
    }
  };

  const ToggleSwitch = ({ isOn, onToggle, label, description }) => (
    <div style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '1rem',
      background: t.bg,
      borderRadius: '8px',
      marginBottom: '1rem'
    }}>
      <div>
        <h3 style={{ margin: '0 0 0.25rem', color: t.text }}>{label}</h3>
        <p style={{ margin: 0, color: t.textSec, fontSize: '0.9rem' }}>{description}</p>
      </div>
      <button
        onClick={onToggle}
        style={{
          background: isOn ? t.primary : t.border,
          border: 'none',
          borderRadius: '20px',
          width: '50px',
          height: '24px',
          cursor: 'pointer',
          position: 'relative',
          transition: 'all 0.2s'
        }}
      >
        <div style={{
          width: '20px',
          height: '20px',
          borderRadius: '50%',
          background: 'white',
          position: 'absolute',
          top: '2px',
          left: isOn ? '28px' : '2px',
          transition: 'all 0.2s'
        }} />
      </button>
    </div>
  );

  return (
    <div>
      <h1 style={{
        margin: '0 0 2rem',
        color: t.text,
        fontSize: '2rem'
      }}>
        Settings
      </h1>

      {/* Appearance Settings */}
      <div style={{
        background: t.cardBg,
        padding: '2rem',
        borderRadius: '12px',
        border: `1px solid ${t.border}`,
        marginBottom: '2rem'
      }}>
        <h2 style={{
          margin: '0 0 1rem',
          color: t.text,
          fontSize: '1.25rem'
        }}>
          Appearance
        </h2>

        <ToggleSwitch
          isOn={isDarkMode}
          onToggle={() => setIsDarkMode && setIsDarkMode(!isDarkMode)}
          label="Dark Mode"
          description="Toggle between light and dark themes"
        />
      </div>

      {/* Application Settings */}
      <div style={{
        background: t.cardBg,
        padding: '2rem',
        borderRadius: '12px',
        border: `1px solid ${t.border}`,
        marginBottom: '2rem'
      }}>
        <h2 style={{
          margin: '0 0 1rem',
          color: t.text,
          fontSize: '1.25rem'
        }}>
          Application
        </h2>

        <ToggleSwitch
          isOn={localSettings.notifications}
          onToggle={() => handleToggle('notifications')}
          label="Push Notifications"
          description="Receive notifications about important updates"
        />

        <ToggleSwitch
          isOn={localSettings.emailAlerts}
          onToggle={() => handleToggle('emailAlerts')}
          label="Email Alerts"
          description="Get email notifications for new orders and messages"
        />

        <ToggleSwitch
          isOn={localSettings.autoSave}
          onToggle={() => handleToggle('autoSave')}
          label="Auto Save"
          description="Automatically save your work as you make changes"
        />
      </div>

      {/* Language Settings */}
      <div style={{
        background: t.cardBg,
        padding: '2rem',
        borderRadius: '12px',
        border: `1px solid ${t.border}`,
        marginBottom: '2rem'
      }}>
        <h2 style={{
          margin: '0 0 1rem',
          color: t.text,
          fontSize: '1.25rem'
        }}>
          Language & Region
        </h2>

        <div style={{
          padding: '1rem',
          background: t.bg,
          borderRadius: '8px'
        }}>
          <h3 style={{ margin: '0 0 0.5rem', color: t.text }}>Language</h3>
          <select
            value={localSettings.language}
            onChange={(e) => handleLanguageChange(e.target.value)}
            style={{
              padding: '0.5rem 1rem',
              border: `1px solid ${t.border}`,
              borderRadius: '6px',
              background: t.cardBg,
              color: t.text,
              minWidth: '150px'
            }}
          >
            <option value="English">English</option>
            <option value="Spanish">Español</option>
            <option value="French">Français</option>
            <option value="German">Deutsch</option>
            <option value="Italian">Italiano</option>
          </select>
        </div>
      </div>

      {/* Data & Privacy */}
      <div style={{
        background: t.cardBg,
        padding: '2rem',
        borderRadius: '12px',
        border: `1px solid ${t.border}`
      }}>
        <h2 style={{
          margin: '0 0 1rem',
          color: t.text,
          fontSize: '1.25rem'
        }}>
          Data & Privacy
        </h2>

        <div style={{ display: 'grid', gap: '1rem' }}>
          <button
            onClick={() => alert('Export functionality would be implemented here')}
            style={{
              background: t.primary,
              color: 'white',
              border: 'none',
              padding: '0.75rem 1rem',
              borderRadius: '8px',
              cursor: 'pointer',
              textAlign: 'left',
              fontSize: '0.9rem'
            }}
          >
            Export Data
          </button>

          <button
            onClick={() => {
              if (confirm('Are you sure you want to clear all application data? This action cannot be undone.')) {
                alert('Clear data functionality would be implemented here');
              }
            }}
            style={{
              background: t.danger,
              color: 'white',
              border: 'none',
              padding: '0.75rem 1rem',
              borderRadius: '8px',
              cursor: 'pointer',
              textAlign: 'left',
              fontSize: '0.9rem'
            }}
          >
            Clear All Data
          </button>
        </div>
      </div>

      {/* Save Button */}
      <div style={{ marginTop: '2rem', textAlign: 'center' }}>
        <button
          onClick={() => alert('Settings saved successfully!')}
          style={{
            background: t.gradient,
            color: 'white',
            border: 'none',
            padding: '1rem 2rem',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '1rem',
            fontWeight: '600'
          }}
        >
          Save All Settings
        </button>
      </div>
    </div>
  );
};

// Demo usage
const Setting = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [settings, setSettings] = useState({
    notifications: true,
    emailAlerts: false,
    autoSave: true,
    language: 'English'
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

  const handleUpdateSettings = (newSettings) => {
    setSettings(newSettings);
    console.log('Settings updated:', newSettings);
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: isDarkMode ? theme.dark.bg : theme.light.bg,
      padding: '2rem'
    }}>
      <SettingsComponent
        isDarkMode={isDarkMode}
        setIsDarkMode={setIsDarkMode}
        theme={theme}
        settings={settings}
        onUpdateSettings={handleUpdateSettings}
      />
    </div>
  );
};

export default Setting;
