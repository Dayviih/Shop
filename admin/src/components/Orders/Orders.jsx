import React, { useContext, useEffect, useState } from 'react';
import './Orders.css';
import { ToastContext } from '../../Context/ToastContext';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusUpdateLoading, setStatusUpdateLoading] = useState(null);

  const { notify } = useContext(ToastContext);

  const fetchOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('http://localhost:4000/orders');
      const data = await response.json();
      setOrders(data);
    } catch (error) {
      console.error('Error fetching orders:', error);
      setError('Unable to load orders.');
      notify('Unable to load orders. Please refresh the page.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (orderId, status) => {
    setStatusUpdateLoading(orderId);
    try {
      const response = await fetch(`http://localhost:4000/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      const data = await response.json();
      if (data.success) {
        fetchOrders();
        notify('Order status updated.', 'success');
      } else {
        notify(data.message || 'Unable to update order status.', 'error');
      }
    } catch (err) {
      console.error('Error updating order status:', err);
      notify('Unable to update order status. Please try again.', 'error');
    } finally {
      setStatusUpdateLoading(null);
    }
  };

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 15000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="orders-page">
      <div className="orders-header">
        <h1>Client Orders</h1>
        <button className="orders-refresh-button" onClick={fetchOrders}>Refresh</button>
      </div>
      {loading ? (
        <p>Loading orders...</p>
      ) : error ? (
        <p>{error}</p>
      ) : orders.length === 0 ? (
        <p>No orders yet.</p>
      ) : (
        <div className="orders-list">
          {orders.map((order) => (
            <div key={order._id} className="order-card">
              <div className="order-summary">
                <div>
                  <h2>Order #{order.orderId}</h2>
                  <p>Status: <strong>{order.status}</strong></p>
                </div>
                <div>
                  <p>Total: Ksh {order.total}</p>
                  <p>{new Date(order.createdAt).toLocaleString()}</p>
                </div>
              </div>
              <div className="order-customer">
                <p><strong>Client:</strong> {order.customer.name || 'N/A'}</p>
                <p><strong>Email:</strong> {order.customer.email || 'N/A'}</p>
                <p><strong>Phone:</strong> {order.customer.phone || 'N/A'}</p>
                <p><strong>Address:</strong> {order.customer.address || 'N/A'}</p>
              </div>
              <div className="order-status-update">
                <label>
                  Update status:
                  <select
                    value={order.status}
                    onChange={(e) => updateStatus(order.orderId, e.target.value)}
                    disabled={statusUpdateLoading === order.orderId}
                  >
                    <option value="pending">Pending</option>
                    <option value="processing">Processing</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </label>
                {statusUpdateLoading === order.orderId && <span className="status-loading">Updating...</span>}
              </div>
              <div className="order-items">
                <h3>Items</h3>
                {order.items.map((item) => (
                  <div key={`${order._id}-${item.id}`} className="order-item">
                    <img src={item.image} alt={item.name} />
                    <div>
                      <p>{item.name}</p>
                      <p>Qty: {item.quantity}</p>
                      <p>Ksh {item.new_price}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;
