import React, {useEffect, useState, useMemo} from 'react';
import {Plus} from 'lucide-react';
import {useApp} from "../../context/AppContext.jsx";
import CustomModal from "../../components/customModal/CustomModal.jsx";
import AxiosServices from "../../components/network/AxiosServices.jsx";
import ApiUrlServices from "../../components/network/ApiUrlServices.jsx";
import CustomTable from "../../components/customTable/CustomTable.jsx";
import AddProduct from "./AddProduct.jsx";

const Products = ({onDeleteProduct}) => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loadingProducts, setLoadingProducts] = useState(true);
    const [loadingCategories, setLoadingCategories] = useState(true);
    const [error, setError] = useState(null);
    const [modalState, setModalState] = useState({isOpen: false, type: null, product: null});

    const contextValue = useApp();
    const {isDarkMode, theme} = contextValue;
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
        return lookup;
    }, [categories]);

    // Table columns configuration
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
            title: 'Product Name',
            key: 'name',
            type: 'text',
            primary: true,
            align: 'left',
            width: '200px'
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

    const fetchCategories = async () => {
        setLoadingCategories(true);
        setError(null);
        try {
            const response = await AxiosServices.get(ApiUrlServices.All_CATEGORIES);
            console.log('Categories API Response:', response);
            setCategories(response.data || []);
        } catch (error) {
            console.error('Error fetching categories:', error);
            setError('Failed to load categories');
            setCategories([]);
        } finally {
            setLoadingCategories(false);
        }
    };

    const fetchProducts = async () => {
        setLoadingProducts(true);
        setError(null);
        try {
            const response = await AxiosServices.get(ApiUrlServices.ALL_PRODUCT_LIST);
            console.log('Products API Response:', response);

            // Access response.data.data for Laravel pagination
            const productsArray = response.data?.data || [];

            const processedData = productsArray.map(product => {
                // Use the category lookup map for better performance
                const categoryName = categoryLookup[product.category_id] || 'N/A';

                return {
                    id: product.id,
                    name: product.name,
                    price: product.price,
                    team: product.team || 'N/A',
                    role: product.role || 'N/A',
                    category_id: product.category_id,
                    category_name: categoryName,
                    description: product.description || 'No description',
                    image: product.image,
                    variants: product.variants || []
                };
            });

            setProducts(processedData);

        } catch (error) {
            console.error('Error fetching products:', error);
            setError('Failed to load products');
            setProducts([]);
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
        if (!loadingCategories && categories.length >= 0) {
            fetchProducts();
        }
    }, [loadingCategories, categoryLookup]); // Use categoryLookup as dependency

    // Delete product handler
    const handleDeleteProduct = async (product) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            try {
                await AxiosServices.delete(ApiUrlServices.DELETE_PRODUCT(product.id));
                console.log('Product deleted:', product.id);

                // Optimistically update the UI
                setProducts(prevProducts =>
                    prevProducts.filter(p => p.id !== product.id)
                );

                // Call parent callback if provided
                if (onDeleteProduct) {
                    onDeleteProduct(product.id);
                }
            } catch (error) {
                console.error('Delete error:', error);
                setError('Failed to delete product');
                // Refresh products list on error to ensure data consistency
                fetchProducts();
            }
        }
    };

    const handleEditProduct = (product) => {
        openModal('edit', product);
    };

    const handleViewProduct = (product) => {
        console.log('View product:', product);
        // Implement view functionality here
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
        fetchProducts();
        closeModal();
    };

    // Show error message if there's an error
    if (error) {
        return (
            <div style={{padding: '1rem'}}>
                <div style={{
                    background: '#fef2f2',
                    border: '1px solid #fecaca',
                    color: '#dc2626',
                    padding: '1rem',
                    borderRadius: '8px',
                    marginBottom: '1rem'
                }}>
                    {error}
                    <button
                        onClick={() => {
                            setError(null);
                            fetchCategories();
                        }}
                        style={{
                            marginLeft: '1rem',
                            background: '#dc2626',
                            color: 'white',
                            border: 'none',
                            padding: '0.5rem 1rem',
                            borderRadius: '4px',
                            cursor: 'pointer'
                        }}
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div style={{padding: '1rem'}}>
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
                <button
                    type="button"
                    onClick={handleAddClick}
                    disabled={loadingCategories}
                    style={{
                        background: loadingCategories ? t.textSec : t.gradient,
                        color: 'white',
                        border: 'none',
                        padding: '0.75rem 1rem',
                        borderRadius: '8px',
                        cursor: loadingCategories ? 'not-allowed' : 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        transition: 'all 0.2s ease',
                        fontSize: '1rem',
                        fontWeight: '500'
                    }}
                >
                    <Plus size={18}/> Add Product
                </button>
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
                pagination={null}
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