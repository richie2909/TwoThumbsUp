import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import mongoose from 'mongoose';

// Import routes
import imageRoutes from './routes/imageRoute.js';
import userRoutes from './routes/user.js';
import blogRoutes from './routes/blogPost.js';

// Import utilities
import connectDB from './config/db.js';
import { initializeAdmins } from './utils/adminSetup.js';
import errorHandler from './middleware/errorHandler.js';
import Image from './models/image.js';

// Set up __dirname equivalent for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.join(__dirname, '.env') });
console.log('Environment:', process.env.NODE_ENV);
console.log('Port:', process.env.PORT);

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 5900;

// Security middleware
app.use(helmet({
  contentSecurityPolicy: false, // Disable CSP for development
}));

// CORS configuration
app.use(cors({
  origin: function(origin, callback) {
    // Allow any origin in development
    callback(null, true);
  },
  credentials: true
}));

// Request parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ 
    status: 'ok', 
    message: 'Server is running',
    env: process.env.NODE_ENV,
    port: PORT
  });
});

// Mount routes
app.use('/img', imageRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/blog', blogRoutes);

// Add this route at the end of your routes setup
app.get('/api/test-image-flow', async (req, res) => {
  try {
    // Check if we have any images in the database
    const count = await Image.countDocuments();
    
    if (count === 0) {
      return res.send(`
        <html>
          <body>
            <h1>No images found in database</h1>
            <p>You need to upload images first. Use the upload form in the application.</p>
          </body>
        </html>
      `);
    }
    
    // Get a sample image
    const image = await Image.findOne();
    
    if (!image || !image.ImageData) {
      return res.send(`
        <html>
          <body>
            <h1>Found image but missing data</h1>
            <p>Image ID: ${image?._id || 'none'}</p>
            <p>Has ImageData: ${!!image?.ImageData}</p>
          </body>
        </html>
      `);
    }
    
    // Return a simple HTML page with the image
    res.send(`
      <html>
        <body>
          <h1>Test Image</h1>
          <p>Image ID: ${image._id}</p>
          <p>Name: ${image.Name}</p>
          <p>Content Type: ${image.ContentType}</p>
          <p>Image Data Length: ${image.ImageData.length} bytes</p>
          <img src="data:${image.ContentType};base64,${image.ImageData.toString('base64')}" 
               style="max-width: 500px; border: 1px solid #ccc;" />
        </body>
      </html>
    `);
  } catch (error) {
    res.status(500).send(`
      <html>
        <body>
          <h1>Error</h1>
          <p>${error.message}</p>
          <pre>${error.stack}</pre>
        </body>
      </html>
    `);
  }
});

// Add this right before app.listen
app.get('/check-image/:id', async (req, res) => {
  try {
    const image = await mongoose.model('Image').findById(req.params.id);
    if (!image) {
      return res.send(`<h1>Image Not Found</h1><p>No image with ID ${req.params.id}</p>`);
    }
    
    res.send(`
      <h1>Image Found: ${image.Name}</h1>
      <p>ID: ${image._id}</p>
      <p>Content Type: ${image.ContentType}</p>
      <p>Has Data: ${!!image.ImageData}</p>
      <p>Data Size: ${image.ImageData ? image.ImageData.length : 0} bytes</p>
      <img src="/img/${image._id}" style="max-width: 500px; border: 1px solid #ccc;" />
    `);
  } catch (error) {
    res.status(500).send(`<h1>Error</h1><p>${error.message}</p>`);
  }
});

// Add this debug route in your app.js
app.get('/debug-images', async (req, res) => {
  try {
    const Image = mongoose.model('Image');
    const images = await Image.find({}).select('_id Name ContentType'); 
    
    let html = '<h1>Available Images</h1>';
    html += '<ul>';
    
    images.forEach(img => {
      html += `<li>
        ID: ${img._id} - Name: ${img.Name} - Type: ${img.ContentType}
        <br/>
        <a href="/img/${img._id}" target="_blank">View Direct Link</a>
      </li>`;
    });
    
    html += '</ul>';
    res.send(html);
  } catch (error) {
    res.status(500).send(`Error: ${error.message}`);
  }
});

// Error handling middleware
app.use(errorHandler);

// Start server
const startServer = async () => {
  try {
    // Connect to MongoDB
    await connectDB();
    console.log('MongoDB connected successfully');
    
    // Start listening for requests
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
    });
    
    // Initialize admin users
    await initializeAdmins();
  } catch (error) {
    console.error('Failed to start server:', error);
  }
};

startServer();

export default app;