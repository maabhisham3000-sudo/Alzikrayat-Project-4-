const mongoose = require('mongoose');

const photoSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    imageUrl: { type: String, required: true },
    visibility: { type: String, default: 'Public' },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    userName: { type: String, required: true } // حفظ اسم الحساب المسجل به الدخول
}, { timestamps: true });

module.exports = mongoose.model('Photo', photoSchema);