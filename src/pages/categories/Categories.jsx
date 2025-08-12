import React, { useState, useEffect } from 'react';
import { Edit, Trash2 } from 'lucide-react';

// Reusable Categories component
const Categories = ({
  isDarkMode,
  isMobile,
  theme,
  categories = [
    { id: 1, name: 'Electronics', count: 15 },
    { id: 2, name: 'Fashion', count: 8 },
    { id: 3, name: 'Home', count: 12 }
  ],
  onAddCategory,
  onEditCategory,
  onDeleteCategory,
  editingCategory = null
}) => {
  const [categoryForm, setCategoryForm] = useState({ name: '' });
  const t = isDarkMode ? theme.dark : theme.light;

  useEffect(() => {
    if (editingCategory) {
      setCategoryForm({ name: editingCategory.name || '' });
    } else {
      setCategoryForm({ name: '' });
    }
  }, [editingCategory]);

  const handleSubmit = () => {
    if (!categoryForm.name.trim()) {
      alert('Please enter a category name');
      return;
    }

    const categoryData = {
      ...categoryForm,
      id: editingCategory ? editingCategory.id : Date.now(),
      count: editingCategory ? editingCategory.count : 0
    };

    if (editingCategory) {
      if (onEditCategory) onEditCategory(categoryData);
    } else {
      if (onAddCategory) onAddCategory(categoryData);
    }

    setCategoryForm({ name: '' });
  };

  const handleCancel = () => {
    setCategoryForm({ name: '' });
    if (onEditCategory) onEditCategory(null); // Reset editing state
  };

  return (
    <div>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '2rem',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <h1 style={{ margin: 0, color: t.text, fontSize: '2rem' }}>Categories</h1>
      </div>

      <div style={{
        marginBottom: '2rem',
        background: t.cardBg,
        padding: '1.5rem',
        borderRadius: '12px',
        border: `1px solid ${t.border}`
      }}>
        <h3 style={{ margin: '0 0 1rem', color: t.text }}>
          {editingCategory ? 'Edit Category' : 'Add New Category'}
        </h3>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <input
            type="text"
            placeholder="Category Name"
            value={categoryForm.name}
            onChange={(e) => setCategoryForm({...categoryForm, name: e.target.value})}
            style={{
              flex: 1,
              minWidth: '200px',
              padding: '0.75rem',
              border: `1px solid ${t.border}`,
              borderRadius: '8px',
              background: t.bg,
              color: t.text
            }}
            required
          />
          <button
            onClick={handleSubmit}
            style={{
              background: t.gradient,
              color: 'white',
              border: 'none',
              padding: '0.75rem 1rem',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: '600'
            }}
          >
            {editingCategory ? 'Update' : 'Add'} Category
          </button>
          {editingCategory && (
            <button
              onClick={handleCancel}
              style={{
                background: t.textSec,
                color: 'white',
                border: 'none',
                padding: '0.75rem 1rem',
                borderRadius: '8px',
                cursor: 'pointer'
              }}
            >
              Cancel
            </button>
          )}
        </div>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)',
        gap: '1.5rem'
      }}>
        {categories.map(category => (
          <div
            key={category.id}
            style={{
              background: t.cardBg,
              padding: '1.5rem',
              borderRadius: '12px',
              border: `1px solid ${t.border}`,
              transition: 'transform 0.2s, box-shadow 0.2s'
            }}
          >
            <h3 style={{ margin: '0 0 0.5rem', color: t.text }}>{category.name}</h3>
            <p style={{ margin: '0 0 1rem', color: t.textSec }}>
              {category.count} product{category.count !== 1 ? 's' : ''}
            </p>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                onClick={() => onEditCategory && onEditCategory(category)}
                style={{
                  background: t.primary,
                  color: 'white',
                  border: 'none',
                  padding: '0.5rem',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
                title="Edit category"
              >
                <Edit size={14} />
              </button>
              <button
                onClick={() => onDeleteCategory && onDeleteCategory(category.id)}
                style={{
                  background: t.danger,
                  color: 'white',
                  border: 'none',
                  padding: '0.5rem',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
                title="Delete category"
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {categories.length === 0 && (
        <div style={{
          textAlign: 'center',
          padding: '3rem',
          color: t.textSec
        }}>
          <p>No categories found. Add your first category above!</p>
        </div>
      )}
    </div>
  );
};

// Demo component for testing Categories
const CategoriesDemo = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [categories, setCategories] = useState([
    { id: 1, name: 'Electronics', count: 15 },
    { id: 2, name: 'Fashion', count: 8 },
    { id: 3, name: 'Home', count: 12 }
  ]);
  const [editingCategory, setEditingCategory] = useState(null);

  const theme = {
    light: {
      bg: '#f8fafc', cardBg: '#ffffff', text: '#1e293b', textSec: '#64748b',
      border: '#e2e8f0', primary: '#3b82f6', success: '#10b981', danger: '#ef4444',
      gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    },
    dark: {
      bg: '#0f172a', cardBg: '#1e293b', text: '#f1f5f9', textSec: '#94a3b8',
      border: '#334155', primary: '#60a5fa', success: '#34d399', danger: '#f87171',
      gradient: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)'
    }
  };

  const handleAddCategory = (categoryData) => {
    setCategories([...categories, categoryData]);
    alert('Category added successfully!');
  };

  const handleEditCategory = (categoryData) => {
    if (categoryData === null) {
      setEditingCategory(null);
      return;
    }

    if (categoryData.id) {
      setCategories(categories.map(c => c.id === categoryData.id ? categoryData : c));
      setEditingCategory(null);
      alert('Category updated successfully!');
    } else {
      setEditingCategory(categoryData);
    }
  };

  const handleDeleteCategory = (id) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      setCategories(categories.filter(c => c.id !== id));
      if (editingCategory && editingCategory.id === id) {
        setEditingCategory(null);
      }
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: isDarkMode ? theme.dark.bg : theme.light.bg,
      padding: '2rem'
    }}>
      <div style={{ marginBottom: '2rem' }}>
        <button
          onClick={() => setIsDarkMode(!isDarkMode)}
          style={{
            padding: '0.5rem 1rem',
            borderRadius: '4px',
            border: 'none',
            background: '#3b82f6',
            color: 'white',
            cursor: 'pointer'
          }}
        >
          Toggle Dark Mode
        </button>
      </div>

      <Categories
        isDarkMode={isDarkMode}
        isMobile={false}
        theme={theme}
        categories={categories}
        onAddCategory={handleAddCategory}
        onEditCategory={handleEditCategory}
        onDeleteCategory={handleDeleteCategory}
        editingCategory={editingCategory}
      />
    </div>
  );
};

export default CategoriesDemo; // Export the demo component
export { Categories }; // Export the reusable component