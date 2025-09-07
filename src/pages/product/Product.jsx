import React, { useEffect, useState, useMemo } from 'react';
import { Plus } from 'lucide-react';
import { useApp } from "../../context/AppContext.jsx";
import CustomModal from "../../components/customModal/CustomModal.jsx";
import AxiosServices from "../../components/network/AxiosServices.jsx";
import ApiUrlServices from "../../components/network/ApiUrlServices.jsx";
import CustomTable from "../../components/customTable/CustomTable.jsx";
import CustomButton from "../../components/customButton/CustomButton.jsx";
import AddProduct from "./AddProduct.jsx";
import {toast} from "react-toastify";

const Products = ({ onDeleteProduct }) => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loadingProducts, setLoadingProducts] = useState(true);
    const [loadingCategories, setLoadingCategories] = useState(true);
    const [error, setError] = useState(null);
    const [modalState, setModalState] = useState({ isOpen: false, type: null, product: null });
    const [pagination, setPagination] = useState(null);

    const contextValue = useApp();
    const { isDarkMode, theme } = contextValue;
    const t = isDarkMode && theme?.dark ? theme.dark : theme?.light || {
        text: '#1e293b',
        bg: '#f8fafc',
        cardBg: '#ffffff',
        border: '#e2e8f0',
        textSec: '#64748b',
        primary: '#3b82f6',
        danger: '#ef4444',
        gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    };

    // Create a category lookup map for better performance
    const categoryLookup = useMemo(() => {
        const lookup = {};
        categories.forEach(cat => {
            lookup[cat.id] = cat.category_name;
        });
        console.log('Category Lookup:', lookup);
        return lookup;
    }, [categories]);

    // ✅ Fixed table columns configuration with proper image handling
    const tableColumns = [
        {
            title: 'Id',
            key: 'id',
            type: 'text',
            align: 'center',
            width: '60px',
            minWidth: '60px'
        },
        {
            title: 'Image',
            key: 'image',
            type: 'image', // ✅ This should work with your CustomTable
            align: 'center',
            width: '100px',
            minWidth: '100px'
        },
        {
            title: 'Product Name',
            key: 'name',
            type: 'text',
            primary: true,
            align: 'left',
            width: '200px',
            render: (value) => value ? value.charAt(0).toUpperCase() + value.slice(1).toLowerCase() : 'N/A'
        },
        {
            title: 'Price',
            key: 'price',
            type: 'text',
            align: 'center',
            width: '100px',
            render: (value) => value ? `$${parseFloat(value).toFixed(2)}` : 'N/A'
        },
        {
            title: 'Team',
            key: 'team',
            type: 'text',
            align: 'left',
            width: '150px'
        },
        {
            title: 'Role',
            key: 'role',
            type: 'text',
            align: 'center',
            width: '100px'
        },
        {
            title: 'Category',
            key: 'category_name',
            type: 'text',
            align: 'center',
            width: '150px'
        },
        {
            title: 'Description',
            key: 'description',
            type: 'text',
            align: 'left',
            width: '200px',
            render: (value) => value ? (value.length > 50 ? value.substring(0, 50) + '...' : value) : 'No description'
        }
    ];

    // Handle page change
    const handlePageChange = (page) => {
        fetchProducts(page, pagination.per_page);
    };

    // Handle per-page change
    const handlePerPageChange = (perPage) => {
        fetchProducts(1, perPage);
    };

    const fetchCategories = async () => {
        setLoadingCategories(true);
        setError(null);
        try {
            const response = await AxiosServices.get(ApiUrlServices.ALL_CATEGORIES);
            const categoriesData = response.data.data?.data || response.data.data || [];
            setCategories(categoriesData);
            // toast.success("Categories fetch successfully.")
        } catch (error) {
            setError('Failed to load categories');
            setCategories([]);
            toast.success("Something went wrong!")
        } finally {
            setLoadingCategories(false);
        }
    };

    const fetchProducts = async (page = 1, perPage = 10) => {
        setLoadingProducts(true);
        setError(null);
        try {
            const response = await AxiosServices.get(`${ApiUrlServices.ALL_PRODUCT_LIST}?page=${page}&per_page=${perPage}`);

            // Extract pagination metadata and data from Laravel response
            const { data, current_page, last_page, per_page, total, from, to } = response.data;

            const processedData = data.map(product => {
                const categoryName = categoryLookup[product.category_id] || 'N/A';

                // ✅ Ensure image URL is properly set
                const imageUrl = product.image && product.image.trim() !== '' ? product.image : null;

                return {
                    id: product.id,
                    name: product.name,
                    price: product.price,
                    team: product.team || 'N/A',
                    role: product.role || 'N/A',
                    category_id: product.category_id,
                    category_name: categoryName,
                    description: product.description || 'No description',
                    image: imageUrl, // ✅ This should be the complete Cloudinary URL or null
                    variants: product.variants || [],
                    cloudinary_public_id: product.cloudinary_public_id
                };
            });

            setProducts(processedData);
            setPagination({
                current_page,
                last_page,
                per_page,
                total,
                from,
                to
            });

            // toast.success("Product fetch successfully.")

        } catch (error) {
            setError('Failed to load products: ' + (error.response?.data?.message || error.message));
            setProducts([]);
            setPagination(null);
            toast.error("Something went wrong!")
        } finally {
            setLoadingProducts(false);
        }
    };

    // Load categories first, then products
    useEffect(() => {
        fetchCategories();
    }, []);

    // Fetch products after categories are loaded
    useEffect(() => {
        if (!loadingCategories) {
            fetchProducts();
        }
    }, [loadingCategories, categoryLookup]);

    // Delete product handler
  const handleDeleteProduct = async (product) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
        try {
            // ✅ Simple DELETE request
            const response = await AxiosServices.delete(ApiUrlServices.DELETE_PRODUCT(product.id));

            // Update UI
            setProducts(prevProducts => prevProducts.filter(p => p.id !== product.id));
            
            if (pagination) {
                setPagination(prev => ({ ...prev, total: prev.total - 1 }));
            }

            toast.warning("Product deleted successfully.")

        } catch (error) {
            const errorMessage = error.response?.data?.message || 
                                error.response?.data?.error || 
                                'Failed to delete product';
            toast.error("Something went wrong!")
        }
    }
};

    const handleEditProduct = (product) => {
        openModal('edit', product);
    };

    const handleViewProduct = (product) => {
        console.log('View product:', product);
    };

    const openModal = (type, product = null) => {
        setModalState({
            isOpen: true,
            type,
            product
        });
    };

    const closeModal = () => {
        setModalState({
            isOpen: false,
            type: null,
            product: null
        });
    };

    const handleAddClick = () => {
        openModal('add');
    };

    const handleProductSuccess = () => {
        fetchProducts(pagination ? pagination.current_page : 1, pagination ? pagination.per_page : 10);
        closeModal();
    };

    return (
        <div style={{ padding: '1rem' }}>
            {/* Header Section */}
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '2rem',
                flexWrap: 'wrap',
                gap: '1rem'
            }}>
                <h1 style={{
                    margin: 0,
                    color: t.text,
                    fontSize: '2rem',
                    fontWeight: '600'
                }}>
                    Products
                </h1>
                <div style={{ width: 'auto', display: 'inline-block' }}>
                    <CustomButton
                        type="button"
                        onClick={handleAddClick}
                        label="Add Product"
                        disabled={loadingCategories}
                        isLoading={false}
                    />
                </div>
            </div>

            {/* Loading message for categories */}
            {loadingCategories && (
                <div style={{
                    padding: '1rem',
                    textAlign: 'center',
                    color: t.textSec
                }}>
                    Loading categories...
                </div>
            )}

            {/* Custom Table */}
            <CustomTable
                data={products}
                columns={tableColumns}
                onEdit={handleEditProduct}
                onDelete={handleDeleteProduct}
                onView={handleViewProduct}
                loading={loadingProducts || loadingCategories}
                emptyMessage="No products found. Click 'Add Product' to create your first product."
                isDarkMode={isDarkMode}
                theme={theme}
                showActions={true}
                actionColumnTitle="Actions"
                editPermission={true}
                deletePermission={true}
                viewPermission={false}
                pagination={pagination}
                onPageChange={handlePageChange}
                onPerPageChange={handlePerPageChange}
            />

            {/* Modal with AddProduct Component */}
            <CustomModal
                isOpen={modalState.isOpen}
                onClose={closeModal}
                title={modalState.type === 'add' ? 'Add New Product' : 'Edit Product'}
                isDarkMode={isDarkMode}
                theme={theme}
                size="large"
            >
                <AddProduct
                    product={modalState.product}
                    onSuccess={handleProductSuccess}
                    categoryList={categories}
                />
            </CustomModal>
        </div>
    );
};

export default Products;

// import React, { useEffect, useState, useMemo } from 'react';
// import { Plus } from 'lucide-react';
// import { useApp } from "../../context/AppContext.jsx";
// import CustomModal from "../../components/customModal/CustomModal.jsx";
// import AxiosServices from "../../components/network/AxiosServices.jsx";
// import ApiUrlServices from "../../components/network/ApiUrlServices.jsx";
// import CustomTable from "../../components/customTable/CustomTable.jsx";
// import AddProduct from "./AddProduct.jsx";
// import {toast} from "react-toastify";

// const Products = ({ onDeleteProduct }) => {
//     const [products, setProducts] = useState([]);
//     const [categories, setCategories] = useState([]);
//     const [loadingProducts, setLoadingProducts] = useState(true);
//     const [loadingCategories, setLoadingCategories] = useState(true);
//     const [error, setError] = useState(null);
//     const [modalState, setModalState] = useState({ isOpen: false, type: null, product: null });
//     const [pagination, setPagination] = useState(null);

//     const contextValue = useApp();
//     const { isDarkMode, theme } = contextValue;
//     const t = isDarkMode && theme?.dark ? theme.dark : theme?.light || {
//         text: '#1e293b',
//         bg: '#f8fafc',
//         cardBg: '#ffffff',
//         border: '#e2e8f0',
//         textSec: '#64748b',
//         primary: '#3b82f6',
//         danger: '#ef4444',
//         gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
//     };

//     // Create a category lookup map for better performance
//     const categoryLookup = useMemo(() => {
//         const lookup = {};
//         categories.forEach(cat => {
//             lookup[cat.id] = cat.category_name;
//         });
//         console.log('Category Lookup:', lookup);
//         return lookup;
//     }, [categories]);

//     // ✅ Fixed table columns configuration with proper image handling
//     const tableColumns = [
//         {
//             title: 'Id',
//             key: 'id',
//             type: 'text',
//             align: 'center',
//             width: '60px',
//             minWidth: '60px'
//         },
//         {
//             title: 'Image',
//             key: 'image',
//             type: 'image', // ✅ This should work with your CustomTable
//             align: 'center',
//             width: '100px',
//             minWidth: '100px'
//         },
//         {
//             title: 'Product Name',
//             key: 'name',
//             type: 'text',
//             primary: true,
//             align: 'left',
//             width: '200px',
//             render: (value) => value ? value.charAt(0).toUpperCase() + value.slice(1).toLowerCase() : 'N/A'
//         },
//         {
//             title: 'Price',
//             key: 'price',
//             type: 'text',
//             align: 'center',
//             width: '100px',
//             render: (value) => value ? `$${parseFloat(value).toFixed(2)}` : 'N/A'
//         },
//         {
//             title: 'Team',
//             key: 'team',
//             type: 'text',
//             align: 'left',
//             width: '150px'
//         },
//         {
//             title: 'Role',
//             key: 'role',
//             type: 'text',
//             align: 'center',
//             width: '100px'
//         },
//         {
//             title: 'Category',
//             key: 'category_name',
//             type: 'text',
//             align: 'center',
//             width: '150px'
//         },
//         {
//             title: 'Description',
//             key: 'description',
//             type: 'text',
//             align: 'left',
//             width: '200px',
//             render: (value) => value ? (value.length > 50 ? value.substring(0, 50) + '...' : value) : 'No description'
//         }
//     ];

//     // Handle page change
//     const handlePageChange = (page) => {
//         fetchProducts(page, pagination.per_page);
//     };

//     // Handle per-page change
//     const handlePerPageChange = (perPage) => {
//         fetchProducts(1, perPage);
//     };

//     const fetchCategories = async () => {
//         setLoadingCategories(true);
//         setError(null);
//         try {
//             const response = await AxiosServices.get(ApiUrlServices.ALL_CATEGORIES);
//             const categoriesData = response.data.data?.data || response.data.data || [];
//             setCategories(categoriesData);
//             // toast.success("Categories fetch successfully.")
//         } catch (error) {
//             setError('Failed to load categories');
//             setCategories([]);
//             toast.success("Something went wrong!")
//         } finally {
//             setLoadingCategories(false);
//         }
//     };

//     const fetchProducts = async (page = 1, perPage = 10) => {
//         setLoadingProducts(true);
//         setError(null);
//         try {
//             const response = await AxiosServices.get(`${ApiUrlServices.ALL_PRODUCT_LIST}?page=${page}&per_page=${perPage}`);

//             // Extract pagination metadata and data from Laravel response
//             const { data, current_page, last_page, per_page, total, from, to } = response.data;

//             const processedData = data.map(product => {
//                 const categoryName = categoryLookup[product.category_id] || 'N/A';

//                 // ✅ Ensure image URL is properly set
//                 const imageUrl = product.image && product.image.trim() !== '' ? product.image : null;

//                 return {
//                     id: product.id,
//                     name: product.name,
//                     price: product.price,
//                     team: product.team || 'N/A',
//                     role: product.role || 'N/A',
//                     category_id: product.category_id,
//                     category_name: categoryName,
//                     description: product.description || 'No description',
//                     image: imageUrl, // ✅ This should be the complete Cloudinary URL or null
//                     variants: product.variants || [],
//                     cloudinary_public_id: product.cloudinary_public_id
//                 };
//             });

//             setProducts(processedData);
//             setPagination({
//                 current_page,
//                 last_page,
//                 per_page,
//                 total,
//                 from,
//                 to
//             });

//             // toast.success("Product fetch successfully.")

//         } catch (error) {
//             setError('Failed to load products: ' + (error.response?.data?.message || error.message));
//             setProducts([]);
//             setPagination(null);
//             toast.error("Something went wrong!")
//         } finally {
//             setLoadingProducts(false);
//         }
//     };

//     // Load categories first, then products
//     useEffect(() => {
//         fetchCategories();
//     }, []);

//     // Fetch products after categories are loaded
//     useEffect(() => {
//         if (!loadingCategories) {
//             fetchProducts();
//         }
//     }, [loadingCategories, categoryLookup]);

//     // Delete product handler
//   const handleDeleteProduct = async (product) => {
//     if (window.confirm('Are you sure you want to delete this product?')) {
//         try {
//             // ✅ Simple DELETE request
//             const response = await AxiosServices.delete(ApiUrlServices.DELETE_PRODUCT(product.id));

//             // Update UI
//             setProducts(prevProducts => prevProducts.filter(p => p.id !== product.id));
            
//             if (pagination) {
//                 setPagination(prev => ({ ...prev, total: prev.total - 1 }));
//             }

//             toast.warning("Product deleted successfully.")

//         } catch (error) {
//             const errorMessage = error.response?.data?.message || 
//                                 error.response?.data?.error || 
//                                 'Failed to delete product';
//             toast.error("Something went wrong!")
//         }
//     }
// };

//     const handleEditProduct = (product) => {
//         openModal('edit', product);
//     };

//     const handleViewProduct = (product) => {
//         console.log('View product:', product);
//     };

//     const openModal = (type, product = null) => {
//         setModalState({
//             isOpen: true,
//             type,
//             product
//         });
//     };

//     const closeModal = () => {
//         setModalState({
//             isOpen: false,
//             type: null,
//             product: null
//         });
//     };

//     const handleAddClick = () => {
//         openModal('add');
//     };

//     const handleProductSuccess = () => {
//         fetchProducts(pagination ? pagination.current_page : 1, pagination ? pagination.per_page : 10);
//         closeModal();
//     };

//     return (
//         <div style={{ padding: '1rem' }}>
//             {/* Header Section */}
//             <div style={{
//                 display: 'flex',
//                 justifyContent: 'space-between',
//                 alignItems: 'center',
//                 marginBottom: '2rem',
//                 flexWrap: 'wrap',
//                 gap: '1rem'
//             }}>
//                 <h1 style={{
//                     margin: 0,
//                     color: t.text,
//                     fontSize: '2rem',
//                     fontWeight: '600'
//                 }}>
//                     Products
//                 </h1>
//                 <button
//                     type="button"
//                     onClick={handleAddClick}
//                     disabled={loadingCategories}
//                     style={{
//                         background: loadingCategories ? t.textSec : t.gradient,
//                         color: 'white',
//                         border: 'none',
//                         padding: '0.75rem 1rem',
//                         borderRadius: '8px',
//                         cursor: loadingCategories ? 'not-allowed' : 'pointer',
//                         display: 'flex',
//                         alignItems: 'center',
//                         gap: '0.5rem',
//                         transition: 'all 0.2s ease',
//                         fontSize: '1rem',
//                         fontWeight: '500'
//                     }}
//                 >
//                     <Plus size={18} /> Add Product
//                 </button>
//             </div>

//             {/* Loading message for categories */}
//             {loadingCategories && (
//                 <div style={{
//                     padding: '1rem',
//                     textAlign: 'center',
//                     color: t.textSec
//                 }}>
//                     Loading categories...
//                 </div>
//             )}

//             {/* Custom Table */}
//             <CustomTable
//                 data={products}
//                 columns={tableColumns}
//                 onEdit={handleEditProduct}
//                 onDelete={handleDeleteProduct}
//                 onView={handleViewProduct}
//                 loading={loadingProducts || loadingCategories}
//                 emptyMessage="No products found. Click 'Add Product' to create your first product."
//                 isDarkMode={isDarkMode}
//                 theme={theme}
//                 showActions={true}
//                 actionColumnTitle="Actions"
//                 editPermission={true}
//                 deletePermission={true}
//                 viewPermission={false}
//                 pagination={pagination}
//                 onPageChange={handlePageChange}
//                 onPerPageChange={handlePerPageChange}
//             />

//             {/* Modal with AddProduct Component */}
//             <CustomModal
//                 isOpen={modalState.isOpen}
//                 onClose={closeModal}
//                 title={modalState.type === 'add' ? 'Add New Product' : 'Edit Product'}
//                 isDarkMode={isDarkMode}
//                 theme={theme}
//                 size="large"
//             >
//                 <AddProduct
//                     product={modalState.product}
//                     onSuccess={handleProductSuccess}
//                     categoryList={categories}
//                 />
//             </CustomModal>
//         </div>
//     );
// };

// export default Products;