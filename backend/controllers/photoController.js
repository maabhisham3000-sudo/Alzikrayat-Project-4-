const Photo = require('../models/Photo');

// جلب الصور مع فلترة الخاصة والعامة حسب المستخدم
exports.getPhotos = async (req, res) => {
    try {
        // يمكننا جلب كل الصور والتعامل مع الفلترة بالفرونت إند، أو فلترتها هنا حسب الـ userId المرسل في الـ query
        const photos = await Photo.find().sort({ createdAt: -1 });
        res.json(photos);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// جلب تفاصيل صورة واحدة بالمعرّف
exports.getPhotoById = async (req, res) => {
    try {
        const photo = await Photo.findById(req.params.id);
        if (!photo) {
            return res.status(404).json({ error: "Photo not found" });
        }
        res.json(photo);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// رفع وحفظ صورة جديدة
exports.createPhoto = async (req, res) => {
    try {
        const { title, description, visibility, userName, userId } = req.body;
        
        if (!req.file) {
            return res.status(400).json({ error: "No image file provided!" });
        }

        const imageUrl = `uploads/${req.file.filename}`;

        const newPhoto = new Photo({
            title,
            description,
            imageUrl,
            visibility: visibility || 'Public',
            userName: userName || 'User',
            userId: userId || null
        });

        await newPhoto.save();
        res.status(201).json(newPhoto);
    } catch (err) {
        console.error("Save Error:", err);
        res.status(500).json({ error: err.message });
    }
};

// حذف صورة
exports.deletePhoto = async (req, res) => {
    try {
        const photo = await Photo.findById(req.params.id);
        if (!photo) {
            return res.status(404).json({ error: "Photo not found" });
        }
        await Photo.findByIdAndDelete(req.params.id);
        res.json({ message: "Photo deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};