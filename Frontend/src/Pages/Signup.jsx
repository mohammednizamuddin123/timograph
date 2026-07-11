import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FaEyeSlash } from "react-icons/fa";
import { IoEye } from "react-icons/io5";
import axiosInstance from '../api/axios';
import { AppContext } from '../context/AppContext';
import styles from "../Styles/signup.module.css";

const API_URL = import.meta.env.REACT_API_URL || 'http://localhost:3000';

function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { setRole } = useContext(AppContext);

  const validateForm = () => {
    if (name.trim().length < 3) return "Name must be at least 3 characters.";
    if (password.length < 6) return "Password must be at least 6 characters.";
    if (password !== confirmPassword) return "Passwords do not match.";
    return null;
  };

  async function handleSignup(e) {
    e.preventDefault();
    setError("");

    const validationError = validateForm();
    if (validationError) {
      return setError(validationError);
    }

    setLoading(true);

    try {
      const user = { name, email, password };
      // Use axiosInstance to ensure cookies are stored and sent
      const res = await axiosInstance.post(`${API_URL}/users/register`, user);

      if (res.data.isRegistered) {
        // Since backend auto-logs in and sets the cookie, we just update the app state
        localStorage.setItem('userRole', res.data.role);
        setRole(res.data.role);
        
        navigate("/"); // Redirect to home instantly, logged in!
      }
    } catch (err) {
      if (err.response) {
        if (err.response.data.isEmail) {
          setError(err.response.data.message);
        } else {
          setError(err.response.data.message || "An error occurred during registration.");
        }
      } else {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.formCard}>
        <h1 className={styles.title}>Create Account</h1>
        <p className={styles.subtitle}>Join us and discover premium timepieces</p>

        {error && <div className={styles.errorText} style={{ textAlign: 'center', marginBottom: '1.5rem', fontSize: '1rem' }}>{error}</div>}

        <form onSubmit={handleSignup}>
          <div className={styles.formGroup}>
            <label className={styles.label}>Full Name</label>
            <div className={styles.inputWrapper}>
              <input 
                type="text" 
                className={styles.input} 
                placeholder='John Doe' 
                required 
                onChange={(e) => setName(e.target.value)} 
                value={name} 
              />
            </div>
          </div>

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
                placeholder="Enter password (min 6 chars)" 
                required 
                onChange={(e) => setPassword(e.target.value)} 
                value={password} 
              />
              <span className={styles.eyeIcon} onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <IoEye /> : <FaEyeSlash />}
              </span>
            </div>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Confirm Password</label>
            <div className={styles.inputWrapper}>
              <input 
                type={showConfirmPassword ? "text" : "password"} 
                className={styles.input} 
                placeholder="Confirm your password" 
                required 
                onChange={(e) => setConfirmPassword(e.target.value)} 
                value={confirmPassword} 
              />
              <span className={styles.eyeIcon} onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                {showConfirmPassword ? <IoEye /> : <FaEyeSlash />}
              </span>
            </div>
          </div>

          <button type="submit" className={styles.submitBtn} disabled={loading}>
            {loading ? "Creating Account..." : "Sign Up"}
          </button>

          <div className={styles.loginLink}>
            Already have an account? <Link to="/login">Log In here</Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Signup;
