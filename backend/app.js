import express from 'express';
import connectDB from "./db/connect.js"
import dotenv from 'dotenv';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { initializeAdmins } from './model/schema.js';
import imageRoutes from './routes/route.js';
import errorHandler from './middleware/errorHandler.js';


dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet());
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));



// Routes
app.use('/img', imageRoutes);

// Error Handling
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


// Database Connection
connectDB().then(async () => {
  await initializeAdmins();
});