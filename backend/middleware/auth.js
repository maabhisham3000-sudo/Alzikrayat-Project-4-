const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
    const token = req.header('Authorization');

    if (!token) {
        return res.status(401).json({ error: "No token, authorization denied" });
    }

    try {
        // إزالة كلمة Bearer من التوكن إن وجدت
        const bearerToken = token.startsWith('Bearer ') ? token.slice(7, token.length) : token;
        
        const verified = jwt.verify(bearerToken, process.env.JWT_SECRET);
        req.user = verified; // حفظ معلومات المستخدم للتحقق منها لاحقاً
        next();
    } catch (err) {
        res.status(401).json({ error: "Token is not valid" });
    }
};

module.exports = auth;