import express from 'express';
import blogController from '../controllers/blogPost.js';
import checkJwt from '../middleware/checkJwt.js';

const router = express.Router();

// Public Routes
router.get('/', blogController.getAllBlogPosts);
router.get('/:id', blogController.getBlogPostById);

// Protected Routes
router.post('/', checkJwt, blogController.createBlogPost);
router.put('/:id', checkJwt, blogController.updateBlogPost);
router.delete('/:id', checkJwt, blogController.deleteBlogPost);

// Only include routes for methods that actually exist in the controller
// Comment the routes for methods that don't exist yet
/*
// Comment routes - IMPLEMENT THESE AFTER CREATING THE METHODS IN CONTROLLER
router.post('/:id/comments', checkJwt, blogController.addComment);
router.delete('/:id/comments/:commentId', checkJwt, blogController.deleteComment);

// Like routes - IMPLEMENT THESE AFTER CREATING THE METHODS IN CONTROLLER
router.post('/:id/like', checkJwt, blogController.toggleLike);
router.get('/:id/like-status', blogController.getLikeStatus);
*/

export default router; 