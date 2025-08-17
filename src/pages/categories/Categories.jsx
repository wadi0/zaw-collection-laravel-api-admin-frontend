import React, {useEffect, useState} from 'react';
import {Plus} from 'lucide-react';
import {useApp} from "../../context/AppContext.jsx";
import CustomModal from "../../components/customModal/CustomModal.jsx";
import CustomInput from "../../components/customInput/CustomInput.jsx";
import {Form, Formik} from "formik";
import AxiosServices from "../../components/network/AxiosServices.jsx";
import ApiUrlServices from "../../components/network/ApiUrlServices.jsx";
import CustomButton from "../../components/customButton/CustomButton.jsx";
import CustomTable from "../../components/customTable/CustomTable.jsx";

const Categories = ({onDeleteCategory}) => {
    // State for categories data from API
    const [categories, setCategories] = useState([]);
    const [loadingCategories, setLoadingCategories] = useState(true);

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

    // Table columns configuration
    const tableColumns = [
        {
            title: 'ID',
            key: 'id',
            type: 'text',
            align: 'center',
            width: '60px',
            minWidth: '60px'
        },
        {
            title: 'Category Name',
            key: 'name',
            type: 'text',
            primary: true,
            align: 'left',
            width: '100%'
        }
    ];

    // Fetch categories from API - WITHOUT pagination
    const fetchCategories = async () => {
        setLoadingCategories(true);
        try {
            const response = await AxiosServices.get(ApiUrlServices.All_CATEGORIES);
            console.log('Categories API Response:', response);

            let processedData = [];

            if (response.data && Array.isArray(response.data)) {
                // Direct array from Category::all()
                processedData = response.data.map(category => ({
                    id: category.id,
                    name: category.name
                }));
            } else if (Array.isArray(response)) {
                // Sometimes response comes directly as array
                processedData = response.map(category => ({
                    id: category.id,
                    name: category.name
                }));
            }

            setCategories(processedData);

        } catch (error) {
            console.error('Error fetching categories:', error);
            setCategories([]);
        } finally {
            setLoadingCategories(false);
        }
    };

    // Load categories on component mount
    useEffect(() => {
        fetchCategories();
    }, []);

    // Form validation
    const validateCategoriesForm = (values) => {
        const errors = {};
        if (!values.categories.trim()) errors.categories = 'Category name is required';
        return errors;
    };

    // Form submit handler for Add/Edit
    const categoriesFormSubmit = async (values, {resetForm}) => {
        setLoading(true);
        let payload = {
            name: values.categories
        };

        try {
            let response;
            if (modalState.type === 'add') {
                // Add new category
                response = await AxiosServices.post(ApiUrlServices.ADD_CATEGORIES, payload);
                console.log('Category added:', response);
            } else if (modalState.type === 'edit' && modalState.category) {
                // Update existing category
                payload.id = modalState.category.id;
                response = await AxiosServices.put(`${ApiUrlServices.UPDATE_CATEGORIES}/${modalState.category.id}`, payload);
                console.log('Category updated:', response);
            }

            // Refresh categories list after successful operation
            await fetchCategories();
            resetForm();
            closeModal();
        } catch (error) {
            console.error('Operation error:', error);
        } finally {
            setLoading(false);
        }
    };

    // Delete category handler
    const handleDeleteCategory = async (category) => {
        try {
            await AxiosServices.delete(`${ApiUrlServices.DELETE_CATEGORIES}/${category.id}`);
            console.log('Category deleted:', category.id);

            // Refresh categories list after deletion
            await fetchCategories();

            // Call parent callback if provided
            if (onDeleteCategory) {
                onDeleteCategory(category.id);
            }
        } catch (error) {
            console.error('Delete error:', error);
        }
    };

    // Edit category handler
    const handleEditCategory = (category) => {
        openModal('edit', category);
    };

    // View category handler (optional)
    const handleViewCategory = (category) => {
        console.log('View category:', category);
        // You can implement view functionality here
    };

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

    const handleAddClick = () => {
        openModal('add');
    };

    // Initial form values
    const getInitialValues = () => ({
        categories: modalState.category?.name || ''
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

            {/* Custom Table - WITHOUT pagination */}
            <CustomTable
                data={categories}
                columns={tableColumns}
                onEdit={handleEditCategory}
                onDelete={handleDeleteCategory}
                onView={handleViewCategory}
                loading={loadingCategories}
                emptyMessage="No categories found. Click 'Add Category' to create your first category."
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










