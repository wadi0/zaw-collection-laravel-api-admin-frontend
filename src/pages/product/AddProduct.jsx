import React, { useState, useEffect } from 'react';

// Reusable AddProduct component
const AddProduct = ({
  isDarkMode,
  isMobile,
  theme,
  editingProduct = null,
  categories = [
    { id: 1, name: 'Electronics', count: 15 },
    { id: 2, name: 'Fashion', count: 8 },
    { id: 3, name: 'Home', count: 12 }
  ],
  onSubmit,
  onCancel
}) => {
  const [productForm, setProductForm] = useState({
    name: '',
    price: '',
    category: '',
    image: ''
  });

  const t = isDarkMode ? theme.dark : theme.light;

  useEffect(() => {
    if (editingProduct) {
      setProductForm({
        name: editingProduct.name || '',
        price: editingProduct.price?.toString() || '',
        category: editingProduct.category || '',
        image: editingProduct.image || ''
      });
    } else {
      setProductForm({ name: '', price: '', category: '', image: '' });
    }
  }, [editingProduct]);

  const handleSubmit = () => {
    if (!productForm.name || !productForm.price || !productForm.category || !productForm.image) {
      alert('Please fill in all fields');
      return;
    }

    const productData = {
      ...productForm,
      price: parseFloat(productForm.price),
      id: editingProduct ? editingProduct.id : Date.now()
    };

    if (onSubmit) {
      onSubmit(productData);
    }

    // Reset form
    setProductForm({ name: '', price: '', category: '', image: '' });
  };

  const handleCancel = () => {
    setProductForm({ name: '', price: '', category: '', image: '' });
    if (onCancel) {
      onCancel();
    }
  };

  return (
    <div>
      <h1 style={{
        margin: '0 0 2rem',
        color: t.text,
        fontSize: '2rem'
      }}>
        {editingProduct ? 'Edit Product' : 'Add Product'}
      </h1>

      <div style={{
        background: t.cardBg,
        padding: '2rem',
        borderRadius: '12px',
        border: `1px solid ${t.border}`
      }}>
        <div style={{ display: 'grid', gap: '1.5rem' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)',
            gap: '1rem'
          }}>
            <input
              type="text"
              placeholder="Product Name"
              value={productForm.name}
              onChange={(e) => setProductForm({...productForm, name: e.target.value})}
              style={{
                padding: '0.75rem',
                border: `1px solid ${t.border}`,
                borderRadius: '8px',
                background: t.bg,
                color: t.text
              }}
              required
            />
            <input
              type="number"
              placeholder="Price"
              value={productForm.price}
              onChange={(e) => setProductForm({...productForm, price: e.target.value})}
              style={{
                padding: '0.75rem',
                border: `1px solid ${t.border}`,
                borderRadius: '8px',
                background: t.bg,
                color: t.text
              }}
              required
            />
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)',
            gap: '1rem'
          }}>
            <select
              value={productForm.category}
              onChange={(e) => setProductForm({...productForm, category: e.target.value})}
              style={{
                padding: '0.75rem',
                border: `1px solid ${t.border}`,
                borderRadius: '8px',
                background: t.bg,
                color: t.text
              }}
              required
            >
              <option value="">Select Category</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.name}>{cat.name}</option>
              ))}
            </select>
            <input
              type="url"
              placeholder="Image URL"
              value={productForm.image}
              onChange={(e) => setProductForm({...productForm, image: e.target.value})}
              style={{
                padding: '0.75rem',
                border: `1px solid ${t.border}`,
                borderRadius: '8px',
                background: t.bg,
                color: t.text
              }}
              required
            />
          </div>

          {/* Image preview */}
          {productForm.image && (
            <div style={{ textAlign: 'center' }}>
              <p style={{ color: t.textSec, margin: '0 0 1rem' }}>Image Preview:</p>
              <img
                src={productForm.image}
                alt="Product preview"
                style={{
                  maxWidth: '200px',
                  maxHeight: '200px',
                  objectFit: 'cover',
                  borderRadius: '8px',
                  border: `1px solid ${t.border}`
                }}
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
            </div>
          )}

          <div style={{ display: 'flex', gap: '1rem' }}>
            <button
              onClick={handleSubmit}
              style={{
                background: t.gradient,
                color: 'white',
                border: 'none',
                padding: '0.75rem 1.5rem',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: '600'
              }}
            >
              {editingProduct ? 'Update' : 'Add'} Product
            </button>
            {editingProduct && (
              <button
                onClick={handleCancel}
                style={{
                  background: t.textSec,
                  color: 'white',
                  border: 'none',
                  padding: '0.75rem 1.5rem',
                  borderRadius: '8px',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Demo component for testing AddProduct
const AddProductDemo = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

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

  const handleSubmit = (productData) => {
    console.log('Product submitted:', productData);
    alert(`Product ${editingProduct ? 'updated' : 'added'} successfully!`);
  };

  const handleCancel = () => {
    setEditingProduct(null);
  };

  const sampleProduct = {
    id: 1,
    name: 'Sample Product',
    price: 99,
    category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=400&h=300&fit=crop'
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: isDarkMode ? theme.dark.bg : theme.light.bg,
      padding: '2rem'
    }}>
      <div style={{ marginBottom: '2rem', display: 'flex', gap: '1rem' }}>
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
        <button
          onClick={() => setEditingProduct(editingProduct ? null : sampleProduct)}
          style={{
            padding: '0.5rem 1rem',
            borderRadius: '4px',
            border: 'none',
            background: '#10b981',
            color: 'white',
            cursor: 'pointer'
          }}
        >
          {editingProduct ? 'Switch to Add Mode' : 'Switch to Edit Mode'}
        </button>
      </div>

      <AddProduct
        isDarkMode={isDarkMode}
        isMobile={false}
        theme={theme}
        editingProduct={editingProduct}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
      />
    </div>
  );
};

export default AddProductDemo; // Export the demo component
// Optionally, export the AddProduct component if needed elsewhere
export { AddProduct };