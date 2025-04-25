import mongoose from 'mongoose';

const ImageSchema = new mongoose.Schema({
    Name: {
        type: String,
        required: true,
        trim: true,
        minLength: 1,
        maxLength: 100,
        index: true,
    },
    ImageData: {
        type: Buffer,
        required: true,
    },
    ContentType: {
        type: String,
        required: true,
    },
    tags: {
        type: [String],
        default: [],
        index: true
    },
    likes: {
        type: Number,
        default: 0
    },
    likedBy: {
        type: [String],
        default: []
    }
}, { timestamps: true });

// Export the model
export default mongoose.models.Image || mongoose.model('Image', ImageSchema); 