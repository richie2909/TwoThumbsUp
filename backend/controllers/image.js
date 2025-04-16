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

// Parse tags from request body
const parseTags = (tags) => {
    if (!tags) return [];
    
    try {
        if (typeof tags === 'string') {
            // If it's a JSON string, parse it
            return JSON.parse(tags);
        } else if (Array.isArray(tags)) {
            // If it's already an array, return it
            return tags;
        }
    } catch (error) {
        console.error('Error parsing tags:', error);
    }
    
    return [];
};

// Controller methods
export const imageController = {
    getImages: async (req, res) => {
        try {
            let query = {};
            const { search, tag, sort, order, limit, stats } = req.query;
            
            // Text search
            if (search) {
                query.Name = { $regex: search, $options: 'i' };
            }
            
            // Tag filter
            if (tag) {
                query.tags = { $in: [tag] };
            }
            
            // If stats is requested, return statistics
            if (stats === 'true') {
                const totalImages = await Image.countDocuments();
                const totalLikes = await Image.aggregate([
                    { $group: { _id: null, total: { $sum: '$likes' } } }
                ]);
                
                // Get unique tags across all images
                const tags = await Image.aggregate([
                    { $unwind: '$tags' },
                    { $group: { _id: '$tags' } },
                    { $project: { _id: 0, tag: '$_id' } }
                ]);
                
                return res.json({
                    totalImages,
                    totalLikes: totalLikes.length > 0 ? totalLikes[0].total : 0,
                    uniqueTags: tags.map(t => t.tag)
                });
            }
            
            // Sorting
            let sortOption = {};
            if (sort && order) {
                sortOption[sort] = order === 'desc' ? -1 : 1;
            }
            
            // Build query
            let imagesQuery = sort 
                ? Image.find(query).sort(sortOption)
                : Image.find(query);
                
            // Apply limit if specified
            if (limit) {
                imagesQuery = imagesQuery.limit(parseInt(limit));
            }
            
            const images = await imagesQuery.exec();
            res.json({img : images});
        } catch (error) {
            console.error('Error fetching images:', error);
            res.status(500).json({ error: 'Server error' });
        }
    },

    createImage: [
        authenticate,
        authorizeAdmin,
        upload.single('Image'),
        validateImage,
        async (req, res) => {
            const errors = validationResult(req);
            if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    
            console.log("req.file", req.file);
            console.log("req.body", req.body);
            
            try {
                // Process tags if provided
                const tags = req.body.tags ? parseTags(req.body.tags) : [];
                
                const image = new Image({
                    Name: req.body.name,
                    ImageData: req.file.buffer,
                    ContentType: req.file.mimetype, // Ensure this matches the schema
                    tags: tags // Add tags to the image
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
                
                // Update tags if provided
                if (req.body.tags) {
                    updateData.tags = parseTags(req.body.tags);
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

    likeImage: [
        async (req, res) => {
            try {
                const { id } = req.params;
                
                // Generate a unique identifier for the user if not logged in
                // Either use the user ID from JWT token or generate an anonymous ID from cookies
                let userId;
                
                if (req.user && req.user.userId) {
                    // Authenticated user
                    userId = req.user.userId;
                } else {
                    // Anonymous user - use browser cookie
                    if (!req.cookies.anonymousId) {
                        // Generate a random ID if no cookie exists
                        const anonymousId = Math.random().toString(36).substring(2, 15) + 
                                           Math.random().toString(36).substring(2, 15);
                        // Set cookie for 1 year
                        res.cookie('anonymousId', anonymousId, { 
                            maxAge: 365 * 24 * 60 * 60 * 1000, 
                            httpOnly: true,
                            secure: process.env.NODE_ENV === 'production'
                        });
                        userId = 'anon_' + anonymousId;
                    } else {
                        userId = 'anon_' + req.cookies.anonymousId;
                    }
                }
                
                // Find the image
                const image = await Image.findById(id);
                
                if (!image) {
                    return res.status(404).json({ error: 'Image not found' });
                }
                
                // Check if user already liked this image
                const alreadyLiked = image.likedBy.includes(userId);
                
                if (alreadyLiked) {
                    // User already liked, so unlike
                    const updatedImage = await Image.findByIdAndUpdate(
                        id,
                        { 
                            $inc: { likes: -1 },
                            $pull: { likedBy: userId } 
                        },
                        { new: true }
                    );
                    
                    return res.json({
                        message: 'Image unliked successfully',
                        likes: updatedImage.likes,
                        liked: false
                    });
                } else {
                    // User hasn't liked, so add like
                    const updatedImage = await Image.findByIdAndUpdate(
                        id,
                        { 
                            $inc: { likes: 1 },
                            $addToSet: { likedBy: userId } 
                        },
                        { new: true }
                    );
                    
                    return res.json({
                        message: 'Image liked successfully',
                        likes: updatedImage.likes,
                        liked: true
                    });
                }
            } catch (error) {
                console.error('Like error:', error);
                if (error.name === 'CastError') {
                    return res.status(400).json({ error: 'Invalid image ID' });
                }
                res.status(500).json({ error: 'Server error' });
            }
        }
    ],
    
    // Check if user liked an image
    checkLikeStatus: [
        async (req, res) => {
            try {
                const { id } = req.params;
                
                // Get userId from auth token or cookie
                let userId;
                
                if (req.user && req.user.userId) {
                    // Authenticated user
                    userId = req.user.userId;
                } else if (req.cookies.anonymousId) {
                    // Anonymous user with existing cookie
                    userId = 'anon_' + req.cookies.anonymousId;
                } else {
                    // New anonymous user, not liked yet
                    return res.json({
                        liked: false,
                        likes: 0
                    });
                }
                
                const image = await Image.findById(id);
                
                if (!image) {
                    return res.status(404).json({ error: 'Image not found' });
                }
                
                const liked = image.likedBy.includes(userId);
                
                res.json({
                    liked,
                    likes: image.likes
                });
            } catch (error) {
                console.error('Check like status error:', error);
                res.status(500).json({ error: 'Server error' });
            }
        }
    ]
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