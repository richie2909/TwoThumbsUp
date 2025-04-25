import BlogPost from '../models/BlogPost.js';

// Create a controller object with all the methods
const blogController = {
    // Basic CRUD operations
    getAllBlogPosts: async (req, res) => {
        try {
            console.log('GET /blog request received');
            const { limit = 10 } = req.query;
            
            // Simple query to get posts
            const posts = await BlogPost.find()
                .sort({ createdAt: -1 })
                .limit(parseInt(limit))
                .lean();
            
            res.status(200).json({ 
                posts,
                totalPages: 1,
                currentPage: 1,
                totalPosts: posts.length
            });
        } catch (error) {
            console.error('Error fetching blog posts:', error);
            res.status(500).json({ error: 'Server error' });
        }
    },
    
    getBlogPostById: async (req, res) => {
        try {
            const post = await BlogPost.findById(req.params.id);
            if (!post) return res.status(404).json({ error: 'Post not found' });
            res.status(200).json(post);
        } catch (error) {
            console.error('Error fetching blog post:', error);
            res.status(500).json({ error: 'Server error' });
        }
    },
    
    createBlogPost: async (req, res) => {
        try {
            const post = new BlogPost(req.body);
            await post.save();
            res.status(201).json(post);
        } catch (error) {
            console.error('Error creating blog post:', error);
            res.status(500).json({ error: 'Server error' });
        }
    },
    
    updateBlogPost: async (req, res) => {
        try {
            const post = await BlogPost.findByIdAndUpdate(
                req.params.id, 
                req.body,
                { new: true }
            );
            if (!post) return res.status(404).json({ error: 'Post not found' });
            res.status(200).json(post);
        } catch (error) {
            console.error('Error updating blog post:', error);
            res.status(500).json({ error: 'Server error' });
        }
    },
    
    deleteBlogPost: async (req, res) => {
        try {
            const post = await BlogPost.findByIdAndDelete(req.params.id);
            if (!post) return res.status(404).json({ error: 'Post not found' });
            res.status(200).json({ message: 'Post deleted' });
        } catch (error) {
            console.error('Error deleting blog post:', error);
            res.status(500).json({ error: 'Server error' });
        }
    },

    // Add a comment
    addComment: async (req, res) => {
        try {
            const localUser = await getLocalUser(req.auth?.payload);
            if (!localUser) return res.status(401).json({ error: 'Authentication required to comment.' });

            const { content } = req.body;
            if (!content) return res.status(400).json({ error: 'Comment content cannot be empty.' });

            const post = await BlogPost.findById(req.params.id);
            if (!post) return res.status(404).json({ error: 'Post not found.' });

            const newComment = {
                content,
                author: localUser._id,
                authorUsername: localUser.username
            };

            post.comments.push(newComment);
            await post.save();

            // Find the newly added comment to populate its author for the response
            const addedComment = post.comments[post.comments.length - 1];
            await addedComment.populate('author', 'username profilePicture');

            res.status(201).json(addedComment);
        } catch (error) {
            console.error('Error adding comment:', error);
            res.status(500).json({ error: 'Failed to add comment.' });
        }
    },

    // Delete comment
    deleteComment: async (req, res) => {
        try {
            const localUser = await getLocalUser(req.auth?.payload);
            if (!localUser) return res.status(401).json({ error: 'Authentication required.' });

            const { id: postId, commentId } = req.params;

            const post = await BlogPost.findById(postId);
            if (!post) return res.status(404).json({ error: 'Post not found.' });

            const commentIndex = post.comments.findIndex(c => c._id.equals(commentId));
            if (commentIndex === -1) return res.status(404).json({ error: 'Comment not found.' });

            const comment = post.comments[commentIndex];

            const isCommentAuthor = comment.author?.equals(localUser._id);
            const isAdmin = localUser.role === 'admin';
            if (!isCommentAuthor && !isAdmin) return res.status(403).json({ error: 'Forbidden: You cannot delete this comment.' });

            post.comments.splice(commentIndex, 1); // Remove comment from array
            await post.save();

            res.status(200).json({ message: 'Comment deleted successfully.' });
        } catch (error) {
            console.error('Error deleting comment:', error);
            res.status(500).json({ error: 'Failed to delete comment.' });
        }
    },

    // Toggle like
    toggleLike: async (req, res) => {
        try {
            const localUser = await getLocalUser(req.auth?.payload);
            if (!localUser) return res.status(401).json({ error: 'Authentication required to like/unlike.' });

            const post = await BlogPost.findById(req.params.id);
            if (!post) return res.status(404).json({ error: 'Post not found.' });

            const userIdString = localUser._id.toString();
            const likeIndex = post.likes.findIndex(likeId => likeId.equals(localUser._id));

            let liked;
            if (likeIndex > -1) {
                // User already liked, so unlike
                post.likes.splice(likeIndex, 1);
                liked = false;
            } else {
                // User hasn't liked, so like
                post.likes.push(localUser._id);
                liked = true;
            }

            await post.save();
            // Return the updated like count and the user's like status
            res.status(200).json({ likeCount: post.likes.length, liked });

        } catch (error) {
            console.error('Error toggling like:', error);
            res.status(500).json({ error: 'Failed to toggle like status.' });
        }
    },
};

export default blogController; 