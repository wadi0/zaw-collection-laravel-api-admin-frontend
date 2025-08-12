import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import {
    X, BarChart3, Package, Grid, UserCircle, Settings, LogOut,
    ChevronDown, ChevronRight
} from 'lucide-react';

const Sidebar = ({ sidebarOpen, setSidebarOpen, isMobile }) => {
    const [activeAccordion, setActiveAccordion] = useState('');
    const { isDarkMode, theme, logout } = useApp();
    const navigate = useNavigate();
    const location = useLocation();
    const t = isDarkMode ? theme.dark : theme.light;

    const menuItems = [
        { id: 'dashboard', label: 'Dashboard', icon: BarChart3, path: '/admin/dashboard' },
        {
            id: 'products', label: 'Products', icon: Package,
            children: [
                { id: 'all-products', label: 'All Products', path: '/admin/products' },
                { id: 'add-product', label: 'Add Product', path: '/admin/products/add' }
            ]
        },
        { id: 'categories', label: 'Categories', icon: Grid, path: '/admin/categories' },
        { id: 'profile', label: 'Profile', icon: UserCircle, path: '/admin/profile' },
        { id: 'settings', label: 'Settings', icon: Settings, path: '/admin/settings' }
    ];

    const handleNavigation = (path) => {
        navigate(path);
        setSidebarOpen(false);
    };

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const isActiveRoute = (path) => {
        return location.pathname === path;
    };

    return (
        <div style={{
            position: 'fixed',
            left: sidebarOpen || !isMobile ? 0 : '-280px',
            top: 0,
            width: '280px',
            height: '100vh',
            background: t.cardBg,
            borderRight: `1px solid ${t.border}`,
            transition: 'left 0.3s',
            zIndex: 999
        }}>
            <div style={{
                padding: '1rem',
                borderBottom: `1px solid ${t.border}`,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
            }}>
                <h2 style={{ margin: 0, color: t.text, fontSize: '1.2rem' }}>Admin Panel</h2>
                {isMobile && (
                    <button
                        onClick={() => setSidebarOpen(false)}
                        style={{
                            background: 'none',
                            border: 'none',
                            color: t.text,
                            cursor: 'pointer'
                        }}
                    >
                        <X size={20} />
                    </button>
                )}
            </div>

            <nav style={{ padding: '1rem 0' }}>
                {menuItems.map((item) => (
                    <div key={item.id}>
                        <button
                            onClick={() => {
                                if (item.children) {
                                    setActiveAccordion(activeAccordion === item.id ? '' : item.id);
                                } else {
                                    handleNavigation(item.path);
                                }
                            }}
                            style={{
                                width: '100%',
                                background: isActiveRoute(item.path) ? t.gradient : 'none',
                                border: 'none',
                                color: isActiveRoute(item.path) ? 'white' : t.text,
                                padding: '0.75rem 1rem',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.75rem',
                                cursor: 'pointer',
                                fontSize: '0.9rem'
                            }}
                        >
                            <item.icon size={18} />
                            <span style={{ flex: 1, textAlign: 'left' }}>{item.label}</span>
                            {item.children && (activeAccordion === item.id ? <ChevronDown size={16} /> : <ChevronRight size={16} />)}
                        </button>

                        {item.children && activeAccordion === item.id && (
                            <div style={{ backgroundColor: t.bg }}>
                                {item.children.map((child) => (
                                    <button
                                        key={child.id}
                                        onClick={() => handleNavigation(child.path)}
                                        style={{
                                            width: '100%',
                                            background: isActiveRoute(child.path) ? t.primary : 'none',
                                            border: 'none',
                                            color: isActiveRoute(child.path) ? 'white' : t.textSec,
                                            padding: '0.5rem 1rem 0.5rem 2.5rem',
                                            cursor: 'pointer',
                                            fontSize: '0.85rem'
                                        }}
                                    >
                                        {child.label}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </nav>

            <div style={{ position: 'absolute', bottom: '1rem', left: '1rem', right: '1rem' }}>
                <button
                    onClick={handleLogout}
                    style={{
                        width: '100%',
                        background: t.danger,
                        color: 'white',
                        border: 'none',
                        padding: '0.75rem',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.5rem'
                    }}
                >
                    <LogOut size={16} /> Logout
                </button>
            </div>
        </div>
    );
};

export default Sidebar;

// import React, { useState } from 'react';
// import {
//   X, BarChart3, Package, Grid, UserCircle, Settings, LogOut,
//   ChevronDown, ChevronRight
// } from 'lucide-react';
//
// const Sidebar = ({
//   sidebarOpen,
//   setSidebarOpen,
//   isMobile,
//   currentPage,
//   setCurrentPage,
//   setIsLoggedIn,
//   isDarkMode,
//   theme
// }) => {
//   const [activeAccordion, setActiveAccordion] = useState('');
//   const t = isDarkMode ? theme.dark : theme.light;
//
//   const menuItems = [
//     { id: 'dashboard', label: 'Dashboard', icon: BarChart3, page: 'dashboard' },
//     {
//       id: 'products', label: 'Products', icon: Package,
//       children: [
//         { id: 'all-products', label: 'All Products', page: 'products' },
//         { id: 'add-product', label: 'Add Product', page: 'add-product' }
//       ]
//     },
//     { id: 'categories', label: 'Categories', icon: Grid, page: 'categories' },
//     { id: 'profile', label: 'Profile', icon: UserCircle, page: 'profile' },
//     { id: 'settings', label: 'Settings', icon: Settings, page: 'settings' }
//   ];
//
//   return (
//     <div style={{
//       position: 'fixed',
//       left: sidebarOpen || !isMobile ? 0 : '-280px',
//       top: 0,
//       width: '280px',
//       height: '100vh',
//       background: t.cardBg,
//       borderRight: `1px solid ${t.border}`,
//       transition: 'left 0.3s',
//       zIndex: 999
//     }}>
//       <div style={{
//         padding: '1rem',
//         borderBottom: `1px solid ${t.border}`,
//         display: 'flex',
//         justifyContent: 'space-between',
//         alignItems: 'center'
//       }}>
//         <h2 style={{ margin: 0, color: t.text, fontSize: '1.2rem' }}>Admin Panel</h2>
//         <button
//           onClick={() => setSidebarOpen(false)}
//           style={{
//             background: 'none',
//             border: 'none',
//             color: t.text,
//             cursor: 'pointer',
//             display: isMobile ? 'block' : 'none'
//           }}
//         >
//           <X size={20} />
//         </button>
//       </div>
//
//       <nav style={{ padding: '1rem 0' }}>
//         {menuItems.map((item) => (
//           <div key={item.id}>
//             <button
//               onClick={() => {
//                 if (item.children) {
//                   setActiveAccordion(activeAccordion === item.id ? '' : item.id);
//                 } else {
//                   setCurrentPage(item.page);
//                   setSidebarOpen(false);
//                 }
//               }}
//               style={{
//                 width: '100%',
//                 background: currentPage === item.page ? t.gradient : 'none',
//                 border: 'none',
//                 color: currentPage === item.page ? 'white' : t.text,
//                 padding: '0.75rem 1rem',
//                 display: 'flex',
//                 alignItems: 'center',
//                 gap: '0.75rem',
//                 cursor: 'pointer',
//                 fontSize: '0.9rem'
//               }}
//             >
//               <item.icon size={18} />
//               <span style={{ flex: 1, textAlign: 'left' }}>{item.label}</span>
//               {item.children && (activeAccordion === item.id ? <ChevronDown size={16} /> : <ChevronRight size={16} />)}
//             </button>
//
//             {item.children && activeAccordion === item.id && (
//               <div style={{ backgroundColor: t.bg }}>
//                 {item.children.map((child) => (
//                   <button
//                     key={child.id}
//                     onClick={() => { setCurrentPage(child.page); setSidebarOpen(false); }}
//                     style={{
//                       width: '100%',
//                       background: currentPage === child.page ? t.primary : 'none',
//                       border: 'none',
//                       color: currentPage === child.page ? 'white' : t.textSec,
//                       padding: '0.5rem 1rem 0.5rem 2.5rem',
//                       cursor: 'pointer',
//                       fontSize: '0.85rem'
//                     }}
//                   >
//                     {child.label}
//                   </button>
//                 ))}
//               </div>
//             )}
//           </div>
//         ))}
//       </nav>
//
//       <div style={{ position: 'absolute', bottom: '1rem', left: '1rem', right: '1rem' }}>
//         <button
//           onClick={() => { setIsLoggedIn(false); setCurrentPage('home'); }}
//           style={{
//             width: '100%',
//             background: t.danger,
//             color: 'white',
//             border: 'none',
//             padding: '0.75rem',
//             borderRadius: '8px',
//             cursor: 'pointer',
//             display: 'flex',
//             alignItems: 'center',
//             justifyContent: 'center',
//             gap: '0.5rem'
//           }}
//         >
//           <LogOut size={16} /> Logout
//         </button>
//       </div>
//     </div>
//   );
// };
//
// // Demo usage
// const SidebarDemo = () => {
//   const [sidebarOpen, setSidebarOpen] = useState(true);
//   const [currentPage, setCurrentPage] = useState('dashboard');
//   const [isDarkMode, setIsDarkMode] = useState(false);
//
//   const theme = {
//     light: {
//       bg: '#f8fafc', cardBg: '#ffffff', text: '#1e293b', textSec: '#64748b',
//       border: '#e2e8f0', primary: '#3b82f6', success: '#10b981', danger: '#ef4444',
//       gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
//     },
//     dark: {
//       bg: '#0f172a', cardBg: '#1e293b', text: '#f1f5f9', textSec: '#94a3b8',
//       border: '#334155', primary: '#60a5fa', success: '#34d399', danger: '#f87171',
//       gradient: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)'
//     }
//   };
//
//   const setIsLoggedIn = (status) => console.log('Logout:', status);
//
//   return (
//     <div style={{ minHeight: '100vh', background: isDarkMode ? theme.dark.bg : theme.light.bg }}>
//       <Sidebar
//         sidebarOpen={sidebarOpen}
//         setSidebarOpen={setSidebarOpen}
//         isMobile={false}
//         currentPage={currentPage}
//         setCurrentPage={setCurrentPage}
//         setIsLoggedIn={setIsLoggedIn}
//         isDarkMode={isDarkMode}
//         theme={theme}
//       />
//       <div style={{ marginLeft: '280px', padding: '2rem' }}>
//         <p style={{ color: isDarkMode ? theme.dark.text : theme.light.text }}>
//           Current page: {currentPage}
//         </p>
//         <button
//           onClick={() => setIsDarkMode(!isDarkMode)}
//           style={{
//             padding: '0.5rem 1rem',
//             borderRadius: '4px',
//             border: 'none',
//             background: '#3b82f6',
//             color: 'white',
//             cursor: 'pointer'
//           }}
//         >
//           Toggle Dark Mode
//         </button>
//       </div>
//     </div>
//   );
// };
//
// export default SidebarDemo;