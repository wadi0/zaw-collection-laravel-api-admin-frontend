import React from 'react';
import { useApp } from '../../context/AppContext';

const Dashboard = () => {
    const { isDarkMode, theme, products, categories } = useApp();
    console.log(categories.total);
    
    
    // Check if mobile based on window width
    const isMobile = window.innerWidth <= 768;
    
    const t = isDarkMode ? theme.dark : theme.light;

    // Safely get counts - handle both array and object structures
    const getProductsCount = () => {
        if (Array.isArray(products)) {
            return products.length;
        } else if (products && typeof products === 'object') {
            return products.total || products.length || 0;
        }
        return 0;
    };

    const getCategoriesCount = () => {
        if (Array.isArray(categories)) {
            return categories.length;
        } else if (categories && typeof categories === 'object') {
            return categories.total || categories.length || 0;
        }
        return 0;
    };

    // Get categories array for display
    const getCategoriesArray = () => {
        if (Array.isArray(categories)) {
            return categories;
        } else if (categories && categories.data && Array.isArray(categories.data)) {
            return categories.data;
        }
        return [];
    };

    // Get products array for display
    const getProductsArray = () => {
        if (Array.isArray(products)) {
            return products;
        } else if (products && products.data && Array.isArray(products.data)) {
            return products.data;
        }
        return [];
    };

    const categoriesArray = getCategoriesArray();
    const productsArray = getProductsArray();
    const productsCount = getProductsCount();
    const categoriesCount = getCategoriesCount();

    return (
        <div style={{
            minHeight: '100vh',
            background: t.bg,
            padding: '2rem'
        }}>
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '100vh'
            }}>
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)',
                    gap: '2rem',
                    width: '100%',
                    maxWidth: '800px'
                }}>
                    {/* Total Products Card */}
                    <div style={{
                        background: t.cardBg,
                        padding: '2.5rem',
                        borderRadius: '12px',
                        border: `1px solid ${t.border}`,
                        textAlign: 'center',
                        minHeight: '150px',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center'
                    }}>
                        <h3 style={{
                            margin: '0 0 0.5rem',
                            fontSize: '3rem',
                            color: t.primary
                        }}>
                            {productsCount}
                        </h3>
                        <p style={{ margin: 0, color: t.textSec, fontSize: '1.1rem' }}>Total Products</p>
                    </div>

                    {/* Categories Card */}
                    <div style={{
                        background: t.cardBg,
                        padding: '2.5rem',
                        borderRadius: '12px',
                        border: `1px solid ${t.border}`,
                        textAlign: 'center',
                        minHeight: '150px',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center'
                    }}>
                        <h3 style={{
                            margin: '0 0 0.5rem',
                            fontSize: '3rem',
                            color: t.success || t.primary
                        }}>
                            {categoriesCount}
                        </h3>
                        <p style={{ margin: 0, color: t.textSec, fontSize: '1.1rem' }}>Categories</p>
                    </div>
                </div>
            </div>

            {/* Empty State */}
            {productsCount === 0 && categoriesCount === 0 && (
                <div style={{
                    background: t.cardBg,
                    padding: '3rem',
                    borderRadius: '12px',
                    border: `1px solid ${t.border}`,
                    textAlign: 'center',
                    marginTop: '2rem'
                }}>
                    <h3 style={{
                        margin: '0 0 1rem',
                        color: t.text,
                        fontSize: '1.25rem'
                    }}>
                        Welcome to Dashboard
                    </h3>
                    <p style={{
                        margin: 0,
                        color: t.textSec
                    }}>
                        Start by adding some products and categories to see your data here.
                    </p>
                </div>
            )}
        </div>
    );
};

export default Dashboard;