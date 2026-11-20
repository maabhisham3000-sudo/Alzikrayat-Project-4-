const Comment = require('../models/Comment');

// جلب التعليقات الخاصة بصورة معينة
exports.getCommentsByPhoto = async (req, res) => {
  try {
    const photoId = req.params.photoId || req.params.id;
    const comments = await Comment.find({ photoId }).sort({ createdAt: -1 });
    return res.status(200).json(comments);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

// إضافة تعليق جديد
exports.addComment = async (req, res) => {
  try {
    const photoId = req.params.photoId || req.params.id || req.body.photoId;
    const commentText = (req.body.text || req.body.comment || '').trim();

    const userId =
      req.user?.id ||
      req.user?._id ||
      req.body.userId ||
      'anonymous';

    const userName =
      req.user?.name ||
      req.body.userName ||
      (req.user?.email ? req.user.email.split('@')[0] : 'User');

    if (!photoId) {
      return res.status(400).json({ error: 'Photo ID is required' });
    }

    if (!commentText) {
      return res.status(400).json({ error: 'Comment text is required' });
    }

    const newComment = new Comment({
      photoId,
      text: commentText,
      userId: String(userId),
      userName
    });

    await newComment.save();
    return res.status(201).json(newComment);
  } catch (err) {
    console.error('Add Comment Error:', err);
    return res.status(500).json({ error: err.message });
  }
};

// تعديل تعليق
exports.updateComment = async (req, res) => {
  try {
    const commentId = req.params.commentId || req.params.id;
    const commentText = (req.body.text || req.body.comment || '').trim();

    if (!commentText) {
      return res.status(400).json({ error: 'Comment text is required' });
    }

    const existingComment = await Comment.findById(commentId);
    if (!existingComment) {
      return res.status(404).json({ error: 'Comment not found' });
    }

    const currentUserId = req.user?.id || req.user?._id || req.body.userId;
    if (
      currentUserId &&
      existingComment.userId &&
      existingComment.userId !== 'anonymous' &&
      String(existingComment.userId) !== String(currentUserId)
    ) {
      return res.status(403).json({ error: 'You are not authorized to edit this comment' });
    }

    existingComment.text = commentText;
    const updated = await existingComment.save();
    return res.status(200).json(updated);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

// حذف تعليق
exports.deleteComment = async (req, res) => {
  try {
    const commentId = req.params.commentId || req.params.id;
    const existingComment = await Comment.findById(commentId);

    if (!existingComment) {
      return res.status(404).json({ error: 'Comment not found' });
    }

    const currentUserId = req.user?.id || req.user?._id || req.body?.userId;
    if (
      currentUserId &&
      existingComment.userId &&
      existingComment.userId !== 'anonymous' &&
      String(existingComment.userId) !== String(currentUserId)
    ) {
      return res.status(403).json({ error: 'You are not authorized to delete this comment' });
    }

    await Comment.findByIdAndDelete(commentId);
    return res.status(200).json({ message: 'Comment deleted successfully' });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};