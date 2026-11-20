const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const protect = require('../middleware/authMiddleware');
const photoController = require('../controllers/photoController');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${uniqueSuffix}${path.extname(file.originalname)}`);
  }
});

const upload = multer({ storage });

router.get('/', photoController.getAll);
router.get('/:id', photoController.getOne);
router.post('/', protect, upload.single('image'), photoController.create);
router.delete('/:id', protect, photoController.remove);

module.exports = router;