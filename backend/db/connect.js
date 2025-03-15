// config/db.js
import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    console.log('MongoDB Connected');
  } catch (error) {
    console.error('MongoDB Connection Error:', error);
    process.exit(1);
  }
};

export default connectDB;