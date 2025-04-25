const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const admin = require('../config/firebase-config').default;

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: '7d'
  });
};

const authController = {
  // Regular login
  async login(req, res) {
    try {
      const { email, password } = req.body;

      const user = await User.findOne({ email });
      if (!user || !(await user.comparePassword(password))) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      const token = generateToken(user._id);

      // Set HTTP-only cookie
      res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
      });

      user.lastLogin = new Date();
      await user.save();

      res.json({ user });
    } catch (error) {
      res.status(500).json({ error: 'Login failed' });
    }
  },

  // Google authentication
  async googleAuth(req, res) {
    try {
      const { token } = req.body;
      
      // Verify Firebase token
      const decodedToken = await admin.auth().verifyIdToken(token);
      const { email, name, picture, uid: googleId } = decodedToken;

      let user = await User.findOne({ $or: [{ googleId }, { email }] });

      if (!user) {
        // Create new user
        user = new User({
          username: name || email.split('@')[0],
          email,
          googleId,
          profilePicture: picture,
          role: 'user'
        });
        await user.save();
      } else if (!user.googleId) {
        // Link Google account to existing user
        user.googleId = googleId;
        user.profilePicture = picture || user.profilePicture;
        await user.save();
      }

      const jwtToken = generateToken(user._id);

      res.cookie('token', jwtToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000
      });

      user.lastLogin = new Date();
      await user.save();

      res.json({ user });
    } catch (error) {
      console.error('Google auth error:', error);
      res.status(401).json({ error: 'Google authentication failed' });
    }
  },

  // Logout
  async logout(req, res) {
    res.cookie('token', '', {
      httpOnly: true,
      expires: new Date(0),
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict'
    });
    res.json({ message: 'Logged out successfully' });
  },

  // Check authentication status
  async checkAuth(req, res) {
    try {
      const token = req.cookies.token;
      if (!token) {
        return res.status(401).json({ authenticated: false });
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.userId);

      if (!user) {
        return res.status(401).json({ authenticated: false });
      }

      res.json({ authenticated: true, user });
    } catch (error) {
      res.status(401).json({ authenticated: false });
    }
  }
};

module.exports = authController; 