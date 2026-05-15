import React, { useContext, useState } from 'react'
import { useNavigate } from 'react-router'
import './CSS/LoginSignup.css'
import { ShopContext } from '../Context/ShopContext'
import { ToastContext } from '../Context/ToastContext'

const LoginSignup = () => {
  const { login } = useContext(ShopContext)
  const { notify } = useContext(ToastContext)
  const navigate = useNavigate()
  const [mode, setMode] = useState('login')
  const [form, setForm] = useState({ name: '', email: '', password: '' })

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (mode === 'signup') {
      if (!form.name.trim() || !form.email.trim() || !form.password) {
        notify('Please complete all signup fields.', 'error')
        return
      }
      const storedUser = { name: form.name.trim(), email: form.email.trim(), password: form.password }
      window.localStorage.setItem('shopUser', JSON.stringify(storedUser))
      login(storedUser)
      notify('Signup successful! You can now checkout your cart.', 'success')
      navigate('/cart')
      return
    }

    const stored = window.localStorage.getItem('shopUser')
    if (!stored) {
      notify('No account found. Please register first.', 'error')
      return
    }

    const savedUser = JSON.parse(stored)
    if (savedUser.email === form.email.trim() && savedUser.password === form.password) {
      login(savedUser)
      notify('Welcome back! You are logged in.', 'success')
      navigate('/cart')
    } else {
      notify('Invalid login credentials.', 'error')
    }
  }

  return (
    <div className="loginsignup">
      <div className="loginsignup-container">
        <h1>{mode === 'login' ? 'Login' : 'Sign Up'}</h1>
        <form className="loginsignup-fields" onSubmit={handleSubmit}>
          {mode === 'signup' && (
            <input name="name" value={form.name} onChange={handleChange} type="text" placeholder='Your Name' />
          )}
          <input name="email" value={form.email} onChange={handleChange} type="email" placeholder='Email Address' />
          <input name="password" value={form.password} onChange={handleChange} type="password" placeholder='Password' />
          <button type="submit">Continue</button>
        </form>
        <p className="loginsignup-login">
          {mode === 'login' ? 'No account yet?' : 'Already have an account?'}{' '}
          <span onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}>
            {mode === 'login' ? 'Register here' : 'Login here'}
          </span>
        </p>
        {mode === 'signup' && (
          <div className="loginsignup-agree">
            <input type='checkbox' name='' id='' />
            <p>By continuing, I agree to terms of use and privacy policy</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default LoginSignup
