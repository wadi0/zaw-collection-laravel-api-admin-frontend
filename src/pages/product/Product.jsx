import React, { useState } from 'react';
import { Plus, Edit, Trash2, X } from 'lucide-react';
import CustomModal from "../../components/customModal/CustomModal.jsx";
import AddProduct from "./AddProduct.jsx";
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
    marginBottom: '1rem'
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

// Updated Product component
const Product = ({
  isDarkMode,
  theme,
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
        <h1 style={{ margin: 0, color: t.text, fontSize: '2rem' }}>Products</h1>
        <button
          onClick={() => openModal('add')}
          style={{
            background: t.gradient,
            color: 'white',
            border: 'none',
            padding: '0.75rem 1rem',
            borderRadius: '8px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}
        >
          <Plus size={18} /> Add Product
        </button>
      </div>

      <div style={{
        background: t.cardBg,
        borderRadius: '12px',
        border: `1px solid ${t.border}`,
        overflow: 'hidden'
      }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: t.bg }}>
                <th style={{ padding: '1rem', textAlign: 'left', color: t.text }}>Product</th>
                <th style={{ padding: '1rem', textAlign: 'left', color: t.text }}>Category</th>
                <th style={{ padding: '1rem', textAlign: 'left', color: t.text }}>Price</th>
                <th style={{ padding: '1rem', textAlign: 'left', color: t.text }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map(product => (
                <tr key={product.id} style={{ borderBottom: `1px solid ${t.border}` }}>
                  <td style={{ padding: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <img
                        src={product.image}
                        alt={product.name}
                        style={{
                          width: '50px',
                          height: '50px',
                          objectFit: 'cover',
                          borderRadius: '6px'
                        }}
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                      <span style={{ color: t.text, fontWeight: '500' }}>{product.name}</span>
                    </div>
                  </td>
                  <td style={{ padding: '1rem', color: t.textSec }}>{product.category}</td>
                  <td style={{ padding: '1rem', color: t.primary, fontWeight: '600' }}>${product.price}</td>
                  <td style={{ padding: '1rem' }}>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button
                        onClick={() => openModal('edit', product)}
                        style={{
                          background: t.primary,
                          color: 'white',
                          border: 'none',
                          padding: '0.5rem',
                          borderRadius: '6px',
                          cursor: 'pointer'
                        }}
                        title="Edit product"
                      >
                        <Edit size={14} />
                      </button>
                      <button
                        onClick={() => onDeleteProduct && onDeleteProduct(product.id)}
                        style={{
                          background: t.danger,
                          color: 'white',
                          border: 'none',
                          padding: '0.5rem',
                          borderRadius: '6px',
                          cursor: 'pointer'
                        }}
                        title="Delete product"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
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
          <AddProduct />
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

// Demo component for testing Product with Modal
const ProductDemo = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [products, setProducts] = useState([
    { id: 1, name: 'MacBook Pro', price: 1299, category: 'Electronics', image: 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=400&h=300&fit=crop' },
    { id: 2, name: 'iPhone 15', price: 999, category: 'Electronics', image: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400&h=300&fit=crop' },
    { id: 3, name: 'Nike Shoes', price: 150, category: 'Fashion', image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=300&fit=crop' }
  ]);

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

  const handleAddProduct = (product) => {
    setProducts([...products, product]);
  };

  const handleEditProduct = (updatedProduct) => {
    setProducts(products.map(p => p.id === updatedProduct.id ? updatedProduct : p));
  };

  const handleDeleteProduct = (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      setProducts(products.filter(p => p.id !== id));
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: isDarkMode ? theme.dark.bg : theme.light.bg,
      padding: '1rem'
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

      <Product
        isDarkMode={isDarkMode}
        theme={theme}
        products={products}
        onAddProduct={handleAddProduct}
        onEditProduct={handleEditProduct}
        onDeleteProduct={handleDeleteProduct}
      />
    </div>
  );
};

export default ProductDemo;
export { Product, ProductForm };