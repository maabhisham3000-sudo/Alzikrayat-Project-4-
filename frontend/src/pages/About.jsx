import React from 'react';
import Navbar from '../components/Navbar';

function About() {
  return (
    <div className="page-container">
      <Navbar />
      
    
      <div className="content-wrapper">
        <div className="card-box" style={{ textAlign: 'center' }}>
          <h1 style={{ color: '#2c3e50', marginBottom: '20px', fontSize: '28px' }}>About Alzikrayat</h1>
          <p style={{ color: '#666', fontSize: '16px', lineHeight: '1.8', maxWidth: '900px', margin: '0 auto' }}>
            A carefully designed digital platform to provide a clean and secure environment for keeping personal photos and memories. We believe that simplicity and security are the foundation of an enjoyable experience, so we were keen to provide a smooth, clutter-free design.
          </p>
        </div>
      </div>

   
      <footer className="footer-custom">
        All rights reserved &copy; 2026 - Alzikrayat Platform
      </footer>
    </div>
  );
}

export default About;