import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FaEyeSlash } from "react-icons/fa";
import { IoEye } from "react-icons/io5";
import axiosInstance from '../api/axios';
import { AppContext } from '../context/AppContext';
import styles from "../Styles/signup.module.css"; // Reuse the premium signup styling

const API_URL = import.meta.env.REACT_API_URL || 'http://localhost:3000';

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { setRole } = useContext(AppContext);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      return setError("Please fill in all fields.");
    }

    setLoading(true);

    try {
      const res = await axiosInstance.post(`${API_URL}/users/login`, { email, password });
      
      if (res.data.isLogin) {
        if (res.data.role === "user") {
          // Update global state and local storage
          localStorage.setItem('userRole', res.data.role);
          setRole(res.data.role);
          
          navigate("/"); // Redirect to home instantly
        } else {
           setError("Admins must log in through the Admin Portal.");
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || "Invalid credentials. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.formCard}>
        <h1 className={styles.title}>Welcome Back</h1>
        <p className={styles.subtitle}>Log in to access your premium account</p>

        {error && <div className={styles.errorText} style={{ textAlign: 'center', marginBottom: '1.5rem', fontSize: '1rem' }}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label className={styles.label}>Email Address</label>
            <div className={styles.inputWrapper}>
              <input 
                type="email" 
                className={styles.input} 
                placeholder="john@example.com" 
                required 
                onChange={(e) => setEmail(e.target.value)} 
                value={email} 
              />
            </div>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Password</label>
            <div className={styles.inputWrapper}>
              <input 
                type={showPassword ? "text" : "password"} 
                className={styles.input} 
                placeholder="Enter your password" 
                required 
                onChange={(e) => setPassword(e.target.value)} 
                value={password} 
              />
              <span className={styles.eyeIcon} onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <IoEye /> : <FaEyeSlash />}
              </span>
            </div>
          </div>

          <button type="submit" className={styles.submitBtn} disabled={loading}>
            {loading ? "Authenticating..." : "Log In"}
          </button>

          <div className={styles.loginLink}>
            Don't have an account? <Link to="/signup">Create one here</Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
