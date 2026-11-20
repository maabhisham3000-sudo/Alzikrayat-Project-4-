const Photo = require('../models/Photo');

exports.getAll = async (req, res) => {
  try {
    const photos = await Photo.find().sort({ dateTime: -1, createdAt: -1 });
    return res.status(200).json(photos);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

exports.getOne = async (req, res) => {
  try {
    const photo = await Photo.findById(req.params.id);
    if (!photo) {
      return res.status(404).json({ error: 'Photo not found' });
    }
    return res.status(200).json(photo);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

exports.create = async (req, res) => {
  try {
    const { title, description, visibility } = req.body;

    const userId = req.user?.id || req.user?._id || req.body.userId;
    const userName =
      req.user?.name ||
      req.body.userName ||
      (req.user?.email ? req.user.email.split('@')[0] : 'User');

    if (!req.file) {
      return res.status(400).json({ error: 'No image file provided!' });
    }

    if (!userId) {
      return res.status(401).json({ error: 'Authentication required to upload a photo' });
    }

    const newPhoto = new Photo({
      userId: String(userId),
      userName,
      fileName: req.file.filename,
      imageUrl: `uploads/${req.file.filename}`,
      title: title?.trim(),
      description: description?.trim(),
      visibility: visibility === 'Private' ? 'Private' : 'Public',
      dateTime: Date.now()
    });

    await newPhoto.save();
    return res.status(201).json(newPhoto);
  } catch (err) {
    console.error('Save Error:', err);
    return res.status(500).json({ error: err.message });
  }
};

exports.remove = async (req, res) => {
  try {
    const photo = await Photo.findById(req.params.id);

    if (!photo) {
      return res.status(404).json({ error: 'Photo not found' });
    }

    const currentUserId = req.user?.id || req.user?._id || req.body?.userId || req.query?.userId;

    if (
      photo.userId &&
      currentUserId &&
      photo.userId.toString() !== String(currentUserId)
    ) {
      return res.status(403).json({ error: 'Only the photo owner can delete this photo' });
    }

    await Photo.findByIdAndDelete(req.params.id);
    return res.status(200).json({ message: 'Photo deleted successfully' });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};