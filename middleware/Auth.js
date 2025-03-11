import { jwtVerify } from 'jose';
import { User } from '../model/schema.js';
import dotenv from "dotenv"

dotenv.config()
let secret;

if (!process.env.JWT_SECRET) {
    console.error('ERROR: JWT_SECRET environment variable is not set!');
    // Consider throwing an error or exiting the process in production
} else {
    secret = new TextEncoder().encode(process.env.JWT_SECRET);
}

export const authenticate = async (req, res, next) => {
    try {
        if (!secret) {
            return res.status(500).json({ error: 'Internal server error' });
        }

        const token = req.cookies.jwt;  
        if (!token) return res.status(401).json({ error: 'Unauthorized' });

        const { payload } = await jwtVerify(token, secret);
        const user = await User.findById(payload.userId);

        if (!user) return res.status(401).json({ error: 'Invalid token' }); // changed to 401

        req.user = user;
        next();
    } catch (error) {
        console.error('Authentication error:', error);
        res.status(401).json({ error: 'Invalid token' }); // changed to 401
    }
};

export const authorizeAdmin = (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Admin access required' });
    }
    next();
};