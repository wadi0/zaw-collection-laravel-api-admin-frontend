import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Sun, Moon, Menu } from 'lucide-react';

const Navbar = ({ setSidebarOpen, sidebarOpen, isMobile }) => {
    const { isDarkMode, setIsDarkMode, isLoggedIn, theme } = useApp();
    const navigate = useNavigate();
    const t = isDarkMode ? theme.dark : theme.light;

    return (
        <header style={{
            background: t.cardBg,
            borderBottom: `1px solid ${t.border}`,
            position: 'sticky',
            top: 0,
            zIndex: 100,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
        }}>
            <h1
                onClick={() => navigate('/')}
                style={{
                    margin: 0,
                    background: t.gradient,
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    fontSize: '1.5rem',
                    fontWeight: '800',
                    cursor: 'pointer'
                }}
            >
                ModernShop
            </h1>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <button
                    onClick={() => setIsDarkMode(!isDarkMode)}
                    style={{
                        background: 'none',
                        border: `1px solid ${t.border}`,
                        color: t.text,
                        padding: '0.5rem',
                        borderRadius: '8px',
                        cursor: 'pointer'
                    }}
                >
                    {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
                </button>

                {!isLoggedIn ? (
                    <button
                        onClick={() => navigate('/login')}
                        style={{
                            background: t.gradient,
                            color: 'white',
                            border: 'none',
                            padding: '0.5rem 1rem',
                            borderRadius: '8px',
                            cursor: 'pointer'
                        }}
                    >
                        Login
                    </button>
                ) : (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{ color: t.text, fontSize: '0.9rem' }}>Welcome!</span>
                        {isMobile && (
                            <button
                                onClick={() => setSidebarOpen(!sidebarOpen)}
                                style={{
                                    background: 'none',
                                    border: 'none',
                                    color: t.text,
                                    cursor: 'pointer'
                                }}
                            >
                                <Menu size={20} />
                            </button>
                        )}
                    </div>
                )}
            </div>
        </header>
    );
};

export default Navbar;