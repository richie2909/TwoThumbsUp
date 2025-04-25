import express from 'express';
import { imageController } from '../controllers/image.js';


const router = express.Router();

// Public routes
router.get('/', imageController.getImages);
router.post('/api/login', imageController.log);

router.get('/:id/like-status', imageController.checkLikeStatus);

// Routes requiring authentication
router.post('/:id/like', imageController.likeImage);

// Admin-only routes
router.post('/', imageController.createImage);
router.patch('/:id',  imageController.updateImage);
router.delete('/:id', imageController.deleteImage);

export default router;
