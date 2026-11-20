import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import Navbar from '../components/Navbar';

function Gallery() {
  const [photos, setPhotos] = useState([]);
  const [viewMode, setViewMode] = useState('grid');
  const [stats, setStats] = useState({ commentsCount: 0, usersCount: 0, photosCount: 0 });
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [visibility, setVisibility] = useState('Public');
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const currentUserName = user?.name || user?.username || (user?.email ? user.email.split('@')[0] : 'User');
  const currentUserId = user?.id || user?._id || '';

  useEffect(() => {
    fetchGalleryData();
  }, [user]);

  const fetchGalleryData = async () => {
    try {
      const photosRes = await axios.get('http://localhost:5000/api/photos');

      const filteredPhotos = photosRes.data.filter(photo => {
        if (photo.visibility === 'Private') {
          return user && (photo.userId === currentUserId || photo.userName === currentUserName);
        }
        return true;
      });

      setPhotos(filteredPhotos);
      const totalPhotos = photosRes.data.length;

      let totalComments = 0;
      for (let photo of photosRes.data) {
        try {
          const commentsRes = await axios.get(`http://localhost:5000/api/comments/${photo._id}`);
          totalComments += commentsRes.data.length;
        } catch (e) {}
      }

      let totalUsers = 1;
      try {
        const usersRes = await axios.get('http://localhost:5000/api/auth/count');
        totalUsers = usersRes.data.count;
      } catch (e) {}

      setStats({
        commentsCount: totalComments,
        usersCount: totalUsers,
        photosCount: totalPhotos
      });

    } catch (err) {
      console.error("Error fetching gallery stats:", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      alert("You must log in first to upload photos!");
      navigate('/login');
      return;
    }

    if (!imageFile) {
      alert("Please select an image file!");
      return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('image', imageFile);
    formData.append('visibility', visibility);
    formData.append('userName', currentUserName);
    formData.append('userId', currentUserId);

    try {
      await axios.post('http://localhost:5000/api/photos', formData);
      alert("Photo uploaded successfully!");
      setTitle('');
      setDescription('');
      setImageFile(null);
      setVisibility('Public');
      fetchGalleryData();
    } catch (err) {
      console.error("Upload Error:", err.response?.data || err.message);
      alert("Error: " + (err.response?.data?.error || err.message));
    }
  };

  return (
    <div className="page-container">
      <Navbar />

      <div className="content-wrapper">

        <div className="card-box" style={{ textAlign: 'center' }}>
          <h2 style={{ color: '#222', marginBottom: '10px', fontSize: '26px' }}>📷 Welcome to Memories</h2>
          <p style={{ color: '#666', fontSize: '15px', marginBottom: '25px' }}>
            Your peaceful personal space to keep your personal photos and memories. Document your best moments and share them seamlessly and securely.
          </p>
          {user && (
            <button
              type="button"
              onClick={() => window.scrollTo({ top: 450, behavior: 'smooth' })}
              className="btn-primary-custom"
              style={{ width: 'auto', padding: '12px 28px' }}
            >
              + Upload New Memory
            </button>
          )}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '25px', marginBottom: '40px', width: '100%' }}>
          <div className="card-box" style={{ textAlign: 'center', margin: 0, padding: '25px' }}>
            <div style={{ fontSize: '24px', marginBottom: '8px' }}>💬</div>
            <div style={{ fontSize: '22px', fontWeight: 'bold', color: '#333' }}>{stats.commentsCount}</div>
            <div style={{ fontSize: '14px', color: '#777' }}>Comments</div>
          </div>
          <div className="card-box" style={{ textAlign: 'center', margin: 0, padding: '25px' }}>
            <div style={{ fontSize: '24px', marginBottom: '8px' }}>👥</div>
            <div style={{ fontSize: '22px', fontWeight: 'bold', color: '#333' }}>{stats.usersCount}</div>
            <div style={{ fontSize: '14px', color: '#777' }}>Users</div>
          </div>
          <div className="card-box" style={{ textAlign: 'center', margin: 0, padding: '25px' }}>
            <div style={{ fontSize: '24px', marginBottom: '8px' }}>📷</div>
            <div style={{ fontSize: '22px', fontWeight: 'bold', color: '#333' }}>{stats.photosCount}</div>
            <div style={{ fontSize: '14px', color: '#777' }}>Photos</div>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '10px' }}>
          <h3 style={{ margin: 0, color: '#333', fontSize: '20px' }}>Latest Memories</h3>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              type="button"
              onClick={() => setViewMode('grid')}
              className="btn-primary-custom"
              style={{ width: 'auto', padding: '8px 16px', background: viewMode === 'grid' ? '#0d6efd' : '#6c757d' }}
            >
              Grid View
            </button>
            <button
              type="button"
              onClick={() => setViewMode('list')}
              className="btn-primary-custom"
              style={{ width: 'auto', padding: '8px 16px', background: viewMode === 'list' ? '#0d6efd' : '#6c757d' }}
            >
              List View
            </button>
          </div>
        </div>

        {user ? (
          <div className="card-box">
            <h4 style={{ marginBottom: '20px', color: '#333', fontSize: '1.2rem' }}>Upload New Photo (Publisher: {currentUserName})</h4>
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '15px' }}>
                <input
                  type="file"
                  accept="image/*"
                  onChange={e => setImageFile(e.target.files[0])}
                  required
                  style={{ display: 'block', width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '6px', background: '#f9f9f9' }}
                />
              </div>
              <div style={{ marginBottom: '15px' }}>
                <input
                  type="text"
                  placeholder="Title"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  required
                  style={{ display: 'block', width: '100%', padding: '12px', border: '1px solid #ccc', borderRadius: '6px', fontSize: '14px', boxSizing: 'border-box' }}
                />
              </div>
              <div style={{ marginBottom: '15px' }}>
                <textarea
                  placeholder="Description"
                  rows="3"
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  required
                  style={{ display: 'block', width: '100%', padding: '12px', border: '1px solid #ccc', borderRadius: '6px', fontSize: '14px', boxSizing: 'border-box', resize: 'vertical' }}
                />
              </div>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', fontWeight: 'bold', color: '#555' }}>Visibility:</label>
                <select
                  value={visibility}
                  onChange={e => setVisibility(e.target.value)}
                  style={{ width: '100%', padding: '12px', border: '1px solid #ccc', borderRadius: '6px', fontSize: '14px', background: '#fff' }}
                >
                  <option value="Public">Public</option>
                  <option value="Private">Private</option>
                </select>
              </div>
              <button type="submit" className="btn-primary-custom">
                Upload
              </button>
            </form>
          </div>
        ) : (
          <div style={{ background: '#fff3cd', color: '#856404', padding: '18px 20px', borderRadius: '8px', border: '1px solid #ffeeba', marginBottom: '40px', textAlign: 'center', width: '100%', boxSizing: 'border-box' }}>
            <span>Please <Link to="/login" style={{ color: '#0d6efd', fontWeight: 'bold' }}>Login</Link> to upload photos and interact with memories.</span>
          </div>
        )}

        <div
          className={viewMode === 'grid' ? 'photos-grid' : undefined}
          style={
            viewMode === 'list'
              ? { display: 'flex', flexDirection: 'column', gap: '15px', marginBottom: '50px', width: '100%' }
              : undefined
          }
        >
          {photos.map((photo) => {
            const imgSrc = photo.imageUrl
              ? `http://localhost:5000/${photo.imageUrl}`
              : photo.fileName
                ? `http://localhost:5000/uploads/${photo.fileName}`
                : null;

            return (
              <div
                key={photo._id}
                className="photo-card"
                style={
                  viewMode === 'list'
                    ? { flexDirection: 'row', alignItems: 'center', gap: '16px', padding: '12px' }
                    : undefined
                }
              >
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

                {imgSrc && (
                  <img
                    src={imgSrc}
                    alt={photo.title}
                    onClick={() => navigate(`/photo/${photo._id}`)}
                    style={
                      viewMode === 'list'
                        ? { width: '140px', height: '100px', objectFit: 'cover', borderRadius: '6px', flexShrink: 0 }
                        : undefined
                    }
                  />
                )}
                <div style={{ padding: viewMode === 'list' ? '4px 8px' : '18px', display: 'flex', flexDirection: 'column', flexGrow: '1' }}>
                  <h5 style={{ margin: '0 0 8px 0', fontSize: '17px', fontWeight: 'bold', color: '#333' }}>{photo.title}</h5>
                  <p style={{ margin: '0 0 12px 0', fontSize: '13px', color: '#666', flexGrow: '1' }}>
                    {photo.description}
                  </p>
                  <div style={{ fontSize: '12px', color: '#888', marginBottom: '12px' }}>
                    By: <strong>{photo.userName || 'User'}</strong>
                  </div>

                  <div style={{ borderTop: '1px solid #eee', paddingTop: '12px' }}>
                    <button
                      type="button"
                      onClick={() => navigate(`/photo/${photo._id}`)}
                      className="btn-primary-custom"
                      style={{ background: '#212529', padding: '10px', width: viewMode === 'list' ? 'auto' : '100%', paddingInline: '20px' }}
                    >
                      Details
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>

      <footer className="footer-custom">
        All rights reserved &copy; 2026 - Alzikrayat Platform
      </footer>
    </div>
  );
}

export default Gallery;