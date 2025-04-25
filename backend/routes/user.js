import express from 'express';
import userController from '../controllers/userController.js';
import checkJwt from '../middleware/checkJwt.js';

const router = express.Router();

// Route to sync the currently logged-in user based on their JWT
// Needs to be called by the frontend after successful Auth0 login
router.post('/sync-me', checkJwt, userController.syncUser);

// Route to get the current user's profile from *our* database
router.get('/me', checkJwt, userController.getMe);

// Add other user-related routes here (e.g., update profile, etc.)
// Make sure to protect them with checkJwt

export default router; 