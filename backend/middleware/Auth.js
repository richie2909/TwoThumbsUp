import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || 'your_default_secret_key';

// Authentication middleware - SINGLE DECLARATION
export const authenticate = (req, res, next) => {
  try {
    // Development bypass
    if (process.env.NODE_ENV === 'development' && process.env.BYPASS_AUTH === 'true') {
      console.log('WARNING: Authentication bypassed in development mode');
      req.user = { userId: 'dev_user', role: 'admin' };
      return next();
    }

    // Get token from header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];
    
    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    
    // Development bypass for errors
    if (process.env.NODE_ENV === 'development' && process.env.BYPASS_AUTH === 'true') {
      console.log('WARNING: Authentication error bypassed in development mode');
      req.user = { userId: 'dev_user', role: 'admin' };
      return next();
    }
    
    return res.status(401).json({ error: 'Invalid token' });
  }
};

// Admin authorization middleware
export const authorizeAdmin = (req, res, next) => {
  if (process.env.NODE_ENV === 'development' && process.env.BYPASS_AUTH === 'true') {
    console.log('WARNING: Admin authorization bypassed in development mode');
    return next();
  }

  if (!req.user) {
    return res.status(401).json({ error: 'Authentication required' });
  }
  
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }
  
  next();
};

if (!process.env.JWT_SECRET) {
    console.error('ERROR: JWT_SECRET environment variable is not set!');
    // Consider throwing an error or exiting the process in production
} else {
   const secret = new TextEncoder().encode(process.env.JWT_SECRET);
}

