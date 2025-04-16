import express from 'express';
import connectDB from "./db/connect.js"
import dotenv from 'dotenv';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { initializeAdmins } from './model/schema.js';
import imageRoutes from './routes/route.js';
import errorHandler from './middleware/errorHandler.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables with explicit path
dotenv.config({ path: path.join(__dirname, '.env') });

// Check if critical env vars are loaded
if (!process.env.JWT_SECRET) {
  console.error('ERROR: JWT_SECRET environment variable is not set!');
  process.exit(1);
}

if (!process.env.MONGO_URI) {
  console.error('ERROR: MONGO_URI environment variable is not set!');
  process.exit(1);
}

const app = express();
// Use different port for different environments
const PORT = process.env.NODE_ENV === 'production' 
  ? (process.env.PRODUCTION_PORT || process.env.PORT || 5000)
  : (process.env.DEVELOPMENT_PORT || process.env.PORT || 5000);

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? [process.env.PRODUCTION_CLIENT_URL || 'https://richie-00.github.io'] 
    : (process.env.DEVELOPMENT_CLIENT_URL || 'http://localhost:5173'),
  credentials: true
}));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/img', imageRoutes);

// Error Handling
app.use(errorHandler);

// Initialize database and start server
const startServer = async () => {
  try {
    // Connect to database first
    await connectDB();
    
    // Start the server
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
    });
    
    // Initialize admin users after connection is established
    await initializeAdmins();
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();