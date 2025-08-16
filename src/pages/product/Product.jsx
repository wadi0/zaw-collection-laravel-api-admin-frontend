import React, { useState } from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';
import {useApp} from "../../context/AppContext.jsx";
import CustomModal from "../../components/customModal/CustomModal.jsx";

// Product Form Component
const ProductForm = ({ product, onSave, onCancel, isDarkMode, theme }) => {
    const [formData, setFormData] = useState({
        name: product?.name || '',
        price: product?.price || '',
        category: product?.category || 'Electronics',
        image: product?.image || ''
    });

    const t = isDarkMode ? theme.dark : theme.light;

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = () => {
        if (!formData.name || !formData.price) {
            alert('Please fill in all required fields');
            return;
        }
        onSave({
            ...formData,
            price: parseFloat(formData.price) || 0,
            id: product?.id || Date.now()
        });
    };

    const inputStyle = {
        width: '100%',
        padding: '0.75rem',
        borderRadius: '8px',
        border: `1px solid ${t.border}`,
        background: t.bg,
        color: t.text,
        fontSize: '1rem',
        marginBottom: '1rem',
        boxSizing: 'border-box'
    };

    const labelStyle = {
        display: 'block',
        marginBottom: '0.5rem',
        color: t.text,
        fontWeight: '500'
    };

    return (
        <div>
            <div>
                <label style={labelStyle}>Product Name</label>
                <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    style={inputStyle}
                    placeholder="Enter product name"
                />
            </div>

            <div>
                <label style={labelStyle}>Price ($)</label>
                <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    style={inputStyle}
                    placeholder="Enter price"
                    min="0"
                    step="0.01"
                />
            </div>

            <div>
                <label style={labelStyle}>Category</label>
                <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    style={inputStyle}
                >
                    <option value="Electronics">Electronics</option>
                    <option value="Fashion">Fashion</option>
                    <option value="Books">Books</option>
                    <option value="Sports">Sports</option>
                    <option value="Home">Home</option>
                </select>
            </div>

            <div>
                <label style={labelStyle}>Image URL</label>
                <input
                    type="url"
                    name="image"
                    value={formData.image}
                    onChange={handleChange}
                    style={inputStyle}
                    placeholder="Enter image URL"
                />
            </div>

            <div style={{
                display: 'flex',
                gap: '1rem',
                justifyContent: 'flex-end',
                marginTop: '1.5rem',
                flexWrap: 'wrap'
            }}>
                <button
                    onClick={onCancel}
                    style={{
                        padding: '0.75rem 1.5rem',
                        borderRadius: '8px',
                        border: `1px solid ${t.border}`,
                        background: t.bg,
                        color: t.text,
                        cursor: 'pointer',
                        fontSize: '1rem',
                        minWidth: '80px'
                    }}
                >
                    Cancel
                </button>
                <button
                    onClick={handleSubmit}
                    style={{
                        padding: '0.75rem 1.5rem',
                        borderRadius: '8px',
                        border: 'none',
                        background: t.primary,
                        color: 'white',
                        cursor: 'pointer',
                        fontSize: '1rem',
                        minWidth: '80px'
                    }}
                >
                    {product ? 'Update' : 'Save'}
                </button>
            </div>
        </div>
    );
};

// Main Product Component
const Product = ({
    products = [
        { id: 1, name: 'MacBook Pro', price: 1299, category: 'Electronics', image: 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=400&h=300&fit=crop' },
        { id: 2, name: 'iPhone 15', price: 999, category: 'Electronics', image: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400&h=300&fit=crop' },
        { id: 3, name: 'Nike Shoes', price: 150, category: 'Fashion', image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=300&fit=crop' }
    ],
    onAddProduct,
    onEditProduct,
    onDeleteProduct
}) => {
    const [modalState, setModalState] = useState({
        isOpen: false,
        type: null, // 'add' or 'edit'
        product: null
    });

    const { isDarkMode, theme, isModalOpen } = useApp();
    const t = isDarkMode ? theme.dark : theme.light;

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

    const handleSaveProduct = (productData) => {
        if (modalState.type === 'add') {
            onAddProduct && onAddProduct(productData);
        } else if (modalState.type === 'edit') {
            onEditProduct && onEditProduct(productData);
        }
        closeModal();
    };

    const handleDeleteProduct = (id) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            onDeleteProduct && onDeleteProduct(id);
        }
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
                <button
                    onClick={() => openModal('add')}
                    disabled={isModalOpen}
                    style={{
                        background: isModalOpen ? t.textSec : t.gradient,
                        color: 'white',
                        border: 'none',
                        padding: '0.75rem 1rem',
                        borderRadius: '8px',
                        cursor: isModalOpen ? 'not-allowed' : 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        opacity: isModalOpen ? 0.5 : 1,
                        transition: 'all 0.2s ease',
                        fontSize: '1rem',
                        fontWeight: '500'
                    }}
                >
                    <Plus size={18} /> Add Product
                </button>
            </div>

            {/* Products Table */}
            <div style={{
                background: t.cardBg,
                borderRadius: '12px',
                border: `1px solid ${t.border}`,
                overflow: 'hidden',
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
            }}>
                <div style={{ overflowX: 'auto' }}>
                    <table style={{
                        width: '100%',
                        borderCollapse: 'collapse',
                        minWidth: '600px'
                    }}>
                        <thead>
                            <tr style={{ background: t.bg }}>
                                <th style={{
                                    padding: '1rem',
                                    textAlign: 'left',
                                    color: t.text,
                                    fontWeight: '600',
                                    fontSize: '0.875rem',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.05em'
                                }}>
                                    Product
                                </th>
                                <th style={{
                                    padding: '1rem',
                                    textAlign: 'left',
                                    color: t.text,
                                    fontWeight: '600',
                                    fontSize: '0.875rem',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.05em'
                                }}>
                                    Category
                                </th>
                                <th style={{
                                    padding: '1rem',
                                    textAlign: 'left',
                                    color: t.text,
                                    fontWeight: '600',
                                    fontSize: '0.875rem',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.05em'
                                }}>
                                    Price
                                </th>
                                <th style={{
                                    padding: '1rem',
                                    textAlign: 'left',
                                    color: t.text,
                                    fontWeight: '600',
                                    fontSize: '0.875rem',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.05em'
                                }}>
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan="4"
                                        style={{
                                            padding: '3rem',
                                            textAlign: 'center',
                                            color: t.textSec
                                        }}
                                    >
                                        No products found. Click "Add Product" to create your first product.
                                    </td>
                                </tr>
                            ) : (
                                products.map((product, index) => (
                                    <tr
                                        key={product.id}
                                        style={{
                                            borderBottom: index < products.length - 1 ? `1px solid ${t.border}` : 'none',
                                            transition: 'background-color 0.2s ease'
                                        }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.backgroundColor = isDarkMode ? '#2d3748' : '#f8fafc';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.backgroundColor = 'transparent';
                                        }}
                                    >
                                        <td style={{ padding: '1rem' }}>
                                            <div style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '0.75rem'
                                            }}>
                                                <img
                                                    src={product.image}
                                                    alt={product.name}
                                                    style={{
                                                        width: '50px',
                                                        height: '50px',
                                                        objectFit: 'cover',
                                                        borderRadius: '6px',
                                                        border: `1px solid ${t.border}`
                                                    }}
                                                    onError={(e) => {
                                                        e.target.style.display = 'none';
                                                    }}
                                                />
                                                <span style={{
                                                    color: t.text,
                                                    fontWeight: '500',
                                                    fontSize: '1rem'
                                                }}>
                                                    {product.name}
                                                </span>
                                            </div>
                                        </td>
                                        <td style={{
                                            padding: '1rem',
                                            color: t.textSec,
                                            fontSize: '0.875rem'
                                        }}>
                                            <span style={{
                                                background: isDarkMode ? '#374151' : '#f3f4f6',
                                                color: isDarkMode ? '#d1d5db' : '#374151',
                                                padding: '0.25rem 0.5rem',
                                                borderRadius: '4px',
                                                fontSize: '0.75rem',
                                                fontWeight: '500'
                                            }}>
                                                {product.category}
                                            </span>
                                        </td>
                                        <td style={{
                                            padding: '1rem',
                                            color: t.primary,
                                            fontWeight: '600',
                                            fontSize: '1rem'
                                        }}>
                                            ${product.price}
                                        </td>
                                        <td style={{ padding: '1rem' }}>
                                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                <button
                                                    onClick={() => openModal('edit', product)}
                                                    disabled={isModalOpen}
                                                    style={{
                                                        background: isModalOpen ? t.textSec : t.primary,
                                                        color: 'white',
                                                        border: 'none',
                                                        padding: '0.5rem',
                                                        borderRadius: '6px',
                                                        cursor: isModalOpen ? 'not-allowed' : 'pointer',
                                                        opacity: isModalOpen ? 0.5 : 1,
                                                        transition: 'all 0.2s ease',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center'
                                                    }}
                                                    title="Edit product"
                                                >
                                                    <Edit size={14} />
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteProduct(product.id)}
                                                    disabled={isModalOpen}
                                                    style={{
                                                        background: isModalOpen ? t.textSec : t.danger,
                                                        color: 'white',
                                                        border: 'none',
                                                        padding: '0.5rem',
                                                        borderRadius: '6px',
                                                        cursor: isModalOpen ? 'not-allowed' : 'pointer',
                                                        opacity: isModalOpen ? 0.5 : 1,
                                                        transition: 'all 0.2s ease',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center'
                                                    }}
                                                    title="Delete product"
                                                >
                                                    <Trash2 size={14} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal */}
            <CustomModal
                isOpen={modalState.isOpen}
                onClose={closeModal}
                title={modalState.type === 'add' ? 'Add New Product' : 'Edit Product'}
                isDarkMode={isDarkMode}
                theme={theme}
            >
                <ProductForm
                    product={modalState.product}
                    onSave={handleSaveProduct}
                    onCancel={closeModal}
                    isDarkMode={isDarkMode}
                    theme={theme}
                />
            </CustomModal>
        </div>
    );
};

export default Product;