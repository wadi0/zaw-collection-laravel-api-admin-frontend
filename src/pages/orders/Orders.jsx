import React, { useState, useEffect, useMemo } from 'react';
import { Eye, Edit, RefreshCw, Search, Package, Truck, CheckCircle, XCircle, Clock, AlertCircle } from 'lucide-react';
import { useApp } from "../../context/AppContext.jsx";
import CustomModal from "../../components/customModal/CustomModal.jsx";
import AxiosServices from "../../components/network/AxiosServices.jsx";
import ApiUrlServices from "../../components/network/ApiUrlServices.jsx";
import CustomTable from "../../components/customTable/CustomTable.jsx";
import { toast } from "react-toastify";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [error, setError] = useState(null);
  const [modalState, setModalState] = useState({ isOpen: false, type: null, order: null });
  const [pagination, setPagination] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [paymentFilter, setPaymentFilter] = useState('all');
  const [updatingStatus, setUpdatingStatus] = useState(false);

  const contextValue = useApp();
  const { isDarkMode, theme } = contextValue;
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

  // Status options
  const statusOptions = [
    { value: 'pending', label: 'Pending', color: '#f59e0b', icon: Clock },
    { value: 'confirmed', label: 'Confirmed', color: '#3b82f6', icon: CheckCircle },
    { value: 'processing', label: 'Processing', color: '#8b5cf6', icon: Package },
    { value: 'shipped', label: 'Shipped', color: '#06b6d4', icon: Truck },
    { value: 'delivered', label: 'Delivered', color: '#10b981', icon: CheckCircle },
    { value: 'cancelled', label: 'Cancelled', color: '#ef4444', icon: XCircle }
  ];

  const paymentStatusOptions = [
    { value: 'pending', label: 'Pending', color: '#f59e0b' },
    { value: 'paid', label: 'Paid', color: '#10b981' },
    { value: 'failed', label: 'Failed', color: '#ef4444' },
    { value: 'refunded', label: 'Refunded', color: '#6b7280' }
  ];

  // Table columns configuration
  const tableColumns = [
    {
      title: 'Order Number',
      key: 'order_number',
      type: 'text',
      primary: true,
      align: 'left',
      width: '180px',
      render: (value) => (
        <div>
          <div style={{ fontWeight: '500', color: t.text }}>{value}</div>
          <div style={{ fontSize: '0.75rem', color: t.textSec }}>
            {/* Items count will be added in data processing */}
          </div>
        </div>
      )
    },
    {
      title: 'Customer',
      key: 'customer_info',
      type: 'text',
      align: 'left',
      width: '150px',
      render: (value) => (
        <div>
          <div style={{ fontWeight: '500', color: t.text }}>{value?.name || 'N/A'}</div>
          <div style={{ fontSize: '0.75rem', color: t.textSec }}>{value?.phone}</div>
        </div>
      )
    },
    {
      title: 'Status',
      key: 'status_badge',
      type: 'text',
      align: 'center',
      width: '120px',
      render: (value) => value
    },
    {
      title: 'Payment',
      key: 'payment_info',
      type: 'text',
      align: 'center',
      width: '120px',
      render: (value) => (
        <div>
          {value?.badge}
          <div style={{ fontSize: '0.75rem', color: t.textSec, textTransform: 'capitalize', marginTop: '2px' }}>
            {value?.method}
          </div>
        </div>
      )
    },
    {
      title: 'Total',
      key: 'total_amount',
      type: 'text',
      align: 'center',
      width: '100px',
      render: (value) => (
        <span style={{ fontWeight: '500', color: t.text }}>
          ${parseFloat(value).toFixed(2)}
        </span>
      )
    },
    {
      title: 'Date',
      key: 'created_at',
      type: 'text',
      align: 'center',
      width: '150px',
      render: (value) => new Date(value).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    }
  ];

  // Get status badge component
  const getStatusBadge = (status, type = 'order') => {
    const options = type === 'order' ? statusOptions : paymentStatusOptions;
    const statusConfig = options.find(s => s.value === status);
    if (!statusConfig) return <span>-</span>;

    const Icon = statusConfig.icon;
    return (
      <span style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.25rem',
        padding: '0.25rem 0.75rem',
        borderRadius: '9999px',
        fontSize: '0.75rem',
        fontWeight: '500',
        backgroundColor: statusConfig.color + '20',
        color: statusConfig.color
      }}>
        {Icon && <Icon size={12} />}
        {statusConfig.label}
      </span>
    );
  };

  // Handle page change
  const handlePageChange = (page) => {
    fetchOrders(page, pagination.per_page);
  };

  // Handle per-page change
  const handlePerPageChange = (perPage) => {
    fetchOrders(1, perPage);
  };

  // Fetch orders from API
  const fetchOrders = async (page = 1, perPage = 10) => {
    setLoadingOrders(true);
    setError(null);
    try {
      const params = {
        page,
        per_page: perPage
      };
      
      if (searchTerm) params.search = searchTerm;
      if (statusFilter !== 'all') params.status = statusFilter;
      if (paymentFilter !== 'all') params.payment_status = paymentFilter;

      const response = await AxiosServices.get(ApiUrlServices.ALL_ORDERS, params);
      console.log(response);
      
      
      if (response.data) {
        const { data, current_page, last_page, per_page, total, from, to } = response.data;

        // Process order data for table display
        const processedOrders = data.map(order => ({
          ...order,
          customer_info: {
            name: order.user?.name,
            phone: order.phone
          },
          status_badge: getStatusBadge(order.status, 'order'),
          payment_info: {
            badge: getStatusBadge(order.payment_status, 'payment'),
            method: order.payment_method
          },
          items_count: order.order_items?.length || 0
        }));

        setOrders(processedOrders);
        setPagination({
          current_page,
          last_page,
          per_page,
          total,
          from,
          to
        });

        toast.success("Orders fetched successfully.");
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch orders';
      setError(errorMessage);
      setOrders([]);
      setPagination(null);
      toast.error("Something went wrong!");
    } finally {
      setLoadingOrders(false);
    }
  };

  // Fetch single order details
  const fetchOrderDetails = async (orderId) => {
    try {
      const response = await AxiosServices.get(ApiUrlServices.SINGLE_ORDER_DETAILS(orderId));
      if (response.data) {
        return response.data;
      }
    } catch (error) {
      console.error('Error fetching order details:', error);
      toast.error('Failed to fetch order details.');
      return null;
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [statusFilter, paymentFilter]);

  // Search handler
  const handleSearch = () => {
    fetchOrders(1, pagination?.per_page || 10);
  };

  // Handle key press for search
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  // Status update handler
  const handleStatusUpdate = async (newStatus, newPaymentStatus = null) => {
    try {
      setUpdatingStatus(true);
      const updateData = { status: newStatus };
      
      if (newPaymentStatus) {
        updateData.payment_status = newPaymentStatus;
      }

      const response = await AxiosServices.put(
        ApiUrlServices.UPDATE_ORDER_STATUS(modalState.order.id),
        updateData
      );

      if (response.data) {
        // Update the order in the list
        setOrders(orders.map(order => 
          order.id === modalState.order.id 
            ? { 
                ...order, 
                ...updateData,
                status_badge: getStatusBadge(updateData.status, 'order'),
                payment_info: {
                  ...order.payment_info,
                  badge: getStatusBadge(updateData.payment_status || order.payment_status, 'payment')
                }
              }
            : order
        ));

        toast.success('Order status updated successfully!');
        closeModal();
      }
    } catch (error) {
      console.error('Error updating order status:', error);
      toast.error('Failed to update order status.');
    } finally {
      setUpdatingStatus(false);
    }
  };

  // Handle view order details
  const handleViewOrder = async (order) => {
    const orderDetails = await fetchOrderDetails(order.id);
    if (orderDetails) {
      setModalState({ isOpen: true, type: 'view', order: orderDetails });
    }
  };

  // Handle edit/update status
  const handleEditOrder = (order) => {
    setModalState({ isOpen: true, type: 'edit', order });
  };

  const closeModal = () => {
    setModalState({
      isOpen: false,
      type: null,
      order: null
    });
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
          Orders
        </h1>
        {/* <button
          onClick={fetchOrders}
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
          <RefreshCw size={18} /> Refresh
        </button> */}
      </div>

      {/* Error Message */}
      {error && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          backgroundColor: '#fef2f2',
          border: '1px solid #fecaca',
          borderRadius: '0.5rem',
          padding: '1rem',
          marginBottom: '1.5rem',
          color: '#dc2626'
        }}>
          <AlertCircle size={20} />
          <span>{error}</span>
          <button
            onClick={() => setError(null)}
            style={{
              marginLeft: 'auto',
              padding: '0.25rem',
              background: 'none',
              border: 'none',
              color: '#dc2626',
              cursor: 'pointer',
              borderRadius: '0.25rem'
            }}
          >
            <XCircle size={16} />
          </button>
        </div>
      )}

      {/* Filters */}
      <div style={{
        backgroundColor: t.cardBg,
        border: `1px solid ${t.border}`,
        borderRadius: '8px',
        padding: '1.5rem',
        marginBottom: '1.5rem'
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '2fr 1fr 1fr',
          gap: '1rem',
          marginBottom: '1rem'
        }}>
          {/* Search */}
          <div style={{ position: 'relative' }}>
            <Search size={16} style={{
              position: 'absolute',
              left: '0.75rem',
              top: '50%',
              transform: 'translateY(-50%)',
              color: t.textSec
            }} />
            <input
              type="text"
              placeholder="Search by order number, customer name..."
              style={{
                width: '100%',
                padding: '0.75rem 0.75rem 0.75rem 2.5rem',
                border: `1px solid ${t.border}`,
                borderRadius: '0.5rem',
                fontSize: '0.875rem',
                backgroundColor: t.bg,
                color: t.text
              }}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={handleKeyPress}
            />
          </div>

          {/* Status Filter */}
          <select
            style={{
              width: '100%',
              padding: '0.75rem',
              border: `1px solid ${t.border}`,
              borderRadius: '0.5rem',
              fontSize: '0.875rem',
              backgroundColor: t.bg,
              color: t.text
            }}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Status</option>
            {statusOptions.map(status => (
              <option key={status.value} value={status.value}>
                {status.label}
              </option>
            ))}
          </select>

          {/* Payment Status Filter */}
          <select
            style={{
              width: '100%',
              padding: '0.75rem',
              border: `1px solid ${t.border}`,
              borderRadius: '0.5rem',
              fontSize: '0.875rem',
              backgroundColor: t.bg,
              color: t.text
            }}
            value={paymentFilter}
            onChange={(e) => setPaymentFilter(e.target.value)}
          >
            <option value="all">All Payment Status</option>
            {paymentStatusOptions.map(status => (
              <option key={status.value} value={status.value}>
                {status.label}
              </option>
            ))}
          </select>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
          <button
            onClick={handleSearch}
            style={{
              background: t.primary,
              color: 'white',
              border: 'none',
              padding: '0.75rem 1rem',
              borderRadius: '8px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontSize: '0.875rem'
            }}
          >
            <Search size={16} />
            Search
          </button>
        </div>
      </div>

      {/* Custom Table */}
      <CustomTable
        data={orders}
        columns={tableColumns}
        onEdit={handleEditOrder}
        onView={handleViewOrder}
        loading={loadingOrders}
        emptyMessage="No orders found."
        isDarkMode={isDarkMode}
        theme={theme}
        showActions={true}
        actionColumnTitle="Actions"
        editPermission={true}
        deletePermission={false}
        viewPermission={true}
        pagination={pagination}
        onPageChange={handlePageChange}
        onPerPageChange={handlePerPageChange}
      />

      {/* Order Details/Status Update Modal */}
      <CustomModal
        isOpen={modalState.isOpen}
        onClose={closeModal}
        title={modalState.type === 'view' ? `Order Details - ${modalState.order?.order_number}` : 'Update Order Status'}
        isDarkMode={isDarkMode}
        theme={theme}
        size={modalState.type === 'view' ? "large" : "medium"}
      >
        {modalState.type === 'view' && modalState.order && (
          <OrderDetailsContent order={modalState.order} theme={t} />
        )}
        
        {modalState.type === 'edit' && modalState.order && (
          <StatusUpdateContent 
            order={modalState.order} 
            theme={t}
            statusOptions={statusOptions}
            paymentStatusOptions={paymentStatusOptions}
            onStatusUpdate={handleStatusUpdate}
            updating={updatingStatus}
          />
        )}
      </CustomModal>
    </div>
  );
};

// Order Details Modal Content
const OrderDetailsContent = ({ order, theme }) => (
  <div style={{ padding: '1rem' }}>
    {/* Customer & Order Info */}
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
      <div>
        <h4 style={{ color: theme.text, marginBottom: '1rem' }}>Customer Information</h4>
        <div style={{ backgroundColor: theme.bg, padding: '1rem', borderRadius: '0.5rem' }}>
          <p><strong>Name:</strong> {order.user?.name || 'N/A'}</p>
          <p><strong>Email:</strong> {order.user?.email || 'N/A'}</p>
          <p><strong>Phone:</strong> {order.phone}</p>
          <p><strong>Address:</strong> {order.shipping_address}</p>
        </div>
      </div>
      
      <div>
        <h4 style={{ color: theme.text, marginBottom: '1rem' }}>Order Information</h4>
        <div style={{ backgroundColor: theme.bg, padding: '1rem', borderRadius: '0.5rem' }}>
          <p><strong>Status:</strong> <span style={{ textTransform: 'capitalize' }}>{order.status}</span></p>
          <p><strong>Payment:</strong> <span style={{ textTransform: 'capitalize' }}>{order.payment_status}</span></p>
          <p><strong>Method:</strong> <span style={{ textTransform: 'capitalize' }}>{order.payment_method}</span></p>
          <p><strong>Date:</strong> {new Date(order.created_at).toLocaleDateString()}</p>
          {order.notes && <p><strong>Notes:</strong> {order.notes}</p>}
        </div>
      </div>
    </div>

    {/* Order Items */}
    <div style={{ marginBottom: '1.5rem' }}>
      <h4 style={{ color: theme.text, marginBottom: '1rem' }}>Order Items</h4>
      <div style={{ border: `1px solid ${theme.border}`, borderRadius: '0.5rem', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead style={{ backgroundColor: theme.bg }}>
            <tr>
              <th style={{ padding: '0.75rem', textAlign: 'left' }}>Product</th>
              <th style={{ padding: '0.75rem', textAlign: 'center' }}>Quantity</th>
              <th style={{ padding: '0.75rem', textAlign: 'center' }}>Price</th>
              <th style={{ padding: '0.75rem', textAlign: 'center' }}>Total</th>
            </tr>
          </thead>
          <tbody>
            {order.order_items?.map((item) => (
              <tr key={item.id} style={{ borderBottom: `1px solid ${theme.border}` }}>
                <td style={{ padding: '0.75rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    {item.product?.image && (
                      <img 
                        src={item.product.image} 
                        alt={item.product?.name}
                        style={{ width: '40px', height: '40px', borderRadius: '4px', objectFit: 'cover' }}
                      />
                    )}
                    <span>{item.product?.name || 'Product'}</span>
                  </div>
                </td>
                <td style={{ padding: '0.75rem', textAlign: 'center' }}>{item.quantity}</td>
                <td style={{ padding: '0.75rem', textAlign: 'center' }}>${parseFloat(item.price).toFixed(2)}</td>
                <td style={{ padding: '0.75rem', textAlign: 'center', fontWeight: '500' }}>${parseFloat(item.total).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>

    {/* Order Totals */}
    <div style={{ borderTop: `1px solid ${theme.border}`, paddingTop: '1.5rem' }}>
      <div style={{ maxWidth: '300px', marginLeft: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
          <span>Subtotal:</span>
          <span>${parseFloat(order.subtotal).toFixed(2)}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
          <span>Shipping:</span>
          <span>${parseFloat(order.shipping_fee).toFixed(2)}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
          <span>Tax:</span>
          <span>${parseFloat(order.tax_amount).toFixed(2)}</span>
        </div>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          borderTop: `1px solid ${theme.border}`, 
          paddingTop: '0.5rem',
          fontSize: '1.125rem',
          fontWeight: '600'
        }}>
          <span>Total:</span>
          <span style={{ color: theme.primary }}>${parseFloat(order.total_amount).toFixed(2)}</span>
        </div>
      </div>
    </div>
  </div>
);

// Status Update Modal Content
const StatusUpdateContent = ({ order, theme, statusOptions, paymentStatusOptions, onStatusUpdate, updating }) => (
  <div style={{ padding: '1rem' }}>
    <div style={{ marginBottom: '1.5rem' }}>
      <label style={{ display: 'block', fontWeight: '500', color: theme.text, marginBottom: '0.75rem' }}>
        Order Status
      </label>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {statusOptions.map((status) => {
          const Icon = status.icon;
          return (
            <button
              key={status.value}
              onClick={() => onStatusUpdate(status.value)}
              disabled={updating}
              style={{
                width: '100%',
                textAlign: 'left',
                padding: '0.75rem',
                border: order.status === status.value ? `2px solid ${status.color}` : `1px solid ${theme.border}`,
                borderRadius: '0.5rem',
                backgroundColor: order.status === status.value ? `${status.color}10` : theme.cardBg,
                cursor: updating ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                opacity: updating ? 0.5 : 1
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Icon size={16} style={{ color: status.color }} />
                <span style={{ fontWeight: '500', color: theme.text }}>{status.label}</span>
              </div>
              {order.status === status.value && (
                <CheckCircle size={16} style={{ color: status.color }} />
              )}
            </button>
          );
        })}
      </div>
    </div>

    <div>
      <label style={{ display: 'block', fontWeight: '500', color: theme.text, marginBottom: '0.75rem' }}>
        Payment Status
      </label>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {paymentStatusOptions.map((status) => (
          <button
            key={status.value}
            onClick={() => onStatusUpdate(order.status, status.value)}
            disabled={updating}
            style={{
              width: '100%',
              textAlign: 'left',
              padding: '0.75rem',
              border: order.payment_status === status.value ? `2px solid ${status.color}` : `1px solid ${theme.border}`,
              borderRadius: '0.5rem',
              backgroundColor: order.payment_status === status.value ? `${status.color}10` : theme.cardBg,
              cursor: updating ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              opacity: updating ? 0.5 : 1
            }}
          >
            <span style={{ fontWeight: '500', color: theme.text }}>{status.label}</span>
            {order.payment_status === status.value && (
              <CheckCircle size={16} style={{ color: status.color }} />
            )}
          </button>
        ))}
      </div>
    </div>

    {updating && (
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        gap: '0.5rem', 
        padding: '1rem',
        marginTop: '1rem'
      }}>
        <RefreshCw size={20} style={{ animation: 'spin 1s linear infinite', color: theme.primary }} />
        <span style={{ color: theme.textSec }}>Updating...</span>
      </div>
    )}
  </div>
);

export default Orders;