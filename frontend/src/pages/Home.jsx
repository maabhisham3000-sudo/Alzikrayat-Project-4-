import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';

function Home() {
  return (
    <div style={{ fontFamily: 'Arial, sans-serif', background: '#f4f6f9', minHeight: '100vh', margin: 0, padding: 0 }}>
      <Navbar />
      <div style={{ textAlign: 'center', marginTop: '80px', padding: '20px' }}>
        <h1>Welcome to Alzikrayat 📷</h1>
        <p style={{ fontSize: '18px', color: '#555', margin: '20px 0' }}>
          Share your memories, one photo at a time.
        </p>
        <Link 
          to="/gallery" 
          style={{
            display: 'inline-block',
            background: '#0d6efd',
            color: '#fff',
            padding: '12px 25px',
            borderRadius: '4px',
            textDecoration: 'none',
            fontWeight: 'bold',
            fontSize: '16px'
          }}
        >
          Explore Gallery
        </Link>
      </div>
    </div>
  );
}

export default Home;