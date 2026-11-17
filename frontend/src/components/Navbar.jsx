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

  const displayName = user?.name || user?.username || (user?.email ? user.email.split('@')[0] : '');

  return (
    <header style={{ background: '#0d6efd', color: '#fff', padding: '15px 30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
      <div style={{ fontSize: '20px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span>📷 Alzikrayat</span>
      </div>
      <nav style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        <Link to="/home" style={{ color: '#fff', textDecoration: 'none', fontSize: '15px' }}>Home</Link>
        <Link to="/gallery" style={{ color: '#fff', textDecoration: 'none', fontSize: '15px' }}>Gallery</Link>
        <Link to="/about" style={{ color: '#fff', textDecoration: 'none', fontSize: '15px' }}>About</Link>
        
        {user ? (
          <>
            <Link to="/profile" style={{ color: '#fff', textDecoration: 'none', fontSize: '15px' }}>Profile</Link>
            <span style={{ color: '#ffc107', fontSize: '15px', fontWeight: '600' }}>
              Hi, {displayName}
            </span>
            <button 
              onClick={handleLogout} 
              style={{ background: '#dc3545', color: '#fff', border: 'none', padding: '6px 16px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize: '14px' }}
            >
              Logout
            </button>
          </>
        ) : (
          <button 
            onClick={() => navigate('/login')} 
            style={{ background: '#212529', color: '#fff', border: 'none', padding: '6px 16px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize: '14px' }}
          >
            Login
          </button>
        )}
      </nav>
    </header>
  );
}

export default Navbar;