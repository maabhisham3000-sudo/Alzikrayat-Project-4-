const router = require('express').Router();
const { register, login } = require('../controllers/authController');
const User = require('../models/User'); // استيراد مودل المستخدم لحساب العدد

// مسارات المصادقة
router.post('/register', register);
router.post('/login', login);

// مسار لجلب العدد الإجمالي للمستخدمين المسجلين (لإحصائيات المعرض)
router.get('/count', async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        res.json({ count: totalUsers });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;