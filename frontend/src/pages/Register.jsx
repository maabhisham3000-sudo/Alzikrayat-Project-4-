import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import Navbar from '../components/Navbar';

function Register() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [city, setCity] = useState('');
  const [occupation, setOccupation] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert('Passwords do not match!');
      return;
    }

    try {
      const res = await axios.post('http://localhost:5000/api/auth/register', {
        firstName,
        lastName,
        email,
        password,
        city,
        occupation
      });

      if (res.data?.token && res.data?.user) {
        login(res.data.user, res.data.token);
        alert('Account created and logged in successfully!');
        navigate('/gallery');
      } else {
        alert('Account created successfully! Please login.');
        navigate('/login');
      }
    } catch (err) {
      alert(err.response?.data?.error || 'Registration failed');
    }
  };

  return (
    <div className="page-container">
      <Navbar />

      <div className="content-wrapper" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <div className="card-box" style={{ maxWidth: '600px', width: '100%' }}>
          <h2 style={{ textAlign: 'center', marginBottom: '25px', color: '#222' }}>Create New Account</h2>

          <form onSubmit={handleRegister}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontWeight: 'bold', fontSize: '13px', color: '#555' }}>
                  First Name
                </label>
                <input
                  type="text"
                  placeholder="First name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                  style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '6px', fontSize: '14px', boxSizing: 'border-box' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontWeight: 'bold', fontSize: '13px', color: '#555' }}>
                  Last Name
                </label>
                <input
                  type="text"
                  placeholder="Last name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                  style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '6px', fontSize: '14px', boxSizing: 'border-box' }}
                />
              </div>
            </div>

            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '6px', fontWeight: 'bold', fontSize: '13px', color: '#555' }}>
                Email Address
              </label>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '6px', fontSize: '14px', boxSizing: 'border-box' }}
              />
            </div>

            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '6px', fontWeight: 'bold', fontSize: '13px', color: '#555' }}>
                Password
              </label>
              <input
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '6px', fontSize: '14px', boxSizing: 'border-box' }}
              />
            </div>

            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '6px', fontWeight: 'bold', fontSize: '13px', color: '#555' }}>
                Confirm Password
              </label>
              <input
                type="password"
                placeholder="Confirm password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '6px', fontSize: '14px', boxSizing: 'border-box' }}
              />
            </div>

            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '6px', fontWeight: 'bold', fontSize: '13px', color: '#555' }}>
                City / Location (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. Khartoum"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '6px', fontSize: '14px', boxSizing: 'border-box' }}
              />
            </div>

            <div style={{ marginBottom: '25px' }}>
              <label style={{ display: 'block', marginBottom: '6px', fontWeight: 'bold', fontSize: '13px', color: '#555' }}>
                Occupation (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. Developer / Designer"
                value={occupation}
                onChange={(e) => setOccupation(e.target.value)}
                style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '6px', fontSize: '14px', boxSizing: 'border-box' }}
              />
            </div>

            <button type="submit" className="btn-primary-custom" style={{ marginBottom: '20px' }}>
              Register
            </button>
          </form>

          <div style={{ textAlign: 'center', fontSize: '14px', color: '#666' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: '#0d6efd', fontWeight: 'bold' }}>
              Login
            </Link>
          </div>
        </div>
      </div>

      <footer className="footer-custom">
        All rights reserved &copy; 2026 - Alzikrayat Platform
      </footer>
    </div>
  );
}

export default Register;