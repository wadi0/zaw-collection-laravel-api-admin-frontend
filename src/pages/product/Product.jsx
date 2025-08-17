import React, {useEffect, useState} from 'react';
import {Plus} from 'lucide-react';
import {useApp} from "../../context/AppContext.jsx";
import CustomModal from "../../components/customModal/CustomModal.jsx";
import AxiosServices from "../../components/network/AxiosServices.jsx";
import ApiUrlServices from "../../components/network/ApiUrlServices.jsx";
import CustomTable from "../../components/customTable/CustomTable.jsx";
import AddProduct from "./AddProduct.jsx"; // Import your AddProduct component

const Products = ({onDeleteProduct}) => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loadingProducts, setLoadingProducts] = useState(true);
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
            key: 'id',
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

  const fetchProducts = async () => {
    setLoadingProducts(true);
    try {
        const response = await AxiosServices.get(ApiUrlServices.ALL_PRODUCT_LIST);
        console.log('Products API Response:', response);

        let processedData = [];

        // Fix: Access response.data.data instead of response.data
        // since Laravel pagination wraps the actual data in a 'data' property
        const productsArray = response.data?.data || [];

        processedData = productsArray.map(product => {
            // Find category name by category_id
            const categoryName = categories.find(cat => cat.id === product.category_id)?.name || 'N/A';

            return {
                id: product.id,
                name: product.name,
                price: product.price,
                team: product.team || 'N/A',
                role: product.role || 'N/A',
                category_id: product.category_id, // Keep original ID for reference
                category_name: categoryName, // Add category name as separate key
                description: product.description || 'No description',
                image: product.image,
                variants: product.variants || []
            };
        });

        setProducts(processedData);

    } catch (error) {
        console.error('Error fetching products:', error);
        setProducts([]);
    } finally {
        setLoadingProducts(false);
    }
};

    const fetchCategories = async () => {
        try {
            const response = await AxiosServices.get(ApiUrlServices.All_CATEGORIES);
            console.log('Categories API Response:', response);
            setCategories(response.data || []);
        } catch (error) {
            console.error('Error fetching categories:', error);
            setCategories([]);
        }
    };

    // Load products and categories on component mount
    useEffect(() => {
        fetchProducts();
        fetchCategories();
    }, []);

    // Delete product handler
    const handleDeleteProduct = async (product) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            try {
                await AxiosServices.delete(ApiUrlServices.DELETE_PRODUCT(product.id))
                console.log('Product deleted:', product.id);
                // Refresh products list after deletion
                await fetchProducts();
                // Call parent callback if provided
                if (onDeleteProduct) {
                    onDeleteProduct(product.id);
                }
            } catch (error) {
                console.error('Delete error:', error);
            }
        }
    };

    // Edit product handler
    const handleEditProduct = (product) => {
        openModal('edit', product);
    };

    // View product handler (optional)
    const handleViewProduct = (product) => {
        console.log('View product:', product);
        // You can implement view functionality here
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

    // Success handler for AddProduct component
    const handleProductSuccess = () => {
        // Refresh products list after successful add/edit
        fetchProducts();
        closeModal();
    };

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
                    style={{
                        background: t.gradient,
                        color: 'white',
                        border: 'none',
                        padding: '0.75rem 1rem',
                        borderRadius: '8px',
                        cursor: 'pointer',
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

            {/* Custom Table - WITHOUT pagination */}
            <CustomTable
                data={products}
                columns={tableColumns}
                onEdit={handleEditProduct}
                onDelete={handleDeleteProduct}
                onView={handleViewProduct}
                loading={loadingProducts}
                emptyMessage="No products found. Click 'Add Product' to create your first product."
                isDarkMode={isDarkMode}
                theme={theme}
                showActions={true}
                actionColumnTitle="Actions"
                editPermission={true}
                deletePermission={true}
                viewPermission={false}
                // NO pagination - table will not show pagination controls
                pagination={null}
            />

            {/* Modal with AddProduct Component */}
            <CustomModal
                isOpen={modalState.isOpen}
                onClose={closeModal}
                title={modalState.type === 'add' ? 'Add New Product' : 'Edit Product'}
                isDarkMode={isDarkMode}
                theme={theme}
                size="large" // Make modal larger for the form
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