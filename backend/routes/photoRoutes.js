const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const photoController = require('../controllers/photoController');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ storage });

router.get('/', photoController.getAll);
router.get('/:id', photoController.getOne);
router.post('/', upload.single('image'), photoController.create);
router.delete('/:id', photoController.remove);

module.exports = router;