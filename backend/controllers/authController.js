const User = require('../models/User');
const jwt = require('jsonwebtoken');

const authController = {
  // Your existing login methods...

  // Google OAuth callback
  async googleCallback(req, res) {
    try {
      // Generate JWT token
      const token = jwt.sign(
        { userId: req.user._id },
        process.env.JWT_SECRET,
        { expiresIn: process.env.TOKEN_EXPIRES_IN }
      );

      // Set cookie
      res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 2 * 60 * 60 * 1000 // 2 hours (matching your TOKEN_EXPIRES_IN)
      });

      // Redirect to frontend with success
      res.redirect(`${process.env.DEVELOPMENT_CLIENT_URL}/login/success`);
    } catch (error) {
      console.error('Google auth error:', error);
      res.redirect(`${process.env.DEVELOPMENT_CLIENT_URL}/login/error`);
    }
  },

  // Get current user
  async getCurrentUser(req, res) {
    try {
      const user = await User.findById(req.user.userId).select('-password');
      res.json({ user });
    } catch (error) {
      res
} 