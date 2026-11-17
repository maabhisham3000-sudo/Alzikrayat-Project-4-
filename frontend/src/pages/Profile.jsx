import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import Navbar from '../components/Navbar';

function Profile() {
  const { user } = useContext(AuthContext);
  const [userPhotos, setUserPhotos] = useState([]);
  const navigate = useNavigate();

  const currentUserName = user?.name || user?.username || (user?.email ? user.email.split('@')[0] : 'User');
  const currentUserId = user?.id || user?._id || '';

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchUserPhotos();
  }, [user]);

  const fetchUserPhotos = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/photos');
      const myPhotos = res.data.filter(photo => 
        photo.userId === currentUserId || photo.userName === currentUserName
      );
      setUserPhotos(myPhotos);
    } catch (err) {
      console.error("Error fetching user photos:", err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this memory?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/photos/${id}`);
      setUserPhotos(userPhotos.filter(photo => photo._id !== id));
      alert("Photo deleted successfully!");
    } catch (err) {
      console.error("Delete Error:", err);
      alert("Error deleting photo!");
    }
  };

  return (
    <div className="page-container">
      <Navbar />

      <div className="content-wrapper">
        
        {/* صندوق بيانات المستخدم بعرض كامل */}
        <div className="card-box" style={{ textAlign: 'center' }}>
          <h2 style={{ color: '#222', marginBottom: '15px', fontSize: '26px' }}>User Profile</h2>
          <p style={{ fontSize: '16px', color: '#555', margin: '8px 0' }}>Name: <strong>{currentUserName}</strong></p>
          <p style={{ fontSize: '14px', color: '#777', margin: '8px 0' }}>Email: {user?.email || 'N/A'}</p>
          {user?.city && <p style={{ fontSize: '14px', color: '#777', margin: '8px 0' }}>City: {user.city}</p>}
          {user?.occupation && <p style={{ fontSize: '14px', color: '#777', margin: '8px 0' }}>Occupation: {user.occupation}</p>}
          <p style={{ fontSize: '16px', color: '#0d6efd', marginTop: '20px', fontWeight: 'bold' }}>
            Total Photos Uploaded by You: {userPhotos.length}
          </p>
        </div>

        <h3 style={{ marginBottom: '20px', color: '#333', fontSize: '20px' }}>My Uploaded Memories</h3>

        {/* شبكة الصور الخاصة بالمستخدم */}
        <div className="photos-grid">
          {userPhotos.map((photo) => (
            <div key={photo._id} className="photo-card">
              <span style={{
                position: 'absolute',
                top: '10px',
                right: '10px',
                background: photo.visibility === 'Private' ? '#dc3545' : '#198754',
                color: '#fff',
                padding: '4px 10px',
                borderRadius: '4px',
                fontSize: '11px',
                fontWeight: 'bold',
                zIndex: 2
              }}>
                {photo.visibility || 'Public'}
              </span>

              {photo.imageUrl && (
                <img 
                  src={`http://localhost:5000/${photo.imageUrl}`} 
                  alt={photo.title} 
                  onClick={() => navigate(`/photo/${photo._id}`)}
                />
              )}
              <div style={{ padding: '18px', display: 'flex', flexDirection: 'column', flexGrow: '1' }}>
                <h5 style={{ margin: '0 0 8px 0', fontSize: '17px', fontWeight: 'bold', color: '#333' }}>{photo.title}</h5>
                <p style={{ margin: '0 0 12px 0', fontSize: '13px', color: '#666', flexGrow: '1' }}>
                  {photo.description}
                </p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #eee', paddingTop: '12px', gap: '10px' }}>
                  <button 
                    onClick={() => navigate(`/photo/${photo._id}`)}
                    className="btn-primary-custom"
                    style={{ background: '#212529', padding: '8px 12px', fontSize: '13px' }}
                  >
                    Details
                  </button>
                  <button 
                    onClick={() => handleDelete(photo._id)} 
                    className="btn-danger-custom"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {userPhotos.length === 0 && (
          <div className="card-box" style={{ textAlign: 'center', color: '#777' }}>
            You haven't uploaded any memories yet.
          </div>
        )}

      </div>

      <footer className="footer-custom">
        All rights reserved &copy; 2026 - Alzikrayat Platform
      </footer>
    </div>
  );
}

export default Profile;