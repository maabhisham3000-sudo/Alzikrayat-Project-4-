const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const generateToken = (user) => {
  const fullName =
    user.name ||
    [user.firstName, user.lastName].filter(Boolean).join(' ').trim() ||
    (user.email ? user.email.split('@')[0] : 'User');

  return jwt.sign(
    {
      id: user._id.toString(),
      name: fullName,
      firstName: user.firstName || fullName.split(' ')[0],
      email: user.email
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
};

const formatUserResponse = (user) => {
  const fullName =
    user.name ||
    [user.firstName, user.lastName].filter(Boolean).join(' ').trim() ||
    (user.email ? user.email.split('@')[0] : 'User');

  return {
    id: user._id,
    _id: user._id,
    firstName: user.firstName || '',
    lastName: user.lastName || '',
    name: fullName,
    email: user.email,
    city: user.city || '',
    occupation: user.occupation || ''
  };
};

exports.register = async (req, res, next) => {
  try {
    const { firstName, lastName, email, password, city, occupation } = req.body;

    const existingUser = await User.findOne({ email: email.toLowerCase().trim() });
    if (existingUser) {
      return res.status(400).json({ error: 'Email is already registered.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const fullName = [firstName, lastName].filter(Boolean).join(' ').trim();

    const newUser = await User.create({
      firstName: firstName?.trim(),
      lastName: lastName?.trim(),
      name: fullName || email.split('@')[0],
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      city: city?.trim() || '',
      occupation: occupation?.trim() || ''
    });

    const token = generateToken(newUser);
    return res.status(201).json({
      message: 'Account created successfully.',
      user: formatUserResponse(newUser),
      token
    });
  } catch (err) {
    return next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const token = generateToken(user);
    return res.status(200).json({
      message: 'Logged in successfully.',
      user: formatUserResponse(user),
      token
    });
  } catch (err) {
    return next(err);
  }
};

exports.getUsersCount = async (req, res, next) => {
  try {
    const count = await User.countDocuments();
    return res.status(200).json({ count });
  } catch (err) {
    return next(err);
  }
};