import React, { useEffect, useState } from 'react';
import { useLocation, useParams, Link } from 'react-router';

const OrderConfirmation = () => {
  const { orderId } = useParams();
  const location = useLocation();
  const [order, setOrder] = useState(location.state?.orderDetails || null);
  const [emailSent, setEmailSent] = useState(location.state?.emailSent ?? null);
  const [emailPreviewUrl] = useState(location.state?.emailPreviewUrl || null);
  const [loading, setLoading] = useState(!order);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (order) return;

    const fetchOrder = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`http://localhost:4000/orders/${orderId}`);
        const data = await response.json();
        if (response.ok) {
          setOrder(data);
        } else {
          setError(data.message || 'Unable to load order details.');
        }
      } catch (err) {
        console.error('Fetch order error:', err);
        setError('Unable to load order details.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [order, orderId]);

  return (
    <div style={{ padding: 24, maxWidth: 900, margin: '0 auto' }}>
      <h1>Order Confirmation</h1>
      {loading ? (
        <p>Loading your order details...</p>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <div style={{ background: '#fff', padding: 24, borderRadius: 20, boxShadow: '0 15px 40px rgba(0,0,0,0.08)' }}>
          <p style={{ marginBottom: 12 }}>Thank you for your purchase!</p>
          <p style={{ margin: '8px 0' }}><strong>Order Number:</strong> {order.orderId}</p>
          <p style={{ margin: '8px 0' }}><strong>Status:</strong> {order.status}</p>
          <p style={{ margin: '8px 0' }}><strong>Total:</strong> Ksh {order.total}</p>
          <p style={{ margin: '8px 0' }}><strong>Shipping to:</strong> {order.customer.address || 'N/A'}</p>
          <p style={{ margin: '8px 0' }}><strong>Email:</strong> {order.customer.email || 'N/A'}</p>
          {emailSent !== null && (
            <div style={{
              marginTop: 16,
              padding: '14px 18px',
              borderRadius: 12,
              background: emailSent ? '#e8f5e9' : '#fff3e0',
              color: emailSent ? '#2e7d32' : '#e65100',
              border: `1px solid ${emailSent ? '#c8e6c9' : '#ffcc80'}`,
            }}>
              <p style={{ margin: 0, fontWeight: 600 }}>
                {emailSent ? 'Email confirmation sent successfully.' : 'Your order was placed, but email confirmation could not be sent.'}
              </p>
              {!emailSent && (
                <p style={{ margin: '8px 0 0' }}>
                  You can still track your order from the My Orders page.
                </p>
              )}
              {emailPreviewUrl && (
                <p style={{ margin: '8px 0 0' }}>
                  <a href={emailPreviewUrl} target="_blank" rel="noreferrer" style={{ color: '#1565c0' }}>
                    View email preview
                  </a>
                </p>
              )}
            </div>
          )}
          <div style={{ marginTop: 24 }}>
            <h3>Items</h3>
            {order.items.map((item) => (
              <div key={`${order._id}-${item.id}`} style={{ display: 'flex', gap: 16, marginBottom: 14, alignItems: 'center' }}>
                <img src={item.image} alt={item.name} style={{ width: 85, height: 85, objectFit: 'cover', borderRadius: 12 }} />
                <div>
                  <p style={{ margin: 0, fontWeight: 600 }}>{item.name}</p>
                  <p style={{ margin: '4px 0' }}>Qty: {item.quantity}</p>
                  <p style={{ margin: 0 }}>Ksh {item.new_price}</p>
                </div>
              </div>
            ))}
          </div>
          <Link to="/myorders" style={{ display: 'inline-block', marginTop: 20, padding: '0.75rem 1.25rem', background: '#3f51b5', color: '#fff', borderRadius: 12, textDecoration: 'none' }}>
            Track your orders
          </Link>
        </div>
      )}
    </div>
  );
};

export default OrderConfirmation;
