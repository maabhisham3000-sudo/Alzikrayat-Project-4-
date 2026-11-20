const mongoose = require('mongoose');

const photoSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  userName: { type: String, default: 'User' },
  fileName: { type: String, required: true },
  imageUrl: { type: String },
  title: { type: String, required: true },
  description: { type: String },
  dateTime: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('Photo', photoSchema);