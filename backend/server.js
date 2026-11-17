const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const photoRoutes = require('./routes/photoRoutes');
const commentRoutes = require('./routes/commentRoutes');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// تفعيل عرض الصور والملفات المرفوعة بشكل ثابت لكي يراها المتصفح
app.use('/uploads', express.static('uploads'));

// Routes
app.use('/api/auth', authRoutes);     // يتضمن التسجيل، الدخول، وعدّاد المستخدمين (/api/auth/count)
app.use('/api/photos', photoRoutes);
app.use('/api/comments', commentRoutes);

// Error Handler Middleware
app.use(errorHandler);

// Database Connection & Server Startup
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || process.env.MONGO_URI;

mongoose.connect(MONGODB_URI)
    .then(async () => {
        console.log("Connected to MongoDB successfully");
        
        // حذف الفهرس القديم المسبب لمشكلة التكرار تلقائياً لمنع أخطاء التسجيل
        try {
            await mongoose.connection.collection('users').dropIndex('username_1');
            console.log("Old username index dropped successfully");
        } catch (e) {
            // الفهرس محذوف مسبقاً أو غير موجود، يتم تجاهله بلطف
        }

        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    })
    .catch((err) => {
        console.error("Database connection error:", err);
    });