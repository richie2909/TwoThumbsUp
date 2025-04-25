    import { body, validationResult } from 'express-validator';
    import sanitizeHtml from 'sanitize-html';
    import multer from 'multer';
    import bcrypt from 'bcryptjs';
    import { authenticate, authorizeAdmin } from '../middleware/Auth.js';
    import { SignJWT as jwtSign } from 'jose';
    import dotenv from 'dotenv';
    dotenv.config();
    import { TextEncoder } from 'util';
    import { Image, User } from '../models/schema.js';

    const storage = multer.memoryStorage();
    const upload = multer({
        storage,
        limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
    });

    // Validation middleware
    export const validateImage = [
        body('name')
            .escape()
            .notEmpty()
            .withMessage('Name is required')
            .customSanitizer(value => sanitizeHtml(value)),
    ];

    // Tag parser
    const parseTags = (tagsString) => {
        if (!tagsString) return [];
        try {
            if (typeof tagsString === 'string') {
                if (tagsString.startsWith('[')) return JSON.parse(tagsString);
                return tagsString.split(',').map(tag => tag.trim());
            }
            return tagsString;
        } catch (error) {
            console.error('Error parsing tags:', error);
            return [];
        }
    };

    // Main controller
    export const imageController = {
        getImages: async (req, res) => {
            try {
                console.log('GET /img request received with query:', req.query);
                const { search, tag, sort, order, sortBy, sortOrder, limit = 12, page = 1 } = req.query;
        
                const query = {};
                if (search) query.Name = { $regex: search, $options: 'i' };
                if (tag) query.tags = { $in: [tag] };
        
                const skip = (parseInt(page) - 1) * parseInt(limit);
                const sortOption = {};
        
                if (sort && order) {
                    sortOption[sort] = order === 'desc' ? -1 : 1;
                } else if (sortBy && sortOrder) {
                    sortOption[sortBy] = sortOrder === 'desc' ? -1 : 1;
                } else {
                    sortOption.createdAt = -1;
                }
        
                const images = await Image.find(query)
                    .sort(sortOption)
                    .skip(skip)
                    .limit(parseInt(limit))
                    .lean(); // already returns plain JS objects
        
                const totalDocs = await Image.countDocuments(query);
                const userId = req?.user?.userId || req?.user?._id;
        
                const imagesWithHeartStatus = images.map(image => ({
                    ...image,
                    heartedByCurrentUser: userId ? image.likedBy?.includes(userId) : false,
                    hearts: image.likes || 0,
                }));
        
                res.status(200).json({
                    img: imagesWithHeartStatus,
                    totalImages: totalDocs,
                    currentPage: parseInt(page),
                    totalPages: Math.ceil(totalDocs / parseInt(limit)),
                });
            } catch (error) {
                console.error('Error fetching images:', error);
                res.status(500).json({ message: 'Server error' });
            }
        },
        

        createImage: [
            authenticate,
            authorizeAdmin,
            upload.single('Image'),
            validateImage,
            async (req, res) => {
                try {
                    const errors = validationResult(req);
                    if (!errors.isEmpty()) {
                        return res.status(400).json({ errors: errors.array() });
                    }

                    if (!req.file) {
                        return res.status(400).json({ error: 'Image file is required' });
                    }

                    const image = new Image({
                        Name: req.body.name,
                        ImageData: req.file.buffer,
                        ContentType: req.file.mimetype,
                        tags: req.body.tags ? parseTags(req.body.tags) : [],
                    });

                    await image.save();
                    res.status(201).json(image);
                } catch (error) {
                    console.error('Create image error:', error);
                    res.status(500).json({ error: error.message || 'Server error' });
                }
            },
        ],

        updateImage: [
            authenticate,
            authorizeAdmin,
            upload.single('image'),
            validateImage,
            async (req, res) => {
                try {
                    const errors = validationResult(req);
                    if (!errors.isEmpty()) {
                        return res.status(400).json({ errors: errors.array() });
                    }

                    const { id } = req.params;
                    const updateData = {
                        Name: req.body.name,
                        updatedAt: Date.now(),
                    };

                    if (req.file) {
                        updateData.ImageData = req.file.buffer;
                        updateData.ContentType = req.file.mimetype;
                    }

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

        likeImage: async (req, res) => {
            try {
                const { id } = req.params;
                let userId = req.user?.userId || 'anonymous';
                const image = await Image.findById(id);

                if (!image) return res.status(404).json({ error: 'Image not found' });
                const alreadyLiked = image.likedBy.includes(userId);
                let updatedImage;

                if (alreadyLiked) {
                    updatedImage = await Image.findByIdAndUpdate(
                        id,
                        { $inc: { likes: -1 }, $pull: { likedBy: userId } },
                        { new: true }
                    );
                } else {
                    updatedImage = await Image.findByIdAndUpdate(
                        id,
                        { $inc: { likes: 1 }, $addToSet: { likedBy: userId } },
                        { new: true }
                    );
                }

                res.json({
                    message: alreadyLiked ? 'Image unliked successfully' : 'Image liked successfully',
                    likes: updatedImage.likes,
                    liked: !alreadyLiked,
                });
            } catch (error) {
                console.error('Like error:', error);
                if (error.name === 'CastError') {
                    return res.status(400).json({ error: 'Invalid image ID' });
                }
                res.status(500).json({ error: 'Server error' });
            }
        },

        checkLikeStatus: async (req, res) => {
            try {
                const { id } = req.params;
                let userId = req.user?.userId || 'anonymous';
                const image = await Image.findById(id);

                if (!image) return res.status(404).json({ error: 'Image not found' });
                const liked = image.likedBy.includes(userId);

                res.json({ liked, likes: image.likes });
            } catch (error) {
                console.error('Check like status error:', error);
                if (error.name === 'CastError') {
                    return res.status(400).json({ error: 'Invalid image ID' });
                }
                res.status(500).json({ error: 'Server error' });
            }
        },

    
        log: async (req, res) => {
            const { username, password } = req.body;
            try {
                const user = await User.findOne({ username });
                if (!user || !bcrypt.compareSync(password, user.passwordHash)) {
                    return res.status(401).json({ error: 'Invalid credentials' });
                }

                const token = await new jwtSign({
                    userId: user._id,
                    role: user.role,
                })
                    .setProtectedHeader({ alg: 'HS256' })
                    .setIssuedAt()
                    .setExpirationTime('2h')
                    .sign(new TextEncoder().encode(process.env.JWT_SECRET));

                res.cookie('jwt', token, { httpOnly: true, secure: true });
                res.json({ user: { username: user.username, role: user.role, id: user._id } });
                console.log('Login success');
            } catch (error) {
                console.error("Login error:", error);
                res.status(500).json({ error: 'Server error' });
            }
        }
    };
