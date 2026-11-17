import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import Navbar from '../components/Navbar';

function PhotoDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [photo, setPhoto] = useState(null);
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState([]);
  
  // حالات تعديل التعليق
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editText, setEditText] = useState('');

  const currentUserName = user?.name || user?.username || (user?.email ? user.email.split('@')[0] : 'User');
  const currentUserId = user?.id || user?._id || '';

  useEffect(() => {
    fetchPhotoDetails();
    fetchComments();
  }, [id]);

  const fetchPhotoDetails = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/photos/${id}`);
      setPhoto(res.data);
    } catch (err) {
      console.error("Error fetching photo details:", err);
    }
  };

  const fetchComments = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/comments/${id}`);
      setComments(res.data);
    } catch (err) {
      console.error("Error fetching comments:", err);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!user) {
      alert("You must log in first to add a comment!");
      navigate('/login');
      return;
    }

    if (!comment.trim()) return;

    try {
      const res = await axios.post(`http://localhost:5000/api/comments`, {
        photoId: id,
        text: comment,
        userId: currentUserId,
        userName: currentUserName
      });
      setComments([res.data, ...comments]);
      setComment('');
    } catch (err) {
      console.error("Error adding comment:", err);
      alert("Error adding comment!");
    }
  };

  // حذف الصورة (متاح فقط لصاحب الصورة)
  const handleDeletePhoto = async () => {
    if (!window.confirm("Are you sure you want to delete this memory?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/photos/${id}`);
      alert("Memory deleted successfully!");
      navigate('/gallery');
    } catch (err) {
      console.error("Delete Error:", err);
      alert("Error deleting photo!");
    }
  };

  // حذف التعليق
  const handleDeleteComment = async (commentId, commentUserId) => {
    if (commentUserId && commentUserId !== currentUserId) {
      alert("You can only delete your own comments!");
      return;
    }

    if (!window.confirm("Are you sure you want to delete this comment?")) return;

    try {
      await axios.delete(`http://localhost:5000/api/comments/${commentId}`, {
        data: { userId: currentUserId }
      });
      setComments(comments.filter(c => c._id !== commentId));
    } catch (err) {
      console.error("Error deleting comment:", err);
      alert("Error deleting comment!");
    }
  };

  // تعديل التعليق
  const handleUpdateComment = async (commentId) => {
    if (!editText.trim()) return;

    try {
      const res = await axios.put(`http://localhost:5000/api/comments/${commentId}`, {
        text: editText,
        userId: currentUserId
      });
      setComments(comments.map(c => c._id === commentId ? res.data : c));
      setEditingCommentId(null);
      setEditText('');
    } catch (err) {
      console.error("Error updating comment:", err);
      alert("Error updating comment!");
    }
  };

  if (!photo) return <div style={{ textAlign: 'center', marginTop: '50px' }}>Loading...</div>;

  const formattedDate = photo.createdAt 
    ? new Date(photo.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' })
    : 'Unknown Date';

  // التحقق هل المستخدم الحالي هو مالك الصورة أم لا؟
  const isPhotoOwner = user && (photo.userId === currentUserId || photo.userName === currentUserName);

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', background: '#f4f6f9', minHeight: '100vh', margin: 0, padding: 0 }}>
      <Navbar />

      <div style={{ maxWidth: '800px', margin: '30px auto', padding: '20px' }}>
        
        {/* صندوق تفاصيل الصورة الرئيسي */}
        <div style={{ background: '#fff', padding: '30px', borderRadius: '12px', border: '1px solid #e0e0e0', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', marginBottom: '30px', textAlign: 'center' }}>
          
          <h2 style={{ color: '#222', marginBottom: '20px', fontSize: '24px' }}>{photo.title}</h2>

          <img 
            src={`http://localhost:5000/${photo.imageUrl}`} 
            alt={photo.title} 
            style={{ width: '100%', maxHeight: '450px', objectFit: 'contain', borderRadius: '8px', marginBottom: '20px', background: '#000' }} 
          />

          <h4 style={{ color: '#333', marginBottom: '8px', fontSize: '18px' }}>{photo.title}</h4>
          
          {/* تاريخ النشر واسم الناشر */}
          <div style={{ fontSize: '13px', color: '#666', marginBottom: '20px', lineHeight: '1.6' }}>
            <div>Published date: {formattedDate}</div>
            <div>Publisher: <strong>{photo.userName || 'User'}</strong></div>
          </div>

          <p style={{ color: '#555', fontSize: '15px', lineHeight: '1.6', marginBottom: '25px' }}>{photo.description}</p>
          
          {/* زر الحذف يظهر فقط لصاحب الصورة */}
          {isPhotoOwner && (
            <div style={{ marginBottom: '20px' }}>
              <button 
                onClick={handleDeletePhoto}
                style={{ background: '#dc3545', color: '#fff', border: 'none', padding: '10px 25px', borderRadius: '6px', fontSize: '14px', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 2px 4px rgba(220,53,69,0.3)' }}
              >
                🗑 Delete Memory
              </button>
            </div>
          )}

          <hr style={{ margin: '20px 0', border: '0', borderTop: '1px solid #eee' }} />

          <button 
            onClick={() => navigate('/gallery')}
            style={{ background: '#6c757d', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '14px' }}
          >
            &larr; Back to Gallery
          </button>
        </div>

        {/* صندوق التعليقات */}
        <div style={{ background: '#fff', padding: '30px', borderRadius: '12px', border: '1px solid #e0e0e0', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
          <h4 style={{ marginBottom: '20px', color: '#333', fontSize: '18px' }}>Comments ({comments.length})</h4>

          {user ? (
            <form onSubmit={handleAddComment} style={{ marginBottom: '25px' }}>
              <textarea 
                rows="3"
                placeholder="Write a comment on this memory..." 
                value={comment} 
                onChange={e => setComment(e.target.value)}
                required
                style={{ width: '100%', padding: '12px', border: '1px solid #ccc', borderRadius: '6px', fontSize: '14px', boxSizing: 'border-box', marginBottom: '10px', resize: 'vertical' }}
              />
              <button type="submit" style={{ background: '#0d6efd', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '14px' }}>
                Post Comment
              </button>
            </form>
          ) : (
            <div style={{ background: '#fff3cd', color: '#856404', padding: '12px 15px', borderRadius: '6px', marginBottom: '20px', fontSize: '14px', border: '1px solid #ffeeba' }}>
              Please <span style={{ color: '#0d6efd', fontWeight: 'bold', cursor: 'pointer' }} onClick={() => navigate('/login')}>Login</span> to write a comment.
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {comments.map((c) => {
              const isCommentOwner = user && (c.userId === currentUserId || !c.userId);
              return (
                <div key={c._id} style={{ background: '#f8f9fa', padding: '15px', borderRadius: '8px', border: '1px solid #eaeaea', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#555' }}>
                    <strong>{c.userName || 'User'}</strong>
                    <span style={{ color: '#888', fontSize: '12px' }}>{new Date(c.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' })}</span>
                  </div>

                  {editingCommentId === c._id ? (
                    <div style={{ display: 'flex', gap: '8px', marginTop: '5px' }}>
                      <input 
                        type="text" 
                        value={editText} 
                        onChange={(e) => setEditText(e.target.value)}
                        style={{ flexGrow: '1', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
                      />
                      <button onClick={() => handleUpdateComment(c._id)} style={{ background: '#198754', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold' }}>Save</button>
                      <button onClick={() => setEditingCommentId(null)} style={{ background: '#6c757d', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}>Cancel</button>
                    </div>
                  ) : (
                    <p style={{ margin: '5px 0 0 0', fontSize: '14px', color: '#333' }}>{c.text}</p>
                  )}

                  {/* أزرار التعديل والحذف للتعليق تظهر لصاحبه فقط */}
                  {user && isCommentOwner && editingCommentId !== c._id && (
                    <div style={{ display: 'flex', gap: '12px', marginTop: '8px', justifyContent: 'flex-end' }}>
                      <button 
                        onClick={() => { setEditingCommentId(c._id); setEditText(c.text); }}
                        style={{ background: 'none', border: 'none', color: '#0d6efd', fontSize: '12px', cursor: 'pointer', padding: '0', fontWeight: 'bold' }}
                      >
                        Edit
                      </button>
                      <button 
                        onClick={() => handleDeleteComment(c._id, c.userId)}
                        style={{ background: 'none', border: 'none', color: '#dc3545', fontSize: '12px', cursor: 'pointer', padding: '0', fontWeight: 'bold' }}
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
            {comments.length === 0 && <p style={{ color: '#999', fontSize: '14px', textAlign: 'center', margin: '20px 0' }}>No comments yet. Be the first to comment!</p>}
          </div>

        </div>

      </div>
    </div>
  );
}

export default PhotoDetail;