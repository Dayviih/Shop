import './App.css'
import {Routes,Route } from "react-router"
import Shop from "./pages/Shop"
import Shopcategory from "./pages/Shopcategory"
import Product from "./pages/Product"
import Cart from "./pages/Cart"
import LoginSignup from "./pages/LoginSignup"
import Navbar from "./components/navbar/Navbar"
import Footer from './components/Footer/Footer'
import men_banner from './components/assets/banner_mens.png'
import women_banner from './components/assets/banner_women.png'
import kid_banner from './components/assets/banner_kids.png'
function App() {
  return (
 <>
 <Navbar />
 <Routes>
    <Route path="/" element={<Shop/>}/>
    <Route path="/mens" element={<Shopcategory banner={men_banner} category="men"/>}/>
    <Route path="/womens" element={<Shopcategory banner={women_banner} category="women"/>}/>
    <Route path="/kids" element={<Shopcategory banner={kid_banner} category="kid"/>}/>
    <Route path="/product" element={<Product/>}>
       <Route path=":productId" element={<Product/>}/>
    </Route>
    <Route path="/cart"element={<Cart/>}/>
    <Route path="/login" element={<LoginSignup/>}/>
  </Routes>
  <Footer />
 </>
)}

export default App
