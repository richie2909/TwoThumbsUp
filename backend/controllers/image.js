import { Image, User, initializeAdmins } from '../model/schema.js';
import { body, validationResult } from 'express-validator';
import sanitizeHtml from 'sanitize-html';
import multer from 'multer';
import bcrypt from 'bcryptjs';
import { authenticate, authorizeAdmin } from '../middleware/Auth.js';
import { SignJWT as jwtSign } from 'jose'; // Import SignJWT from jose
import dotenv from 'dotenv'; // Import dotenv
dotenv.config(); // Load environment variables
import { TextEncoder } from 'util'; // Import TextEncoder

const storage = multer.memoryStorage();
const upload = multer({ storage, limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
} },);

// Validation middleware
export const validateImage = [
    body('name')
        .escape()
        .notEmpty()
        .withMessage('Name is required')
        .customSanitizer((value) => sanitizeHtml(value)),
];

// Controller methods
export const imageController = {
    getImages: async (req, res) => {
        try {
            const images = await Image.find();
            res.json({img : images});
        } catch (error) {
            res.status(500).json({ error: 'Server error' });
        }
    },

    createImage: [
        upload.single('Image'),
        validateImage,
        async (req, res) => {
            const errors = validationResult(req);
            if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    
            console.log("req.file", req.file);
            console.log("req.body", req.body);
    
            try {
                const image = new Image({
                    Name: req.body.name,
                    ImageData: req.file.buffer,
                    ContentType: req.file.mimetype, // Ensure this matches the schema
                });
    
                await image.save();
                res.status(201).json(image);
            } catch (error) {
                console.error('Create image error:', error);
                res.status(500).json({ error: error.message });
            }
        },
    ],

    updateImage: [
        authenticate,
        authorizeAdmin,
        upload.single('image'),
        validateImage,
        async (req, res) => {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
      
            try {
                const { id } = req.params;
                const updateData = {
                    Name: req.body.name, // matches the schema key for name
                    updatedAt: Date.now(),
                };
      
                // Use the correct key names from your schema for file updates
                if (req.file) {
                    updateData.ImageData = req.file.buffer;
                    updateData.ContentType = req.file.mimetype;
                }
      
                const updatedImage = await Image.findByIdAndUpdate(id, updateData, {
                    new: true,
                    runValidators: true,
                });
      
                if (!updatedImage) {
                    return res.status(404).json({ error: 'Image not found' });
                }
      
                res.json(updatedImage);
            } catch (error) {
                console.error('Update error:', error);
                if (error.name === 'CastError') {
                    return res.status(400).json({ error: 'Invalid image ID' });
                }
                res.status(500).json({ error: 'Server error' });
            }
        },
    ],
    

    deleteImage: [
        authenticate,
        authorizeAdmin,
        async (req, res) => {
            try {
                const { id } = req.params;
                const deletedImage = await Image.findByIdAndDelete(id);

                if (!deletedImage) {
                    return res.status(404).json({ error: 'Image not found' });
                }

                res.json({
                    message: 'Image deleted successfully',
                    deletedId: deletedImage._id,
                });
            } catch (error) {
                console.error('Delete error:', error);
                if (error.name === 'CastError') {
                    return res.status(400).json({ error: 'Invalid image ID' });
                }
                res.status(500).json({ error: 'Server error' });
            }
        },
    ],
};

export const log = async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ username });
        if (!user || !bcrypt.compareSync(password, user.passwordHash)) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Create JWT token
        const token = await new jwtSign({
            userId: user._id,
            role: user.role,
        })
            .setProtectedHeader({ alg: 'HS256' })
            .setIssuedAt()
            .setExpirationTime('2h')
            .sign(new TextEncoder().encode(process.env.JWT_SECRET));

        res.cookie('jwt', token, { httpOnly: true, secure: true });
        res.json({ user: { username: user.username, role: user.role, id: user._id } }); // Ensure user is sent
        console.log('success');
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ error: 'Server error' });
    }
};