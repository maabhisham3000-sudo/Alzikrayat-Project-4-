import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import Navbar from '../components/Navbar';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', {
        email,
        password
      });
      login(res.data.user, res.data.token);
      navigate('/gallery');
    } catch (err) {
      alert(err.response?.data?.error || "Login failed");
    }
  };

  return (
    <div className="page-container">
      <Navbar />

      <div className="content-wrapper" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <div className="card-box" style={{ maxWidth: '500px', width: '100%' }}>
          <h2 style={{ textAlign: 'center', marginBottom: '25px', color: '#222' }}>Login to Alzikrayat</h2>
          
          <form onSubmit={handleLogin}>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', fontSize: '14px', color: '#555' }}>Email Address</label>
              <input 
                type="email" 
                placeholder="Enter your email" 
                value={email} 
                onChange={e => setEmail(e.target.value)} 
                required 
                style={{ width: '100%', padding: '12px', border: '1px solid #ccc', borderRadius: '6px', fontSize: '14px', boxSizing: 'border-box' }}
              />
            </div>

            <div style={{ marginBottom: '25px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', fontSize: '14px', color: '#555' }}>Password</label>
              <input 
                type="password" 
                placeholder="Enter your password" 
                value={password} 
                onChange={e => setPassword(e.target.value)} 
                required 
                style={{ width: '100%', padding: '12px', border: '1px solid #ccc', borderRadius: '6px', fontSize: '14px', boxSizing: 'border-box' }}
              />
            </div>

            <button type="submit" className="btn-primary-custom" style={{ marginBottom: '20px' }}>
              Login
            </button>
          </form>

          <div style={{ textAlign: 'center', fontSize: '14px', color: '#666' }}>
            Don't have an account? <Link to="/register" style={{ color: '#0d6efd', fontWeight: 'bold' }}>Register</Link>
          </div>
        </div>
      </div>

      <footer className="footer-custom">
        All rights reserved &copy; 2026 - Alzikrayat Platform
      </footer>
    </div>
  );
}

export default Login;