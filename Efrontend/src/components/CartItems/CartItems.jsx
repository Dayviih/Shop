import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import './CartItems.css'
import { ShopContext } from '../../Context/ShopContext'
import { ToastContext } from '../../Context/ToastContext'
import remove_icon from '../assets/cart_cross_icon.png'

const CartItems = () => {
  const { getTotalCartAmount, all_product, cartItems, removeFromCart, clearCart, user, isLoggedIn } = useContext(ShopContext);
  const { notify } = useContext(ToastContext);
  const navigate = useNavigate();
  const [customer, setCustomer] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
  });

  useEffect(() => {
    if (user) {
      setCustomer((prev) => ({
        ...prev,
        name: user.name || prev.name,
        email: user.email || prev.email,
      }));
    }
  }, [user]);

  const handleChange = (e) => {
    setCustomer({ ...customer, [e.target.name]: e.target.value });
  };

  const orderedItems = all_product.filter((e) => (cartItems[e.id] || 0) > 0).map((e) => ({
    id: e.id,
    name: e.name,
    image: e.image,
    category: e.category,
    new_price: e.new_price,
    old_price: e.old_price,
    quantity: cartItems[e.id],
  }));

  const placeOrder = async () => {
    if (!isLoggedIn) {
      notify('Please log in or register before placing an order.', 'error');
      navigate('/login');
      return;
    }

    if (orderedItems.length === 0) {
      notify('Your cart is empty. Add some products first.', 'error');
      return;
    }

    if (!customer.name || !customer.email || !customer.phone || !customer.address) {
      notify('Please fill in your contact details before checkout.', 'error');
      return;
    }

    try {
      const response = await fetch('http://localhost:4000/createorder', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items: orderedItems,
          total: getTotalCartAmount(),
          customer,
        }),
      });
      const data = await response.json();
      if (data.success) {
        clearCart();
        setCustomer({ name: user?.name || '', email: user?.email || '', phone: '', address: '' });
        notify('Your order was placed successfully!', 'success');
        navigate(`/order-confirmation/${data.orderId}`, {
          state: {
            orderId: data.orderId,
            emailSent: data.emailSent,
            emailPreviewUrl: data.emailPreviewUrl,
          },
        });
      } else {
        notify(data.message || 'Unable to place order. Please try again.', 'error');
      }
    } catch (error) {
      console.error('Order submission error:', error);
      notify('Unable to place order. Please try again later.', 'error');
    }
  };

  const handleCheckout = () => {
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }
    placeOrder();
  };

  return (
    <div className='cartitems'>
      <div className="cartitems-format-main">
        <p>Products</p>
        <p>Title</p>
        <p>Price</p>
        <p>Quantity</p>
        <p>Total</p>
        <p>Remove</p>
      </div>
      <hr />

      {all_product.map((e) => {
        if ((cartItems[e.id] || 0) > 0) {
          return (
            <div key={e.id}>
              <div className="cartitems-format cartitems-format-main">
                <img src={e.image} alt='' className='carticon-product-icon' />
                <p>{e.name}</p>
                <p>Ksh {e.new_price}</p>

                <button className='cartitems-quantity'>
                  {cartItems[e.id]}
                </button>

                <p>Ksh {e.new_price * cartItems[e.id]}</p>

                <img className='cartitems-remove-icon'
                  src={remove_icon}
                  onClick={() => removeFromCart(e.id)}
                  alt="Remove"
                />
              </div>
              <hr />
            </div>
          );
        }
        return null;
      })}

      <div className="cartitems-down">
        <div className="cartitems-total">
          <h1>Cart Total</h1>
          <div>
            <div className="cartitems-total-item">
              <p>Subtotal</p>
              <p>Ksh {getTotalCartAmount()}</p>
            </div>
            <hr />
            <div className="cartitems-total-item">
              <p>Shipping Fee</p>
              <p>Free</p>
            </div>
            <hr />
            <div className="cartitems-total-item">
              <h3>Total</h3>
              <h3>Ksh {getTotalCartAmount()}</h3>
            </div>
          </div>
          <button onClick={handleCheckout}>PROCEED TO CHECK OUT</button>
        </div>
        <div className="cartitems-promocode">
          <p>Client details for order tracking</p>
          {!isLoggedIn && (
            <p className="cartitems-login-warning">Please login or register before completing checkout.</p>
          )}
          <div className="cartitems-contact-form">
            <input name="name" value={customer.name} onChange={handleChange} type="text" placeholder='Full name' />
            <input name="email" value={customer.email} onChange={handleChange} type="email" placeholder='Email address' />
            <input name="phone" value={customer.phone} onChange={handleChange} type="text" placeholder='Phone number' />
            <input name="address" value={customer.address} onChange={handleChange} type="text" placeholder='Delivery address' />
          </div>
        </div>
      </div>
    </div>
  );
}

export default CartItems;
