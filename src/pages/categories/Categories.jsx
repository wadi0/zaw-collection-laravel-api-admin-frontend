import React, {useEffect, useState} from 'react';
import {Plus, Edit, Trash2} from 'lucide-react';
import {useApp} from "../../context/AppContext.jsx";
import CustomModal from "../../components/customModal/CustomModal.jsx";
import CustomInput from "../../components/customInput/CustomInput.jsx";
import {Form, Formik} from "formik";
import AxiosServices from "../../components/network/AxiosServices.jsx";
import ApiUrlServices from "../../components/network/ApiUrlServices.jsx";
import CustomButton from "../../components/customButton/CustomButton.jsx";

// Main Categories Component
const Categories = ({
                        categories = [
                            {id: 1, name: 'Electronics', description: 'Electronic devices and gadgets', count: 15},
                            {id: 2, name: 'Fashion', description: 'Clothing and accessories', count: 8},
                            {id: 3, name: 'Home', description: 'Home and garden items', count: 12},
                            {id: 4, name: 'Books', description: 'Books and educational materials', count: 5},
                            {id: 5, name: 'Sports', description: 'Sports and fitness equipment', count: 7}
                        ],
                        onDeleteCategory
                    }) => {
    const [modalState, setModalState] = useState({
        isOpen: false,
        type: null,
        category: null
    });
    const [loading, setLoading] = useState(false);

    // Get context values
    const contextValue = useApp();
    const {isDarkMode, theme} = contextValue;

    // Safe theme access
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

    // Form validation
    const validateCategoriesForm = (values) => {
        const errors = {};
        if (!values.categories.trim()) errors.categories = 'Category name is required';
        return errors;
    };

    // Form submit handler
    const categoriesFormSubmit = async (values, {resetForm}) => {
        setLoading(true);
        let payload = {
            name: values.categories,
        };
        try {
            await AxiosServices.post(ApiUrlServices.ADD_CATEGORIES, payload)
                .then((res) => {
                    console.log('Operation successful:', res);
                    resetForm();
                    closeModal();
                });
        } catch (error) {
            console.error('Operation error:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        AxiosServices.get(ApiUrlServices.All_CATEGORIES)
            .then((res)=>{
                console.log(res)
        }).catch((error)=>{
            console.log(error)
        })
    }, []);

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
        setLoading(false);
    };

    const handleDeleteCategory = (id) => {
        if (window.confirm('Are you sure you want to delete this category?')) {
            if (onDeleteCategory) {
                onDeleteCategory(id);
            }
        }
    };

    const handleEditClick = (category) => {
        openModal('edit', category);
    };

    const handleAddClick = () => {
        openModal('add');
    };

    // Initial form values
    const getInitialValues = () => ({
        categories: modalState.category?.name || '',
        description: modalState.category?.description || ''
    });

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
                    Categories
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
                    <Plus size={18}/> Add Category
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
                <div style={{overflowX: 'auto'}}>
                    <table style={{
                        width: '100%',
                        borderCollapse: 'collapse',
                        minWidth: '600px'
                    }}>
                        <thead>
                        <tr style={{background: t.bg}}>
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
                                    <td style={{padding: '1rem'}}>
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
                                    <td style={{padding: '1rem'}}>
                                        <div style={{display: 'flex', gap: '0.5rem'}}>
                                            <button
                                                type="button"
                                                onClick={() => handleEditClick(category)}
                                                style={{
                                                    background: t.primary,
                                                    color: 'white',
                                                    border: 'none',
                                                    padding: '0.5rem',
                                                    borderRadius: '6px',
                                                    cursor: 'pointer',
                                                    transition: 'all 0.2s ease',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center'
                                                }}
                                                title="Edit category"
                                            >
                                                <Edit size={14}/>
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => handleDeleteCategory(category.id)}
                                                style={{
                                                    background: t.danger,
                                                    color: 'white',
                                                    border: 'none',
                                                    padding: '0.5rem',
                                                    borderRadius: '6px',
                                                    cursor: 'pointer',
                                                    transition: 'all 0.2s ease',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center'
                                                }}
                                                title="Delete category"
                                            >
                                                <Trash2 size={14}/>
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

            {/* Modal with Direct Form */}
            <CustomModal
                isOpen={modalState.isOpen}
                onClose={closeModal}
                title={modalState.type === 'add' ? 'Add New Category' : 'Edit Category'}
                isDarkMode={isDarkMode}
                theme={theme}
            >
                <Formik
                    initialValues={getInitialValues()}
                    validate={validateCategoriesForm}
                    onSubmit={categoriesFormSubmit}
                    enableReinitialize={true}
                >
                    <Form>
                        <div className="mb-3">
                            <CustomInput
                                name="categories"
                                label="Category name"
                                placeholder="Enter category name"
                                labelClassName="signin-label"
                                inputClassName="signin-input"
                            />
                        </div>

                        <div style={{display: 'flex', gap: '0.5rem', justifyContent: 'flex-end'}}>
                            <CustomButton
                                isLoading={loading}
                                type="submit"
                                label={modalState.type === 'add' ? 'Add Category' : 'Update Category'}
                                btnClassName="default-submit-btn signin-btn"
                            />
                        </div>
                    </Form>
                </Formik>
            </CustomModal>
        </div>
    );
};

export default Categories;