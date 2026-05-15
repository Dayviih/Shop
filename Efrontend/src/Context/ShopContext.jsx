import React, { createContext, useState, useEffect } from "react";
import fallbackProducts from "../components/assets/all-products";

export const ShopContext = createContext(null);

const getDefaultCart = () => {
  const cart = {};
  fallbackProducts.forEach((product) => {
    cart[product.id] = 0;
  });
  return cart;
};

const ShopContextProvider = (props) => {
  const [allProduct, setAllProduct] = useState(fallbackProducts);
  const [cartItems, setCartItems] = useState(getDefaultCart());
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("http://localhost:4000/allproducts");
        if (!response.ok) throw new Error("Unable to fetch products");
        const data = await response.json();
        if (data && data.length) {
          setAllProduct(data);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoadingProducts(false);
      }
    };

    const storedUser = window.localStorage.getItem('shopUser');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Invalid stored user:', error);
      }
    }

    fetchProducts();
  }, []);

  const login = (userData) => {
    setUser(userData);
    window.localStorage.setItem('shopUser', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    window.localStorage.removeItem('shopUser');
  };

  const addToCart = (itemId) => {
    setCartItems((prev) => ({ ...prev, [itemId]: (prev[itemId] || 0) + 1 }));
  };

  const removeFromCart = (itemId) => {
    setCartItems((prev) => ({
      ...prev,
      [itemId]: Math.max((prev[itemId] || 0) - 1, 0),
    }));
  };

  const clearCart = () => {
    setCartItems({});
  };

  const getTotalCartAmount = () => {
    let totalAmount = 0;

    for (const item in cartItems) {
      if (cartItems[item] > 0) {
        const itemInfo = allProduct.find((product) => product.id === Number(item));

        if (itemInfo) {
          totalAmount += itemInfo.new_price * cartItems[item];
        }
      }
    }

    return totalAmount;
  };

  const getTotalCartItems = () => {
    let totalItem = 0;
    for (const item in cartItems) {
      if (cartItems[item] > 0) {
        totalItem += cartItems[item];
      }
    }
    return totalItem;
  };

  const contextValue = {
    getTotalCartItems,
    getTotalCartAmount,
    all_product: allProduct,
    cartItems,
    addToCart,
    removeFromCart,
    clearCart,
    loadingProducts,
    user,
    login,
    logout,
    isLoggedIn: Boolean(user),
  };

  return (
    <ShopContext.Provider value={contextValue}>
      {props.children}
    </ShopContext.Provider>
  );
};

export default ShopContextProvider;
