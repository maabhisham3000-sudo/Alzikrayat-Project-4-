const express = require('express');
const router = express.Router();
const protect = require('../middleware/authMiddleware');
const commentController = require('../controllers/commentController');

router.get('/:photoId', commentController.getCommentsByPhoto);
router.post('/', protect, commentController.addComment);
router.put('/:commentId', protect, commentController.updateComment);
router.delete('/:commentId', protect, commentController.deleteComment);

module.exports = router;