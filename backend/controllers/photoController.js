const Photo = require('../models/Photo');


exports.getAll = async (req, res) => {
  try {
    const photos = await Photo.find().sort({ dateTime: -1, createdAt: -1 });
    res.json(photos);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


exports.getOne = async (req, res) => {
  try {
    const photo = await Photo.findById(req.params.id);
    if (!photo) {
      return res.status(404).json({ error: 'Photo not found' });
    }
    res.json(photo);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


exports.create = async (req, res) => {
  try {
    const { title, description, userId, userName } = req.body;

    if (!req.file) {
      return res.status(400).json({ error: 'No image file provided!' });
    }

    if (!userId) {
      return res.status(401).json({ error: 'User ID is required to upload a photo' });
    }

    const newPhoto = new Photo({
      userId,
      userName: userName || 'User',
      fileName: req.file.filename,
      imageUrl: `uploads/${req.file.filename}`,
      title,
      description,
      dateTime: Date.now()
    });

    await newPhoto.save();
    res.status(201).json(newPhoto);
  } catch (err) {
    console.error('Save Error:', err);
    res.status(500).json({ error: err.message });
  }
};


exports.remove = async (req, res) => {
  try {
    const userId = req.body?.userId || req.query?.userId;
    const photo = await Photo.findById(req.params.id);

    if (!photo) {
      return res.status(404).json({ error: 'Photo not found' });
    }

    if (photo.userId && userId && photo.userId.toString() !== userId.toString()) {
      return res.status(403).json({ error: 'Only the photo owner can delete this photo' });
    }

    await Photo.findByIdAndDelete(req.params.id);
    res.json({ message: 'Photo deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};