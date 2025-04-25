import mongoose from 'mongoose';
// const bcrypt = require('bcryptjs'); // Keep if you still support password login

const userSchema = new mongoose.Schema({
  auth0Sub: { // The unique identifier from Auth0
    type: String,
    required: [true, 'Auth0 Subject ID is required'],
    unique: true,
    index: true, // Important for quick lookups
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [/.+\@.+\..+/, 'Please fill a valid email address'], // Basic email validation
  },
  username: { // Can be synced from Auth0 profile (nickname, name, etc.)
    type: String,
    required: [true, 'Username is required'],
    trim: true,
  },
  profilePicture: {
    type: String,
    default: '', // Can be synced from Auth0 profile
  },
  role: {
    type: String,
    enum: ['user', 'admin'], // Define roles
    default: 'user',
    // Note: Role management might be better handled in Auth0 directly
    // or synced based on Auth0 roles/metadata
  },
  // Removed googleId, facebookId, password
  createdAt: { type: Date, default: Date.now },
  lastLogin: {
    type: Date
  }
}, {
  timestamps: true // Adds createdAt and updatedAt automatically
});

// Remove password methods if not using password auth anymore
// userSchema.pre('save', ...);
// userSchema.methods.comparePassword = ...;

// Optional: Add a toJSON method to control output if needed
// userSchema.methods.toJSON = function() {
//   const userObject = this.toObject();
//   // delete userObject.someSensitiveField;
//   return userObject;
// };

// Check if model exists before compiling it
export default mongoose.models.User || mongoose.model('User', userSchema); 