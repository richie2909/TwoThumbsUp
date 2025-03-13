import express from 'express';
import { authenticate, authorizeAdmin } from '../middleware/Auth.js';
import { imageController, log } from '../controllers/image.js';

const router = express.Router();

router.post('/api/login', log )
router.get('/', imageController.getImages);
router.post('/', authenticate, authorizeAdmin, imageController.createImage);
router.patch('/:id', authenticate, authorizeAdmin, imageController.updateImage);
router.delete('/:id', authenticate, authorizeAdmin, imageController.deleteImage);

export default router;