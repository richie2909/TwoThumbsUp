import express from 'express';
import { imageController } from '../controllers/image.js';
import { authenticate, authorizeAdmin } from '../middleware/Auth.js';
import { Image } from '../models/schema.js'; // Switch back to schema.js

const imageRouter = express.Router();

// IMPORTANT: Move the /:id route AFTER other specific routes to prevent conflicts
// Public routes
imageRouter.get('/', imageController.getImages);

// Routes requiring authentication
imageRouter.post('/:id/like', imageController.likeImage);

// Admin-only routes
imageRouter.post('/', authenticate, authorizeAdmin, imageController.createImage);
imageRouter.patch('/:id', authenticate, authorizeAdmin, imageController.updateImage);
imageRouter.delete('/:id', authenticate, authorizeAdmin, imageController.deleteImage);

// Test image creation route
// imageRouter.post('/test', imageController.createTestImage);

// FIXED: Image by ID route - Simplified and robust
imageRouter.get('/:id', async (req, res) => {
  try {
    if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: 'Invalid image ID format' });
    }

    console.log(`Serving image with ID: ${req.params.id}`);
    const image = await Image.findById(req.params.id);
    
    if (!image) {
      console.log(`Image not found: ${req.params.id}`);
      return res.status(404).json({ message: 'Image not found' });
    }
    
    if (!image.ImageData) {
      console.log(`Image has no data: ${req.params.id}`);
      return res.status(404).json({ message: 'Image data not found' });
    }
    
    console.log(`Found image: ${image.Name}, serving content type: ${image.ContentType}`);
    res.contentType(image.ContentType);
    res.send(image.ImageData);
  } catch (error) {
    console.error(`Error serving image ${req.params.id}:`, error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Add this route to your imageRouter
imageRouter.get('/debug/list', async (req, res) => {
  try {
    const images = await Image.find().lean();
    
    // Create a safe response without the full image data
    const safeImages = images.map(img => ({
      id: img._id,
      name: img.Name,
      contentType: img.ContentType,
      hasImageData: !!img.ImageData,
      dataSize: img.ImageData ? img.ImageData.length : 0,
      createdAt: img.createdAt
    }));
    
    res.json({
      total: images.length,
      images: safeImages
    });
  } catch (error) {
    console.error('Error listing images:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Add this route to check if a user has liked an image
imageRouter.get('/:id/like/status', async (req, res) => {
  try {
    const userId = req.user?._id;
    
    if (!userId) {
      return res.status(200).json({ liked: false });
    }
    
    const image = await Image.findById(req.params.id);
    if (!image) {
      return res.status(404).json({ message: 'Image not found' });
    }
    
    // Check if user's ID is in the likedBy array
    const liked = image.likedBy && image.likedBy.includes(userId);
    
    return res.status(200).json({ liked });
  } catch (error) {
    console.error('Error checking like status:', error);
    return res.status(500).json({ message: 'Server error' });
  }
});

export default imageRouter; 