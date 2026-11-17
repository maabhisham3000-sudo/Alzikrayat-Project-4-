const Joi = require('joi');

// التحقق من بيانات التسجيل
const validateRegister = (req, res, next) => {
    const schema = Joi.object({
        firstName: Joi.string().required(),
        lastName: Joi.string().required(),
        email: Joi.string().email().required(),
        password: Joi.string().min(6).required(),
        city: Joi.string().allow('', null),
        occupation: Joi.string().allow('', null)
    });

    const { error } = schema.validate(req.body);
    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }
    next();
};

// التحقق من بيانات تسجيل الدخول
const validateLogin = (req, res, next) => {
    const schema = Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().required()
    });

    const { error } = schema.validate(req.body);
    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }
    next();
};

// التحقق من بيانات رفع الصورة
const validatePhoto = (req, res, next) => {
    const schema = Joi.object({
        title: Joi.string().required(),
        description: Joi.string().allow('', null),
        visibility: Joi.string().valid('Public', 'Private').default('Public'),
        userName: Joi.string().allow('', null),
        userId: Joi.string().allow('', null)
    });

    const { error } = schema.validate(req.body);
    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }
    next();
};

// التحقق من بيانات التعليق
const validateComment = (req, res, next) => {
    const schema = Joi.object({
        photoId: Joi.string().required(),
        text: Joi.string().required(),
        userId: Joi.string().allow('', null),
        userName: Joi.string().allow('', null)
    });

    const { error } = schema.validate(req.body);
    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }
    next();
};

module.exports = {
    validateRegister,
    validateLogin,
    validatePhoto,
    validateComment
};