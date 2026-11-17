const express = require('express');
const router = express.Router();
const { 
    getCommentsByPhotoId, 
    addComment, 
    updateComment, 
    deleteComment 
} = require('../controllers/commentController');
const auth = require('../middleware/auth'); // استيراد وسيط الحماية
const { validateComment } = require('../middleware/validation'); // التحقق بـ Joi

// المسارات العامة
router.get('/:photoId', getCommentsByPhotoId);

// المسارات المحمية تتطلب توكن
router.post('/', auth, validateComment, addComment);
router.put('/:id', auth, updateComment);
router.delete('/:id', auth, deleteComment);

module.exports = router;