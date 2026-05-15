import React, { useContext, useState } from 'react'
import './AddProduct.css'
import upload_area from '../../assets/upload_area.svg'
import { ToastContext } from '../../Context/ToastContext'

const AddProduct = () => {
  const { notify } = useContext(ToastContext);

  const [image, setImage] = useState(null);
  const [productDetails, setProductDetails] = useState({
    name: "",
    image: "",
    category: "women",
    new_price: "",
    old_price: ""
  })

  const imageHandler = (e) => {
    setImage(e.target.files[0]);
  }

  const changeHandler = (e) => {
    setProductDetails({ ...productDetails, [e.target.name]: e.target.value })
  }

  const Add_Product = async () => {
    if (!productDetails.name.trim() || !productDetails.new_price || !productDetails.old_price) {
      notify('Please fill in all product fields.', 'error');
      return;
    }

    if (!image) {
      notify('Please select a product image.', 'error');
      return;
    }

    let responseData;

    try {
      const formData = new FormData();
      formData.append('product', image);

      const uploadResponse = await fetch('http://localhost:4000/upload', {
        method: 'POST',
        headers: {
          Accept: 'application/json'
        },
        body: formData,
      });
      responseData = await uploadResponse.json();

      if (!uploadResponse.ok || !responseData.success) {
        throw new Error(responseData.message || 'Image upload failed.');
      }

      const product = {
        name: productDetails.name.trim(),
        category: productDetails.category,
        image: responseData.image_url,
        new_price: Number(productDetails.new_price),
        old_price: Number(productDetails.old_price),
      };

      const addResponse = await fetch('http://localhost:4000/addproduct', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(product),
      });
      const data = await addResponse.json();

      if (addResponse.ok && data.success) {
        notify('Product added successfully.', 'success');
        setProductDetails({ name: "", image: "", category: "women", new_price: "", old_price: "" });
        setImage(null);
      } else {
        throw new Error(data.message || 'Unable to add product. Please try again.');
      }
    } catch (error) {
      console.error('Add product error:', error);
      notify(error.message || 'Unable to add product. Please check your inputs and try again.', 'error');
    }
  }

  return (
    <div className='add-product'>

      <div className="addproduct-itemfield">
        <p>Product title</p>
        <input value={productDetails.name} onChange={changeHandler} type="text" name='name' placeholder='Type here' />
      </div>

      <div className="addproduct-price">
        <div className="addproduct-itemfield">
          <p>Price</p>
          <input  value={productDetails.old_price} onChange={changeHandler} type="text" name='old_price' placeholder='Type here' />
        </div>

        <div className="addproduct-itemfield">
          <p>Offer Price</p>
          <input  value={productDetails.new_price} onChange={changeHandler} type="text" name='new_price' placeholder='Type here' />
        </div>
      </div>

      <div className="addproduct-itemfield">
        <p>Product Category</p>
        <select  value={productDetails.category} onChange={changeHandler} name="category" className='add-product-selector'>
          <option value="women">Women</option>
          <option value="men">Men</option>
          <option value="kids">Kids</option>
        </select>
      </div>

      <div className="addproduct-itemfield">
        <label htmlFor="file-input">
          <img
            src={image ? URL.createObjectURL(image) : upload_area}
            className='addproduct-thumnail-img'
            alt=""
          />
        </label>
        <input
          onChange={imageHandler}
          type="file"
          name='image'
          id='file-input'
          hidden
        />
      </div>

      <button onClick={()=>{Add_Product()}} className='add-product-btn'>ADD</button>

    </div>
  )
}

export default AddProduct