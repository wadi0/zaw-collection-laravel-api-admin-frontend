import React, { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { useApp } from "../../context/AppContext.jsx";
import CustomModal from "../../components/customModal/CustomModal.jsx";
import CustomInput from "../../components/customInput/CustomInput.jsx";
import { Form, Formik } from "formik";
import AxiosServices from "../../components/network/AxiosServices.jsx";
import ApiUrlServices from "../../components/network/ApiUrlServices.jsx";
import CustomButton from "../../components/customButton/CustomButton.jsx";
import CustomTable from "../../components/customTable/CustomTable.jsx";
import { toast } from "react-toastify";

const Categories = ({ onDeleteCategory }) => {
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [modalState, setModalState] = useState({
    isOpen: false,
    type: null,
    category: null,
  });
  const [loading, setLoading] = useState(false);
  const contextValue = useApp();
  const { isDarkMode, theme } = contextValue;
  const [pagination, setPagination] = useState(null);

  const t =
    isDarkMode && theme?.dark
      ? theme.dark
      : theme?.light || {
          text: "#1e293b",
          bg: "#f8fafc",
          cardBg: "#ffffff",
          border: "#e2e8f0",
          textSec: "#64748b",
          primary: "#3b82f6",
          danger: "#ef4444",
          gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        };

  // Table columns configuration
  const tableColumns = [
    {
      title: "Id",
      key: "id",
      type: "text",
      align: "center",
      width: "60px",
      minWidth: "60px",
    },
    {
      title: "Category Name",
      key: "category_name",
      type: "text",
      primary: true,
      align: "left",
      width: "100%",
    },
  ];

  // Handle page change
  const handlePageChange = (page) => {
    fetchCategories(page, pagination?.per_page || 10);
  };

  // Handle per-page change
  const handlePerPageChange = (perPage) => {
    fetchCategories(1, perPage);
  };

  const fetchCategories = async (page = 1, perPage = 10) => {
    setLoadingCategories(true);
    try {
      const response = await AxiosServices.get(
        `${ApiUrlServices.ALL_CATEGORIES}?page=${page}&per_page=${perPage}`
      );

      if (response.data && response.data.data) {
        const paginationData = response.data.data;

        const processedData = paginationData.data.map((category) => ({
          id: category.id,
          category_name: category.category_name
            .toLowerCase()
            .split(" ")
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" "),
        }));

        setCategories(processedData);

        setPagination({
          current_page: paginationData.current_page,
          last_page: paginationData.last_page,
          per_page: paginationData.per_page,
          total: paginationData.total,
          from: paginationData.from,
          to: paginationData.to,
        });
      } else {
        setCategories([]);
        setPagination(null);
      }
      // toast.success("Categories fetch successfully.")
    } catch (error) {
      setCategories([]);
      setPagination(null);
      toast.error("Something went wrong!");
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
    if (!values.category_name.trim())
      errors.category_name = "Category name is required";
    return errors;
  };

  // Form submit handler for Add/Edit
  const categoriesFormSubmit = async (values, { resetForm }) => {
    setLoading(true);
    let payload = {
      category_name: values.category_name,
    };

    try {
      let response;
      if (modalState.type === "add") {
        response = await AxiosServices.post(
          ApiUrlServices.ADD_CATEGORIES,
          payload
        );
        toast.success("Categories added successfully.");
      } else if (modalState.type === "edit" && modalState.category) {
        payload.id = modalState.category.id;
        response = await AxiosServices.put(
          ApiUrlServices.UPDATE_CATEGORIES(modalState.category.id),
          payload
        );
        toast.success("Categories updated successfully.");
      }

      // Refresh categories list after successful operation
      await fetchCategories();
      resetForm();
      closeModal();
    } catch (error) {
      toast.error("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  // Delete category handler
  const handleDeleteCategory = async (category) => {
    try {
      await AxiosServices.delete(ApiUrlServices.DELETE_CATEGORIES(category.id));
      // Refresh categories list after deletion
      await fetchCategories();
      // Call parent callback if provided
      if (onDeleteCategory) {
        onDeleteCategory(category.id);
      }
      if (pagination) {
        setPagination((prev) => ({ ...prev, total: prev.total - 1 }));
      }
      toast.warning("Categories deleted successfully!");
    } catch (error) {
      toast.error("Something went wrong!");
    }
  };

  // Edit category handler
  const handleEditCategory = (category) => {
    openModal("edit", category);
  };

  // View category handler (optional)
  const handleViewCategory = (category) => {
    console.log("View category:", category);
    // You can implement view functionality here
  };

  const openModal = (type, category = null) => {
    setModalState({
      isOpen: true,
      type,
      category,
    });
  };

  const closeModal = () => {
    setModalState({
      isOpen: false,
      type: null,
      category: null,
    });
    setLoading(false);
  };

  const handleAddClick = () => {
    openModal("add");
  };

  // Initial form values
  const getInitialValues = () => ({
    category_name: modalState.category?.category_name || "",
  });

  return (
    <div style={{ padding: "1rem" }}>
      {/* Header Section */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "2rem",
          flexWrap: "wrap",
          gap: "1rem",
        }}
      >
        <h1
          style={{
            margin: 0,
            color: t.text,
            fontSize: "2rem",
            fontWeight: "600",
          }}
        >
          Categories
        </h1>
        <div style={{ width: "auto", display: "inline-block" }}>
          <CustomButton
            type="button"
            onClick={handleAddClick}
            label="Add Category"
          />
        </div>
      </div>

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
        pagination={pagination}
        onPageChange={handlePageChange}
        onPerPageChange={handlePerPageChange}
      />

      {/* Modal with Direct Form */}
      <CustomModal
        isOpen={modalState.isOpen}
        onClose={closeModal}
        title={modalState.type === "add" ? "Add New Category" : "Edit Category"}
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
                name="category_name"
                label="Category name"
                placeholder="Enter category name"
                labelClassName="signin-label"
                inputClassName="signin-input"
              />
            </div>

            <div
              style={{
                display: "flex",
                gap: "0.5rem",
                justifyContent: "flex-end",
              }}
            >
              <CustomButton
                isLoading={loading}
                type="submit"
                label={
                  modalState.type === "add" ? "Add Category" : "Update Category"
                }
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
