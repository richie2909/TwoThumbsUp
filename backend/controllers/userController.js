import User from '../models/User.js';

const userController = {
  // Syncs user from Auth0 JWT payload to local MongoDB
  syncUser: async (req, res) => {
    if (!req.auth?.payload?.sub || !req.auth?.payload?.email) {
      console.error('Auth0 payload missing sub or email:', req.auth?.payload);
      return res.status(400).json({ error: 'Auth0 token payload missing required fields (sub, email)' });
    }
    const { sub, email, nickname, name, picture } = req.auth.payload;

    try {
      const user = await User.findOneAndUpdate(
        { auth0Sub: sub },
        {
          $set: {
            email: email,
            username: nickname || name || email.split('@')[0],
            profilePicture: picture || '',
            lastLogin: new Date(),
          },
          $setOnInsert: { auth0Sub: sub, role: 'user' } // Default role on creation
        },
        { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true }
      );
      console.log(`User synced/updated: ${user.email}`);
      res.status(200).json({ user: user }); // Send back the full user object
    } catch (error) {
      console.error('Error syncing user:', error);
      if (error.code === 11000) return res.status(409).json({ error: 'User synchronization conflict.' });
      res.status(500).json({ error: 'Failed to sync user data.' });
    }
  },

  // Example: Get current user's profile from local DB
  getMe: async (req, res) => {
     if (!req.auth?.payload?.sub) {
       return res.status(401).json({ error: 'Authentication required' });
     }
     try {
        const user = await User.findOne({ auth0Sub: req.auth.payload.sub });
        if (!user) {
            console.warn(`User profile not found for sub: ${req.auth.payload.sub}. Needs sync.`);
            // Frontend should handle triggering sync based on this or lack of localUser
            return res.status(404).json({ error: 'User profile not found. Please try syncing or re-login.' });
        }
        res.status(200).json({ user: user });
     } catch (error) {
        console.error('Error fetching user profile:', error);
        res.status(500).json({ error: 'Failed to retrieve user profile.' });
     }
  }
};

export default userController; 