import React, { useEffect, useState } from 'react';
import './ListProduct.css';
import cross_icon from '../../assets/cross_icon.png';

const ListProduct = () => {

  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch products from backend
  const fetchProducts = async () => {
    try {
      const response = await fetch('http://localhost:4000/allproducts');
      const data = await response.json();
      setAllProducts(data);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  // Delete product
  const removeProduct = async (id) => {
    try {
      await fetch('http://localhost:4000/removeproduct', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id }),
      });

      // Update UI instantly without refetching everything
      setAllProducts((prev) => prev.filter((product) => product.id !== id && product._id !== id));

    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div className="list-product">
      <h1>All Products List</h1>

      {/* Header */}
      <div className="listproducts-format-main">
        <p>Image</p>
        <p>Title</p>
        <p>Old Price</p>
        <p>New Price</p>
        <p>Category</p>
        <p>Remove</p>
      </div>

      {/* Products */}
      <div className="listproduct-allproducts">

        {loading ? (
          <p style={{ padding: "20px" }}>Loading products...</p>
        ) : allProducts.length === 0 ? (
          <p style={{ padding: "20px" }}>No products available.</p>
        ) : (
          allProducts.map((product) => (
            <div key={product._id} className="listproduct-format">

              <img
                src={product.image}
                alt={product.name}
                className="listproduct-product-icon"
              />

              <p>{product.name}</p>
              <p>Ksh {product.old_price}</p>
              <p>Ksh {product.new_price}</p>
              <p>{product.category}</p>

              <img
                src={cross_icon}
                alt="Remove"
                className="listproduct-remove-icon"
                onClick={() => removeProduct(product._id)}
              />

            </div>
          ))
        )}

      </div>
    </div>
  );
};

export default ListProduct;