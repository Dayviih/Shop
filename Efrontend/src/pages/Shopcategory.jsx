import React , { useContext }from 'react'
import './CSS/ShopCategory.css'
import { ShopContext } from '../Context/ShopContext'
import dropdown_icon from '../components/assets/dropdown_icon.png'
import Item from '../components/Item/Item'

const normalizeCategory = (category) =>
  category?.toString().toLowerCase().replace(/s$/, "");

const Shopcategory = (props) => {
  const {all_product}= useContext(ShopContext)
  return (
    <div className='shop-category'>
       <img className="shopcategory-banner" src={props.banner} alt="" />
       <div className="shopcategory-indexsort">
         <p>
          <span>showing 1-12</span> out of {all_product.length} products
         </p>
         <div className="shopcategory-sort">
          sort by <img src={dropdown_icon} alt="" />
         </div>
       </div>
       <div className="shopcategory-products">
        {all_product.map((item,i)=>{
          if(normalizeCategory(props.category) === normalizeCategory(item.category)){
             return (
               <Item key={item.id}
                 id={item.id}
                 name={item.name}
                 image={item.image}
                 new_price={item.new_price}
                 old_price={item.old_price}
               />
             )
          }
         else {
          return null;
         }
        })}
       </div>
       <div className="shopcategory-loadmore">
         Explore more
       </div>
    </div>

  )
}

export default Shopcategory