const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const photoController = require('../controllers/photoController');
const auth = require('../middleware/auth'); // استيراد وسيط الحماية
const { validatePhoto } = require('../middleware/validation'); // التحقق بـ Joi

// التأكد من وجود مجلد uploads
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

router.get('/', photoController.getPhotos);
router.get('/:id', photoController.getPhotoById); 

// المسارات المحمية تتطلب تمرير التوكن عبر الهيدر (Headers)
router.post('/', auth, upload.single('image'), validatePhoto, photoController.createPhoto);
router.delete('/:id', auth, photoController.deletePhoto); 

module.exports = router;