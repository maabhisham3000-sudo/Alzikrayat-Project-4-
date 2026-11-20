import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav
      style={{
        width: '100%',
        backgroundColor: '#0d6efd',
        color: '#fff',
        padding: '14px 24px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '12px',
        boxSizing: 'border-box',
        boxShadow: '0 2px 6px rgba(0,0,0,0.1)'
      }}
    >
      {/* شعار المنصة */}
      <Link
        to="/"
        style={{
          color: '#fff',
          textDecoration: 'none',
          fontSize: '20px',
          fontWeight: 'bold',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}
      >
        📷 Alzikrayat
      </Link>

      {/* الروابط وحالة تسجيل الدخول */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '15px',
          fontSize: '15px'
        }}
      >
        <Link to="/" style={{ color: '#fff', textDecoration: 'none' }}>Home</Link>
        <Link to="/gallery" style={{ color: '#fff', textDecoration: 'none' }}>Gallery</Link>
        <Link to="/about" style={{ color: '#fff', textDecoration: 'none' }}>About</Link>
        {user && (
          <Link to="/profile" style={{ color: '#fff', textDecoration: 'none' }}>Profile</Link>
        )}

        {user ? (
          <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
            <span style={{ color: '#ffd43b', fontWeight: 'bold' }}>
              Hi, {user.firstName || user.name || 'User'}
            </span>
            <button
              onClick={handleLogout}
              style={{
                backgroundColor: '#dc3545',
                color: '#fff',
                border: 'none',
                padding: '6px 14px',
                borderRadius: '5px',
                cursor: 'pointer',
                fontWeight: 'bold',
                fontSize: '13px'
              }}
            >
              Logout
            </button>
          </div>
        ) : (
          <Link
            to="/login"
            style={{
              backgroundColor: '#fff',
              color: '#0d6efd',
              textDecoration: 'none',
              padding: '6px 14px',
              borderRadius: '5px',
              fontWeight: 'bold',
              fontSize: '13px'
            }}
          >
            Please Login
          </Link>
        )}
      </div>
    </nav>
  );
}

export default Navbar;