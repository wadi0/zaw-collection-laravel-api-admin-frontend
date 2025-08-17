import React, { useState } from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { useApp } from "../../context/AppContext.jsx";
import CustomModal from "../../components/customModal/CustomModal.jsx";

// Category Form Component
const CategoryForm = ({ category, onSave, onCancel, isDarkMode, theme }) => {
    const [formData, setFormData] = useState({
        name: category?.name || '',
        description: category?.description || ''
    });

    const t = isDarkMode ? theme.dark : theme.light;

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = () => {
        if (!formData.name) {
            alert('Please fill in the category name');
            return;
        }
        onSave({
            ...formData,
            name: formData.name.trim(),
            id: category?.id || Date.now(),
            count: category?.count || 0
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
                <label style={labelStyle}>Category Name</label>
                <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    style={inputStyle}
                    placeholder="Enter category name"
                />
            </div>

            <div>
                <label style={labelStyle}>Description</label>
                <input
                    type="text"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    style={inputStyle}
                    placeholder="Enter category description (optional)"
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
                    {category ? 'Update' : 'Save'}
                </button>
            </div>
        </div>
    );
};

// Main Categories Component
const Categories = ({
    categories = [
        { id: 1, name: 'Electronics', description: 'Electronic devices and gadgets', count: 15 },
        { id: 2, name: 'Fashion', description: 'Clothing and accessories', count: 8 },
        { id: 3, name: 'Home', description: 'Home and garden items', count: 12 },
        { id: 4, name: 'Books', description: 'Books and educational materials', count: 5 },
        { id: 5, name: 'Sports', description: 'Sports and fitness equipment', count: 7 }
    ],
    onAddCategory,
    onEditCategory,
    onDeleteCategory
}) => {
    const [modalState, setModalState] = useState({
        isOpen: false,
        type: null, // 'add' or 'edit'
        category: null
    });

    // Temporary debug version - comment out useApp if causing issues
    const { isDarkMode, theme, isModalOpen } = useApp();
    const t = isDarkMode ? theme?.dark : theme?.light;

    // Fallback theme if useApp is causing issues
    // const isDarkMode = false;
    // const isModalOpen = false;
    // const t = {
    //     text: '#000',
    //     bg: '#fff',
    //     cardBg: '#fff',
    //     border: '#e2e8f0',
    //     textSec: '#64748b',
    //     primary: '#3b82f6',
    //     danger: '#ef4444',
    //     gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    // };

    const openModal = (type, category = null) => {
        setModalState({
            isOpen: true,
            type,
            category
        });
    };

    const closeModal = () => {
        setModalState({
            isOpen: false,
            type: null,
            category: null
        });
    };

    const handleSaveCategory = (categoryData) => {
        if (modalState.type === 'add') {
            onAddCategory && onAddCategory(categoryData);
        } else if (modalState.type === 'edit') {
            onEditCategory && onEditCategory(categoryData);
        }
        closeModal();
    };

    const handleDeleteCategory = (id) => {
        if (window.confirm('Are you sure you want to delete this category?')) {
            onDeleteCategory && onDeleteCategory(id);
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
                    Categories
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
                    <Plus size={18} /> Add Category
                </button>
            </div>

            {/* Categories Table */}
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
                                    Description
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
                                    Products
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
                            {categories.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan="4"
                                        style={{
                                            padding: '3rem',
                                            textAlign: 'center',
                                            color: t.textSec
                                        }}
                                    >
                                        No categories found. Click "Add Category" to create your first category.
                                    </td>
                                </tr>
                            ) : (
                                categories.map((category, index) => (
                                    <tr
                                        key={category.id}
                                        style={{
                                            borderBottom: index < categories.length - 1 ? `1px solid ${t.border}` : 'none',
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
                                            <span style={{
                                                color: t.text,
                                                fontWeight: '500',
                                                fontSize: '1rem'
                                            }}>
                                                {category.name}
                                            </span>
                                        </td>
                                        <td style={{
                                            padding: '1rem',
                                            color: t.textSec,
                                            fontSize: '0.875rem'
                                        }}>
                                            {category.description || 'No description'}
                                        </td>
                                        <td style={{
                                            padding: '1rem',
                                            color: t.primary,
                                            fontWeight: '600',
                                            fontSize: '1rem'
                                        }}>
                                            <span style={{
                                                background: isDarkMode ? '#374151' : '#f3f4f6',
                                                color: isDarkMode ? '#d1d5db' : '#374151',
                                                padding: '0.25rem 0.5rem',
                                                borderRadius: '4px',
                                                fontSize: '0.75rem',
                                                fontWeight: '500'
                                            }}>
                                                {category.count} product{category.count !== 1 ? 's' : ''}
                                            </span>
                                        </td>
                                        <td style={{ padding: '1rem' }}>
                                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                <button
                                                    onClick={() => openModal('edit', category)}
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
                                                    title="Edit category"
                                                >
                                                    <Edit size={14} />
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteCategory(category.id)}
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
                                                    title="Delete category"
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
                title={modalState.type === 'add' ? 'Add New Category' : 'Edit Category'}
                isDarkMode={isDarkMode}
                theme={theme}
            >
                <CategoryForm
                    category={modalState.category}
                    onSave={handleSaveCategory}
                    onCancel={closeModal}
                    isDarkMode={isDarkMode}
                    theme={theme}
                />
            </CustomModal>
        </div>
    );
};

export default Categories;