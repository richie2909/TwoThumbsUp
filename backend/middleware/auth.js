const jwt = require('jsonwebtoken');
const User = require('../models/User');
const admin = require('../config/firebase-config').default;

const auth = async (req, res, next) => {
  try {
    const token = req.cookies.token || req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      throw new Error('Authentication required');
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      // If JWT verification fails, try Firebase token
      const decodedFirebase = await admin.auth().verifyIdToken(token);
      if (!decodedFirebase.uid) {
        throw new Error('Invalid token');
      }
      // Find user by Google ID
      const user = await User.findOne({ googleId: decodedFirebase.uid });
      if (!user) {
        throw new Error('User not found');
      }
      req.user = user;
      return next();
    }

    const user = await User.findById(decoded.userId);
    if (!user) {
      throw new Error('User not found');
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Please authenticate' });
  }
};

// Middleware to check if user is admin
const isAdmin = async (req, res, next) => {
  try {
    if (req.user.role !== 'admin') {
      throw new Error('Admin access required');
    }
    next();
  } catch (error) {
    res.status(403).json({ error: 'Access denied' });
  }
};

module.exports = { auth, isAdmin }; 