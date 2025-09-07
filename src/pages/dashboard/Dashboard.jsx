import React from 'react';
import { useApp } from '../../context/AppContext';

const Dashboard = () => {
    const { isDarkMode, theme, products, categories } = useApp();
    
    // Check if mobile based on window width
    const isMobile = window.innerWidth <= 768;
    
    const t = isDarkMode ? theme.dark : theme.light;

    return (
        <div style={{
            minHeight: '100vh',
            background: t.bg,
            padding: '2rem'
        }}>
            <h1 style={{
                margin: '0 0 2rem',
                color: t.text,
                fontSize: '2rem'
            }}>
                Dashboard
            </h1>
            
            <div style={{
                display: 'grid',
                gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)',
                gap: '1.5rem'
            }}>
                {/* Total Products Card */}
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

                {/* Categories Card */}
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
            </div>

            {/* Recent Products Section */}
            {products.length > 0 && (
                <div style={{ marginTop: '2rem' }}>
                    <h2 style={{
                        margin: '0 0 1rem',
                        color: t.text,
                        fontSize: '1.5rem'
                    }}>
                        Recent Products
                    </h2>
                    
                    <div style={{
                        background: t.cardBg,
                        border: `1px solid ${t.border}`,
                        borderRadius: '12px',
                        overflow: 'hidden'
                    }}>
                        {products.slice(0, 5).map((product, index) => (
                            <div key={product.id || index} style={{
                                padding: '1rem 1.5rem',
                                borderBottom: index < Math.min(products.length, 5) - 1 ? `1px solid ${t.border}` : 'none',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center'
                            }}>
                                <div>
                                    <h4 style={{
                                        margin: '0 0 0.25rem',
                                        color: t.text,
                                        fontSize: '1rem'
                                    }}>
                                        {product.name || `Product ${index + 1}`}
                                    </h4>
                                    <p style={{
                                        margin: 0,
                                        color: t.textSec,
                                        fontSize: '0.875rem'
                                    }}>
                                        {product.category || 'Uncategorized'}
                                    </p>
                                </div>
                                {product.price && (
                                    <span style={{
                                        color: t.primary,
                                        fontWeight: '600',
                                        fontSize: '1rem'
                                    }}>
                                        ${product.price}
                                    </span>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Categories Section */}
            {categories.total > 0 && (
                <div style={{ marginTop: '2rem' }}>
                    <h2 style={{
                        margin: '0 0 1rem',
                        color: t.text,
                        fontSize: '1.5rem'
                    }}>
                        Categories
                    </h2>
                    
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(200px, 1fr))',
                        gap: '1rem'
                    }}>
                        {categories.map((category, index) => (
                            <div key={category.id || index} style={{
                                background: t.cardBg,
                                padding: '1rem',
                                borderRadius: '8px',
                                border: `1px solid ${t.border}`,
                                textAlign: 'center'
                            }}>
                                <h4 style={{
                                    margin: '0 0 0.5rem',
                                    color: t.text,
                                    fontSize: '1.125rem'
                                }}>
                                    {category.name || `Category ${index + 1}`}
                                </h4>
                                <p style={{
                                    margin: 0,
                                    color: t.textSec,
                                    fontSize: '0.875rem'
                                }}>
                                    {category.count || 0} items
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Empty State */}
            {products.total === 0 && categories.length === 0 && (
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

// import React from 'react';
// import { useApp } from '../..//context/AppContext.jsx';

// const Dashboard = () => {
//     const { isDarkMode, theme, products, categories } = useApp();
    
//     // Check if mobile based on window width
//     const isMobile = window.innerWidth <= 768;
    
//     const t = isDarkMode ? theme.dark : theme.light;

//     return (
//         <div style={{
//             minHeight: '100vh',
//             background: t.bg,
//             padding: '2rem'
//         }}>
//             <h1 style={{
//                 margin: '0 0 2rem',
//                 color: t.text,
//                 fontSize: '2rem'
//             }}>
//                 Dashboard
//             </h1>
            
//             <div style={{
//                 display: 'grid',
//                 gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)',
//                 gap: '1.5rem'
//             }}>
//                 {/* Total Products Card */}
//                 <div style={{
//                     background: t.cardBg,
//                     padding: '1.5rem',
//                     borderRadius: '12px',
//                     border: `1px solid ${t.border}`,
//                     textAlign: 'center'
//                 }}>
//                     <h3 style={{
//                         margin: '0 0 0.5rem',
//                         fontSize: '2rem',
//                         color: t.primary
//                     }}>
//                         {products.length}
//                     </h3>
//                     <p style={{ margin: 0, color: t.textSec }}>Total Products</p>
//                 </div>

//                 {/* Categories Card */}
//                 <div style={{
//                     background: t.cardBg,
//                     padding: '1.5rem',
//                     borderRadius: '12px',
//                     border: `1px solid ${t.border}`,
//                     textAlign: 'center'
//                 }}>
//                     <h3 style={{
//                         margin: '0 0 0.5rem',
//                         fontSize: '2rem',
//                         color: t.success
//                     }}>
//                         {categories.length}
//                     </h3>
//                     <p style={{ margin: 0, color: t.textSec }}>Categories</p>
//                 </div>
//             </div>

//             {/* Recent Products Section */}
//             {products.length > 0 && (
//                 <div style={{ marginTop: '2rem' }}>
//                     <h2 style={{
//                         margin: '0 0 1rem',
//                         color: t.text,
//                         fontSize: '1.5rem'
//                     }}>
//                         Recent Products
//                     </h2>
                    
//                     <div style={{
//                         background: t.cardBg,
//                         border: `1px solid ${t.border}`,
//                         borderRadius: '12px',
//                         overflow: 'hidden'
//                     }}>
//                         {products.slice(0, 5).map((product, index) => (
//                             <div key={product.id || index} style={{
//                                 padding: '1rem 1.5rem',
//                                 borderBottom: index < Math.min(products.length, 5) - 1 ? `1px solid ${t.border}` : 'none',
//                                 display: 'flex',
//                                 justifyContent: 'space-between',
//                                 alignItems: 'center'
//                             }}>
//                                 <div>
//                                     <h4 style={{
//                                         margin: '0 0 0.25rem',
//                                         color: t.text,
//                                         fontSize: '1rem'
//                                     }}>
//                                         {product.name || `Product ${index + 1}`}
//                                     </h4>
//                                     <p style={{
//                                         margin: 0,
//                                         color: t.textSec,
//                                         fontSize: '0.875rem'
//                                     }}>
//                                         {product.category || 'Uncategorized'}
//                                     </p>
//                                 </div>
//                                 {product.price && (
//                                     <span style={{
//                                         color: t.primary,
//                                         fontWeight: '600',
//                                         fontSize: '1rem'
//                                     }}>
//                                         ${product.price}
//                                     </span>
//                                 )}
//                             </div>
//                         ))}
//                     </div>
//                 </div>
//             )}

//             {/* Categories Section */}
//             {categories.length > 0 && (
//                 <div style={{ marginTop: '2rem' }}>
//                     <h2 style={{
//                         margin: '0 0 1rem',
//                         color: t.text,
//                         fontSize: '1.5rem'
//                     }}>
//                         Categories
//                     </h2>
                    
//                     <div style={{
//                         display: 'grid',
//                         gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(200px, 1fr))',
//                         gap: '1rem'
//                     }}>
//                         {categories.map((category, index) => (
//                             <div key={category.id || index} style={{
//                                 background: t.cardBg,
//                                 padding: '1rem',
//                                 borderRadius: '8px',
//                                 border: `1px solid ${t.border}`,
//                                 textAlign: 'center'
//                             }}>
//                                 <h4 style={{
//                                     margin: '0 0 0.5rem',
//                                     color: t.text,
//                                     fontSize: '1.125rem'
//                                 }}>
//                                     {category.name || `Category ${index + 1}`}
//                                 </h4>
//                                 <p style={{
//                                     margin: 0,
//                                     color: t.textSec,
//                                     fontSize: '0.875rem'
//                                 }}>
//                                     {category.count || 0} items
//                                 </p>
//                             </div>
//                         ))}
//                     </div>
//                 </div>
//             )}

//             {/* Empty State */}
//             {products.data.length === 0 && categories.length === 0 && (
//                 <div style={{
//                     background: t.cardBg,
//                     padding: '3rem',
//                     borderRadius: '12px',
//                     border: `1px solid ${t.border}`,
//                     textAlign: 'center',
//                     marginTop: '2rem'
//                 }}>
//                     <h3 style={{
//                         margin: '0 0 1rem',
//                         color: t.text,
//                         fontSize: '1.25rem'
//                     }}>
//                         Welcome to Dashboard
//                     </h3>
//                     <p style={{
//                         margin: 0,
//                         color: t.textSec
//                     }}>
//                         Start by adding some products and categories to see your data here.
//                     </p>
//                 </div>
//             )}
//         </div>
//     );
// };

// export default Dashboard;


// // import React from 'react';
// // import { useApp } from '../../context/AppContext.jsx'

// // const Dashboard = () => {
// //     const { isDarkMode, theme, products, categories } = useApp();
    
// //     // Check if mobile based on window width
// //     const isMobile = window.innerWidth <= 768;
    
// //     const t = isDarkMode ? theme.dark : theme.light;

// //     return (
// //         <div style={{
// //             minHeight: '100vh',
// //             background: t.bg,
// //             padding: '2rem'
// //         }}>
// //             <h1 style={{
// //                 margin: '0 0 2rem',
// //                 color: t.text,
// //                 fontSize: '2rem'
// //             }}>
// //                 Dashboard
// //             </h1>
            
// //             <div style={{
// //                 display: 'grid',
// //                 gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)',
// //                 gap: '1.5rem'
// //             }}>
// //                 {/* Total Products Card */}
// //                 <div style={{
// //                     background: t.cardBg,
// //                     padding: '1.5rem',
// //                     borderRadius: '12px',
// //                     border: `1px solid ${t.border}`,
// //                     textAlign: 'center'
// //                 }}>
// //                     <h3 style={{
// //                         margin: '0 0 0.5rem',
// //                         fontSize: '2rem',
// //                         color: t.primary
// //                     }}>
// //                         {products.length}
// //                     </h3>
// //                     <p style={{ margin: 0, color: t.textSec }}>Total Products</p>
// //                 </div>

// //                 {/* Categories Card */}
// //                 <div style={{
// //                     background: t.cardBg,
// //                     padding: '1.5rem',
// //                     borderRadius: '12px',
// //                     border: `1px solid ${t.border}`,
// //                     textAlign: 'center'
// //                 }}>
// //                     <h3 style={{
// //                         margin: '0 0 0.5rem',
// //                         fontSize: '2rem',
// //                         color: t.success
// //                     }}>
// //                         {categories.length}
// //                     </h3>
// //                     <p style={{ margin: 0, color: t.textSec }}>Categories</p>
// //                 </div>
// //             </div>

// //             {/* Recent Products Section */}
// //             {products.length > 0 && (
// //                 <div style={{ marginTop: '2rem' }}>
// //                     <h2 style={{
// //                         margin: '0 0 1rem',
// //                         color: t.text,
// //                         fontSize: '1.5rem'
// //                     }}>
// //                         Recent Products
// //                     </h2>
                    
// //                     <div style={{
// //                         background: t.cardBg,
// //                         border: `1px solid ${t.border}`,
// //                         borderRadius: '12px',
// //                         overflow: 'hidden'
// //                     }}>
// //                         {products.slice(0, 5).map((product, index) => (
// //                             <div key={product.id || index} style={{
// //                                 padding: '1rem 1.5rem',
// //                                 borderBottom: index < Math.min(products.length, 5) - 1 ? `1px solid ${t.border}` : 'none',
// //                                 display: 'flex',
// //                                 justifyContent: 'space-between',
// //                                 alignItems: 'center'
// //                             }}>
// //                                 <div>
// //                                     <h4 style={{
// //                                         margin: '0 0 0.25rem',
// //                                         color: t.text,
// //                                         fontSize: '1rem'
// //                                     }}>
// //                                         {product.name || `Product ${index + 1}`}
// //                                     </h4>
// //                                     <p style={{
// //                                         margin: 0,
// //                                         color: t.textSec,
// //                                         fontSize: '0.875rem'
// //                                     }}>
// //                                         {product.category || 'Uncategorized'}
// //                                     </p>
// //                                 </div>
// //                                 {product.price && (
// //                                     <span style={{
// //                                         color: t.primary,
// //                                         fontWeight: '600',
// //                                         fontSize: '1rem'
// //                                     }}>
// //                                         ${product.price}
// //                                     </span>
// //                                 )}
// //                             </div>
// //                         ))}
// //                     </div>
// //                 </div>
// //             )}

// //             {/* Categories Section */}
// //             {categories.length > 0 && (
// //                 <div style={{ marginTop: '2rem' }}>
// //                     <h2 style={{
// //                         margin: '0 0 1rem',
// //                         color: t.text,
// //                         fontSize: '1.5rem'
// //                     }}>
// //                         Categories
// //                     </h2>
                    
// //                     <div style={{
// //                         display: 'grid',
// //                         gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(200px, 1fr))',
// //                         gap: '1rem'
// //                     }}>
// //                         {categories.map((category, index) => (
// //                             <div key={category.id || index} style={{
// //                                 background: t.cardBg,
// //                                 padding: '1rem',
// //                                 borderRadius: '8px',
// //                                 border: `1px solid ${t.border}`,
// //                                 textAlign: 'center'
// //                             }}>
// //                                 <h4 style={{
// //                                     margin: '0 0 0.5rem',
// //                                     color: t.text,
// //                                     fontSize: '1.125rem'
// //                                 }}>
// //                                     {category.name || `Category ${index + 1}`}
// //                                 </h4>
// //                                 <p style={{
// //                                     margin: 0,
// //                                     color: t.textSec,
// //                                     fontSize: '0.875rem'
// //                                 }}>
// //                                     {category.count || 0} items
// //                                 </p>
// //                             </div>
// //                         ))}
// //                     </div>
// //                 </div>
// //             )}

// //             {/* Empty State */}
// //             {products.length === 0 && categories.length === 0 && (
// //                 <div style={{
// //                     background: t.cardBg,
// //                     padding: '3rem',
// //                     borderRadius: '12px',
// //                     border: `1px solid ${t.border}`,
// //                     textAlign: 'center',
// //                     marginTop: '2rem'
// //                 }}>
// //                     <h3 style={{
// //                         margin: '0 0 1rem',
// //                         color: t.text,
// //                         fontSize: '1.25rem'
// //                     }}>
// //                         Welcome to Dashboard
// //                     </h3>
// //                     <p style={{
// //                         margin: 0,
// //                         color: t.textSec
// //                     }}>
// //                         Start by adding some products and categories to see your data here.
// //                     </p>
// //                 </div>
// //             )}
// //         </div>
// //     );
// // };

// // export default Dashboard;


// // // import React from 'react';

// // // const DashboardComponent = ({
// // //   isDarkMode,
// // //   isMobile,
// // //   theme,
// // //   products = [
// // //     { id: 1, name: 'MacBook Pro', price: 1299, category: 'Electronics' },
// // //     { id: 2, name: 'iPhone 15', price: 999, category: 'Electronics' },
// // //     { id: 3, name: 'Nike Shoes', price: 150, category: 'Fashion' }
// // //   ],
// // //   categories = [
// // //     { id: 1, name: 'Electronics', count: 15 },
// // //     { id: 2, name: 'Fashion', count: 8 },
// // //     { id: 3, name: 'Home', count: 12 }
// // //   ]
// // // }) => {
// // //   const t = isDarkMode ? theme.dark : theme.light;

// // //   return (
// // //     <div>
// // //       <h1 style={{
// // //         margin: '0 0 2rem',
// // //         color: t.text,
// // //         fontSize: '2rem'
// // //       }}>
// // //         Dashboard
// // //       </h1>

// // //       <div style={{
// // //         display: 'grid',
// // //         gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)',
// // //         gap: '1.5rem'
// // //       }}>
// // //         <div style={{
// // //           background: t.cardBg,
// // //           padding: '1.5rem',
// // //           borderRadius: '12px',
// // //           border: `1px solid ${t.border}`,
// // //           textAlign: 'center'
// // //         }}>
// // //           <h3 style={{
// // //             margin: '0 0 0.5rem',
// // //             fontSize: '2rem',
// // //             color: t.primary
// // //           }}>
// // //             {products.length}
// // //           </h3>
// // //           <p style={{ margin: 0, color: t.textSec }}>Total Products</p>
// // //         </div>

// // //         <div style={{
// // //           background: t.cardBg,
// // //           padding: '1.5rem',
// // //           borderRadius: '12px',
// // //           border: `1px solid ${t.border}`,
// // //           textAlign: 'center'
// // //         }}>
// // //           <h3 style={{
// // //             margin: '0 0 0.5rem',
// // //             fontSize: '2rem',
// // //             color: t.success
// // //           }}>
// // //             {categories.length}
// // //           </h3>
// // //           <p style={{ margin: 0, color: t.textSec }}>Categories</p>
// // //         </div>

// // //         <div style={{
// // //           background: t.cardBg,
// // //           padding: '1.5rem',
// // //           borderRadius: '12px',
// // //           border: `1px solid ${t.border}`,
// // //           textAlign: 'center'
// // //         }}>
// // //           <h3 style={{
// // //             margin: '0 0 0.5rem',
// // //             fontSize: '2rem',
// // //             color: t.danger
// // //           }}>
// // //             $12,450
// // //           </h3>
// // //           <p style={{ margin: 0, color: t.textSec }}>Revenue</p>
// // //         </div>
// // //       </div>
// // //     </div>
// // //   );
// // // };

// // // // Demo usage
// // // const Dashboard = () => {
// // //   const [isDarkMode, setIsDarkMode] = React.useState(false);

// // //   const theme = {
// // //     light: {
// // //       bg: '#f8fafc', cardBg: '#ffffff', text: '#1e293b', textSec: '#64748b',
// // //       border: '#e2e8f0', primary: '#3b82f6', success: '#10b981', danger: '#ef4444',
// // //       gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
// // //     },
// // //     dark: {
// // //       bg: '#0f172a', cardBg: '#1e293b', text: '#f1f5f9', textSec: '#94a3b8',
// // //       border: '#334155', primary: '#60a5fa', success: '#34d399', danger: '#f87171',
// // //       gradient: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)'
// // //     }
// // //   };

// // //   return (
// // //     <div style={{
// // //       minHeight: '100vh',
// // //       background: isDarkMode ? theme.dark.bg : theme.light.bg,
// // //       padding: '2rem'
// // //     }}>
// // //       <div style={{ marginBottom: '2rem' }}>
// // //         <button
// // //           onClick={() => setIsDarkMode(!isDarkMode)}
// // //           style={{
// // //             padding: '0.5rem 1rem',
// // //             borderRadius: '4px',
// // //             border: 'none',
// // //             background: '#3b82f6',
// // //             color: 'white',
// // //             cursor: 'pointer'
// // //           }}
// // //         >
// // //           Toggle Dark Mode
// // //         </button>
// // //       </div>

// // //       <DashboardComponent
// // //         isDarkMode={isDarkMode}
// // //         isMobile={false}
// // //         theme={theme}
// // //       />
// // //     </div>
// // //   );
// // // };

// // // export default Dashboard;
