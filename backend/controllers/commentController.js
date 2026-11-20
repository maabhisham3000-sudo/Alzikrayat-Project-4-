const Comment = require('../models/Comment');

// جلب التعليقات الخاصة بصورة معينة
exports.getCommentsByPhoto = async (req, res) => {
  try {
    const photoId = req.params.photoId || req.params.id;
    const comments = await Comment.find({ photoId }).sort({ createdAt: -1 });
    res.json(comments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// إضافة تعليق جديد
exports.addComment = async (req, res) => {
  try {
    const photoId = req.params.photoId || req.params.id || req.body.photoId;
    const commentText = (req.body.text || req.body.comment || '').trim();
    const userId = req.body.userId || 'anonymous';
    const userName = req.body.userName || 'User';

    if (!photoId) {
      return res.status(400).json({ error: 'Photo ID is required' });
    }

    if (!commentText) {
      return res.status(400).json({ error: 'Comment text is required' });
    }

    const newComment = new Comment({
      photoId,
      text: commentText,
      userId,
      userName
    });

    await newComment.save();
    res.status(201).json(newComment);
  } catch (err) {
    console.error('Add Comment Error:', err);
    res.status(500).json({ error: err.message });
  }
};

// تعديل تعليق
exports.updateComment = async (req, res) => {
  try {
    const commentText = (req.body.text || req.body.comment || '').trim();
    if (!commentText) {
      return res.status(400).json({ error: 'Comment text is required' });
    }

    const updated = await Comment.findByIdAndUpdate(
      req.params.commentId || req.params.id,
      { text: commentText },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ error: 'Comment not found' });
    }

    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// حذف تعليق
exports.deleteComment = async (req, res) => {
  try {
    const deleted = await Comment.findByIdAndDelete(req.params.commentId || req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: 'Comment not found' });
    }

    res.json({ message: 'Comment deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};