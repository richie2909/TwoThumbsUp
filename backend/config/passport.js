const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: `${process.env.DEVELOPMENT_CLIENT_URL}/api/v1/auth/google/callback`,
      scope: ['profile', 'email']
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Check if user already exists
        let user = await User.findOne({ email: profile.emails[0].value });

        if (!user) {
          // Create new user
          user = await User.create({
            username: profile.displayName || profile.emails[0].value.split('@')[0],
            email: profile.emails[0].value,
            googleId: profile.id,
            profilePicture: profile.photos[0]?.value,
            role: 'user', // Default role
            password: undefined // No password for Google auth users
          });
        } else if (!user.googleId) {
          // Link Google account to existing user
          user.googleId = profile.id;
          user.profilePicture = profile.photos[0]?.value || user.profilePicture;
          await user.save();
        }

        return done(null, user);
      } catch (error) {
        return done(error, null);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

module.exports = passport; 