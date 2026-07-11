import React from 'react'
import Login from './Pages/Login'
import Signup from './Pages/Signup'
import {Routes,Route} from "react-router-dom"
import Navbar from './components/Navbar'
import Admin from './Pages/Admin'
import ConfirmDialog from './components/ConfirmDialog'
import Home from './Pages/Home'
import Shop from './Pages/Shop'
import Collections from './Pages/Collections'
import Brands from './Pages/Brands'
import About from './Pages/About'
import Contact from './Pages/Contact'
import ProductDetail from './Pages/ProductDetail'
import Cart from './Pages/Cart'
import Checkout from './Pages/Checkout'
import Profile from './Pages/Profile'
import ProtectedRoute from './components/ProtectedRoute'
import Footer from './components/Footer'

import AdminLogin from './Pages/AdminLogin'

function App() {
  return (
    <>
    <ConfirmDialog />
    <Navbar/>
      <Routes >
        <Route path='/' element={<Home/>} />
        <Route path='/shop' element={<Shop/>} />
        <Route path='/product/:id' element={<ProductDetail/>} />
        <Route path='/cart' element={<ProtectedRoute><Cart/></ProtectedRoute>} />
        <Route path='/checkout' element={<ProtectedRoute><Checkout/></ProtectedRoute>} />
        <Route path='/profile' element={<ProtectedRoute><Profile/></ProtectedRoute>} />
        <Route path='/collections' element={<Collections/>} />
        <Route path='/brands' element={<Brands/>} />
        <Route path='/about' element={<About/>} />
        <Route path='/contact' element={<Contact/>} />
        <Route path='/login' element={<Login/>} />
        <Route path='/admin/login' element={<AdminLogin/>} />
        <Route path='/signup' element={<Signup/>} />
        <Route path='/admin/*' element={<Admin/>} />
      </Routes>
      <Footer />
    </>
  )
}

export default App
