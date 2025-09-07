import React, {createContext, useContext, useState, useEffect} from 'react';
import ApiUrlServices from "../components/network/ApiUrlServices.jsx";
import AxiosServices from "../components/network/AxiosServices.jsx";

const AppContext = createContext();

export const useApp = () => {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error('useApp must be used within AppProvider');
    }
    return context;
};

export const AppProvider = ({children}) => {
    // Check localStorage immediately for initial state
    const getInitialAuthState = () => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            try {
                const userData = JSON.parse(storedUser);
                return {isLoggedIn: true, user: userData};
            } catch (error) {
                localStorage.removeItem("user");
                return {isLoggedIn: false, user: null};
            }
        }
        return {isLoggedIn: false, user: null};
    };

    const initialAuth = getInitialAuthState();

    const [isDarkMode, setIsDarkMode] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(initialAuth.isLoggedIn);
    const [user, setUser] = useState(initialAuth.user);
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [dataLoading, setDataLoading] = useState(false);

    // Modal state management (simplified)
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth > 768);

    // Check localStorage on app start - now only for debugging
    useEffect(() => {
        console.log('AppContext - Initial state set:', {isLoggedIn, user});
    }, []);

    // Debug log whenever isLoggedIn changes
    useEffect(() => {
        console.log('AppContext - isLoggedIn changed to:', isLoggedIn);
    }, [isLoggedIn]);

    // Fetch products and categories when user logs in
    useEffect(() => {
        const fetchAppData = async () => {
            if (isLoggedIn && user?.token) {
                setDataLoading(true);
                try {
                    // Fetch products
                    const productsResponse = await AxiosServices.get(ApiUrlServices.ALL_PRODUCT_LIST);
                    const productsData = productsResponse.data.data || [];
                    setProducts(productsData);

                    // Fetch categories
                    const categoriesResponse = await AxiosServices.get(ApiUrlServices.ALL_CATEGORIES);
                    const categoriesData = categoriesResponse.data.data?.data || categoriesResponse.data.data || [];
                    setCategories(categoriesData);

                    console.log('AppContext - Data loaded:', {
                        productsCount: productsData.length,
                        categoriesCount: categoriesData.length
                    });
                } catch (error) {
                    console.error('AppContext - Data fetch error:', error);
                    // Don't clear data on error, keep existing data
                } finally {
                    setDataLoading(false);
                }
            } else {
                // Clear data when user logs out
                setProducts([]);
                setCategories([]);
                setDataLoading(false);
            }
        };

        fetchAppData();
    }, [isLoggedIn, user?.token]);

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

    // Add the toggleDarkMode function that your navbar expects
    const toggleDarkMode = () => {
        setIsDarkMode(prevMode => !prevMode);
    };

    const login = (userData) => {
        console.log('AppContext - Login called with:', userData);
        setIsLoggedIn(true);
        setUser(userData);
        localStorage.setItem("user", JSON.stringify(userData));
    };

    const logout = async () => {
        try {
            if (user?.token) {
                await AxiosServices.post(ApiUrlServices.LOG_OUT);
            }
        } catch (error) {
            console.error("Logout API failed:", error.response?.data || error.message);
        } finally {
            // Clear everything immediately
            setIsLoggedIn(false);
            setUser(null);
            setProducts([]);
            setCategories([]);
            localStorage.removeItem("user");
        }
    };

    // Function to refresh data manually
    const refreshData = async () => {
        if (isLoggedIn && user?.token) {
            setDataLoading(true);
            try {
                const [productsResponse, categoriesResponse] = await Promise.all([
                    AxiosServices.get(ApiUrlServices.ALL_PRODUCT_LIST),
                    AxiosServices.get(ApiUrlServices.ALL_CATEGORIES)
                ]);

                const productsData = productsResponse.data.data || [];
                const categoriesData = categoriesResponse.data.data?.data || categoriesResponse.data.data || [];
                
                setProducts(productsData);
                setCategories(categoriesData);
                
                console.log('AppContext - Data refreshed');
            } catch (error) {
                console.error('AppContext - Refresh error:', error);
            } finally {
                setDataLoading(false);
            }
        }
    };

    // Modal functions (simplified)
    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    // Sidebar functions (independent of modal)
    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    const closeSidebar = () => {
        setSidebarOpen(false);
    };

    const value = {
        isDarkMode,
        setIsDarkMode,
        toggleDarkMode,
        isLoggedIn,
        user,
        products,
        setProducts,
        categories,
        setCategories,
        dataLoading,
        refreshData,
        theme,
        login,
        logout,
        // Modal state and functions
        isModalOpen,
        setIsModalOpen,
        openModal,
        closeModal,
        // Sidebar state and functions (independent)
        sidebarOpen,
        setSidebarOpen,
        toggleSidebar,
        closeSidebar
    };

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    );
};



// import React, {createContext, useContext, useState, useEffect} from 'react';
// import ApiUrlServices from "../components/network/ApiUrlServices.jsx";
// import AxiosServices from "../components/network/AxiosServices.jsx";

// const AppContext = createContext();

// export const useApp = () => {
//     const context = useContext(AppContext);
//     if (!context) {
//         throw new Error('useApp must be used within AppProvider');
//     }
//     return context;
// };

// export const AppProvider = ({children}) => {
//     // Check localStorage immediately for initial state
//     const getInitialAuthState = () => {
//         const storedUser = localStorage.getItem("user");
//         if (storedUser) {
//             try {
//                 const userData = JSON.parse(storedUser);
//                 return {isLoggedIn: true, user: userData};
//             } catch (error) {
//                 localStorage.removeItem("user");
//                 return {isLoggedIn: false, user: null};
//             }
//         }
//         return {isLoggedIn: false, user: null};
//     };

//     const initialAuth = getInitialAuthState();

//     const [isDarkMode, setIsDarkMode] = useState(false);
//     const [isLoggedIn, setIsLoggedIn] = useState(initialAuth.isLoggedIn);
//     const [user, setUser] = useState(initialAuth.user);
//     const [products, setProducts] = useState([]);
//     const [categories, setCategories] = useState([]);

//     // Modal state management (simplified)
//     const [isModalOpen, setIsModalOpen] = useState(false);
//     const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth > 768);
//     // Check localStorage on app start - now only for debugging
//     useEffect(() => {
//         console.log('AppContext - Initial state set:', {isLoggedIn, user});
//     }, []);

//     // Debug log whenever isLoggedIn changes
//     useEffect(() => {
//         console.log('AppContext - isLoggedIn changed to:', isLoggedIn);
//     }, [isLoggedIn]);

//     // Removed: Auto close sidebar when modal opens - no longer needed
//     // Modal body scroll prevention is now handled by CustomModal itself

//     const theme = {
//         light: {
//             bg: '#f8fafc', cardBg: '#ffffff', text: '#1e293b', textSec: '#64748b',
//             border: '#e2e8f0', primary: '#3b82f6', success: '#10b981', danger: '#ef4444',
//             gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
//         },
//         dark: {
//             bg: '#0f172a', cardBg: '#1e293b', text: '#f1f5f9', textSec: '#94a3b8',
//             border: '#334155', primary: '#60a5fa', success: '#34d399', danger: '#f87171',
//             gradient: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)'
//         }
//     };

//     // Add the toggleDarkMode function that your navbar expects
//     const toggleDarkMode = () => {
//         setIsDarkMode(prevMode => !prevMode);
//     };

//     const login = (userData) => {
//         console.log('AppContext - Login called with:', userData);
//         setIsLoggedIn(true);
//         setUser(userData);
//         localStorage.setItem("user", JSON.stringify(userData));
//     };

//     const logout = async () => {
//     try {
//         if (user?.token) {
//             await AxiosServices.post(ApiUrlServices.LOG_OUT);
//         }
//     } catch (error) {
//         console.error("Logout API failed:", error.response?.data || error.message);
//     } finally {
//         // Clear everything immediately
//         setIsLoggedIn(false);
//         setUser(null);
//         localStorage.removeItem("user");
        
//     }
// };

//     // const logout = async () => {
//     //     if (!user?.token) return;
//     //     try {
//     //         await AxiosServices.post(ApiUrlServices.LOG_OUT);
//     //     } catch (error) {
//     //         console.error("Logout API failed:", error.response?.data || error.message);
//     //     } finally {
//     //         setIsLoggedIn(false);
//     //         setUser(null);
//     //         localStorage.removeItem("user");
//     //     }
//     // };

//     // Modal functions (simplified)
//     const openModal = () => {
//         setIsModalOpen(true);
//     };

//     const closeModal = () => {
//         setIsModalOpen(false);
//         // Removed: sidebar state restore logic - not needed anymore
//     };

//     // Sidebar functions (independent of modal)
//     const toggleSidebar = () => {
//         // Removed: modal check - sidebar can work independently now
//         setSidebarOpen(!sidebarOpen);
//     };

//     const closeSidebar = () => {
//         setSidebarOpen(false);
//     };

//     const value = {
//         isDarkMode,
//         setIsDarkMode,
//         toggleDarkMode,
//         isLoggedIn,
//         user,
//         products,
//         setProducts,
//         categories,
//         setCategories,
//         theme,
//         login,
//         logout,
//         // Modal state and functions
//         isModalOpen,
//         setIsModalOpen,
//         openModal,
//         closeModal,
//         // Sidebar state and functions (independent)
//         sidebarOpen,
//         setSidebarOpen,
//         toggleSidebar,
//         closeSidebar
//     };

//     return (
//         <AppContext.Provider value={value}>
//             {children}
//         </AppContext.Provider>
//     );
// };