import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Load environment variables if not in production
if (process.env.NODE_ENV !== 'production') {
    // Correct path when running from project root
    dotenv.config({ path: './backend/.env' });
}

const mongoUri = process.env.MONGO_URI;

if (!mongoUri) {
    console.error("FATAL ERROR: MONGO_URI is not defined in environment variables.");
    process.exit(1); // Exit if DB connection string is missing
}

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected successfully');
    
    // List all collections to verify structure
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('Available collections:', collections.map(c => c.name));
    
    return mongoose.connection;
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

// Use default export for ESM
export default connectDB; 