import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema({
    content: {
        type: String,
        required: true,
        trim: true
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    authorUsername: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, { _id: true });

const blogPostSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Title is required'],
        trim: true
    },
    content: {
        type: String,
        required: [true, 'Content is required'],
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    authorUsername: {
        type: String,
        required: true,
    },
    tags: [{
        type: String,
        trim: true
    }],
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }],
    comments: [commentSchema],
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

blogPostSchema.index({ author: 1 });
blogPostSchema.index({ tags: 1 });

blogPostSchema.methods.isLikedByUser = function (userId) {
    if (!userId) return false;
    return this.likes.some(likeId => likeId.equals(userId));
};

blogPostSchema.virtual('likeCount').get(function() {
    return this.likes.length;
});

export default mongoose.models.BlogPost || mongoose.model('BlogPost', blogPostSchema); 