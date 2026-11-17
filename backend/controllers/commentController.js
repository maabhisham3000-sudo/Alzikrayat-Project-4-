const Comment = require('../models/Comment');

// جلب التعليقات الخاصة بصورة معينة
exports.getCommentsByPhotoId = async (req, res) => {
    try {
        const comments = await Comment.find({ photoId: req.params.photoId }).sort({ createdAt: -1 });
        res.json(comments);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// إضافة تعليق جديد
exports.addComment = async (req, res) => {
    try {
        const { photoId, text, userId, userName } = req.body;
        
        if (!text || !text.trim()) {
            return res.status(400).json({ error: "Comment text is required" });
        }

        const newComment = new Comment({
            photoId,
            text,
            userId: userId || 'anonymous',
            userName: userName || 'User'
        });

        await newComment.save();
        res.status(201).json(newComment);
    } catch (err) {
        console.error("Add Comment Error:", err);
        res.status(500).json({ error: err.message });
    }
};

// تعديل التعليق
exports.updateComment = async (req, res) => {
    try {
        const { id } = req.params;
        const { text, userId } = req.body;

        const comment = await Comment.findById(id);
        if (!comment) {
            return res.status(404).json({ error: "Comment not found" });
        }

        comment.text = text;
        await comment.save();
        res.json(comment);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// حذف التعليق
exports.deleteComment = async (req, res) => {
    try {
        const { id } = req.params;
        await Comment.findByIdAndDelete(id);
        res.json({ message: "Comment deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};