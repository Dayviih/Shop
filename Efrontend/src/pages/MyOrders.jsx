import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router';
import { ShopContext } from '../Context/ShopContext';

const MyOrders = () => {
  const { user, isLoggedIn } = useContext(ShopContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isLoggedIn) {
      setLoading(false);
      return;
    }

    const fetchOrders = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`http://localhost:4000/orders?email=${encodeURIComponent(user.email)}`);
        const data = await response.json();
        if (response.ok) {
          setOrders(data);
        } else {
          setError(data.message || 'Unable to load your orders.');
        }
      } catch (err) {
        console.error('Fetch user orders error:', err);
        setError('Unable to load your orders.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [isLoggedIn, user]);

  if (!isLoggedIn) {
    return (
      <div style={{ padding: 24, maxWidth: 900, margin: '0 auto' }}>
        <h1>Track Your Orders</h1>
        <p>Please log in first to see your orders.</p>
        <Link to="/login" style={{ padding: '0.75rem 1.25rem', background: '#3f51b5', color: '#fff', borderRadius: 12, textDecoration: 'none' }}>
          Login to View Orders
        </Link>
      </div>
    );
  }

  return (
    <div style={{ padding: 24, maxWidth: 1000, margin: '0 auto' }}>
      <h1>Your Orders</h1>
      {loading ? (
        <p>Loading your orders...</p>
      ) : error ? (
        <p>{error}</p>
      ) : orders.length === 0 ? (
        <p>You don't have any orders yet.</p>
      ) : (
        <div style={{ display: 'grid', gap: 18 }}>
          {orders.map((order) => (
            <div key={order._id} style={{ background: '#fff', padding: 20, borderRadius: 18, boxShadow: '0 12px 30px rgba(0,0,0,0.06)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
                <div>
                  <h2 style={{ margin: 0 }}>Order #{order.orderId}</h2>
                  <p style={{ margin: '6px 0 0' }}>Status: <strong>{order.status}</strong></p>
                </div>
                <div>
                  <p style={{ margin: 0 }}>Total: Ksh {order.total}</p>
                  <p style={{ margin: '6px 0 0' }}>{new Date(order.createdAt).toLocaleString()}</p>
                </div>
              </div>
              <div style={{ marginTop: 16 }}>
                <h3 style={{ marginBottom: 10 }}>Items</h3>
                {order.items.map((item) => (
                  <div key={`${order._id}-${item.id}`} style={{ display: 'flex', gap: 14, alignItems: 'center', marginBottom: 12 }}>
                    <img src={item.image} alt={item.name} style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 12 }} />
                    <div>
                      <p style={{ fontWeight: 600, margin: 0 }}>{item.name}</p>
                      <p style={{ margin: '4px 0' }}>Qty: {item.quantity}</p>
                      <p style={{ margin: 0 }}>Ksh {item.new_price}</p>
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

export default MyOrders;
