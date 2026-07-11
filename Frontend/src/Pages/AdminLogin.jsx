import React, { useState } from "react";
import styles from "../Styles/login.module.css";
import axiosInstance from "../api/axios";
import { useEffect } from "react";

function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await axiosInstance.post("/users/login", { email, password });
      if (res.data.isLogin) {
        if (res.data.role === "admin") {
          localStorage.setItem('userRole', 'admin');
          window.location.href = "/admin"; // Force a full navigation to clear react state
        } else {
          setError("Access Denied: You are not an administrator.");
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', marginTop: '100px' }}>
      <form className={styles.form} onSubmit={handleSubmit} style={{ border: '2px solid #333' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '1rem' }}>Admin Gateway</h2>
        {error && <p style={{ color: 'red', textAlign: 'center', marginBottom: '1rem', fontWeight: 'bold' }}>{error}</p>}
        <label>
          Email : {""}
          <input type="email" placeholder="admin@example.com" required onChange={(e)=>setEmail(e.target.value)} value={email}/>
        </label>
        <br /><br />
        <label>
          Password : {""}
          <input type="password" placeholder="Enter password" required onChange={(e)=>setPassword(e.target.value)} value={password} />
        </label>
        <br /><br />
        <button type="submit" style={{ width: '100%', background: '#333', color: 'white', padding: '10px' }}>Secure Login</button>
      </form>
    </div>
  );
}

export default AdminLogin;
