import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../Context/AuthContext';
import { FaHeart, FaRegHeart, FaTrash, FaEdit, FaCircleNotch } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

interface Comment {
    _id: string;
    content: string;
    author: string;
    createdAt: string;
}

interface BlogPost {
    _id: string;
    title: string;
    content: string;
    author: string;
    createdAt: string;
    updatedAt: string;
    tags: string[];
    likes: {
        count: number;
        users: string[];
    };
    comments: Comment[];
}

const BlogPostDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { isAuthenticated, user, getAccessTokenSilently } = useAuth();
    const [post, setPost] = useState<BlogPost | null>(null);
    const [loading, setLoading] = useState(true);
    const [comment, setComment] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchPost = async () => {
            if (!id) return;
            setLoading(true);
            setError(null);
            
            try {
                const response = await fetch(`/api/v1/blog/${id}`);
                if (!response.ok) {
                    const errorData = await response.json().catch(() => ({}));
                    throw new Error(errorData.error || `Failed to fetch post (${response.status})`);
                }
                
                const data = await response.json();
                setPost(data);
            } catch (err) {
                console.error('Error fetching blog post:', err);
                setError(err instanceof Error ? err.message : 'Failed to load blog post');
            } finally {
                setLoading(false);
            }
        };

        fetchPost();
    }, [id]);

    const handleLike = async () => {
        if (!isAuthenticated) {
            return;
        }
        
        try {
            const token = await getAccessTokenSilently();
            
            const response = await fetch(`/api/v1/blog/${id}/like`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            
            if (!response.ok) {
                throw new Error('Failed to update like status');
            }
            
            const data = await response.json();
            
            setPost(prev => {
                if (!prev) return null;
                return {
                    ...prev,
                    likes: {
                        count: data.likeCount || prev.likes.count,
                        users: data.liked 
                            ? [...(prev.likes.users || []), user?.sub] 
                            : (prev.likes.users || []).filter(id => id !== user?.sub)
                    }
                };
            });
        } catch (error) {
            console.error('Error updating like:', error);
        }
    };

    const handleComment = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!isAuthenticated || !comment.trim()) {
            return;
        }
        
        setSubmitting(true);
        
        try {
            const token = await getAccessTokenSilently();
            
            const response = await fetch(`/api/v1/blog/${id}/comments`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ content: comment })
            });
            
            if (!response.ok) {
                throw new Error('Failed to add comment');
            }
            
            const newComment = await response.json();
            
            setPost(prev => {
                if (!prev) return null;
                return {
                    ...prev,
                    comments: [...(prev.comments || []), newComment]
                };
            });
            
            setComment('');
        } catch (error) {
            console.error('Error adding comment:', error);
        } finally {
            setSubmitting(false);
        }
    };

    const handleDeleteComment = async (commentId: string) => {
        try {
            const response = await fetch(`/blog/${id}/comments/${commentId}`, {
                method: 'DELETE',
                credentials: 'include'
            });

            if (!response.ok) throw new Error('Failed to delete comment');
            setPost(prev => prev ? {
                ...prev,
                comments: prev.comments.filter(c => c._id !== commentId)
            } : null);
        } catch (error) {
            console.error('Error:', error);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <FaCircleNotch className="animate-spin text-4xl text-indigo-500" />
            </div>
        );
    }

    if (error || !post) {
        return (
            <div className="text-center py-12">
                <h2 className="text-2xl text-gray-800 mb-4">Error</h2>
                <p className="text-gray-600">{error || 'Post not found'}</p>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <article className="bg-white rounded-xl shadow-md overflow-hidden">
                <div className="p-6">
                    <h1 className="text-3xl font-bold text-gray-800 mb-4">{post.title}</h1>
                    
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center text-sm text-gray-500">
                            <span className="mr-4">{post.author}</span>
                            <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                        </div>
                        
                        {isAuthenticated && user?.role === 'admin' && (
                            <div className="flex gap-2">
                                <button
                                    onClick={() => navigate(`/blog/edit/${post._id}`)}
                                    className="p-2 text-blue-500 hover:text-blue-700 transition-colors"
                                >
                                    <FaEdit size={20} />
                                </button>
                                <button
                                    onClick={() => {/* handle delete */}}
                                    className="p-2 text-red-500 hover:text-red-700 transition-colors"
                                >
                                    <FaTrash size={20} />
                                </button>
                            </div>
                        )}
                    </div>

                    <div className="prose max-w-none mb-6">
                        {post.content.split('\n').map((paragraph, index) => (
                            <p key={index} className="mb-4 text-gray-600">
                                {paragraph}
                            </p>
                        ))}
                    </div>

                    {post.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-6">
                            {post.tags.map(tag => (
                                <span
                                    key={tag}
                                    className="text-sm bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full"
                                >
                                    #{tag}
                                </span>
                            ))}
                        </div>
                    )}

                    <div className="border-t pt-6">
                        <div className="flex items-center gap-4 mb-6">
                            <button
                                onClick={handleLike}
                                disabled={!isAuthenticated}
                                className="flex items-center gap-2 text-gray-600 hover:text-red-500 transition-colors"
                            >
                                {post.likes.users.includes(user?.username || '') ? (
                                    <FaHeart className="text-red-500" />
                                ) : (
                                    <FaRegHeart />
                                )}
                                <span>{post.likes.count}</span>
                            </button>
                        </div>

                        {/* Comments Section */}
                        <div className="space-y-6">
                            <h3 className="text-xl font-semibold text-gray-800">
                                Comments ({post.comments.length})
                            </h3>

                            {isAuthenticated ? (
                                <form onSubmit={handleComment} className="mb-6">
                                    <textarea
                                        value={comment}
                                        onChange={(e) => setComment(e.target.value)}
                                        placeholder="Add a comment..."
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                                        rows={3}
                                    />
                                    <button
                                        type="submit"
                                        disabled={submitting || !comment.trim()}
                                        className="mt-2 px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors disabled:bg-gray-400"
                                    >
                                        {submitting ? 'Posting...' : 'Post Comment'}
                                    </button>
                                </form>
                            ) : (
                                <p className="text-gray-600 italic">
                                    Please log in to comment.
                                </p>
                            )}

                            <div className="space-y-4">
                                {post.comments.map((comment) => (
                                    <motion.div
                                        key={comment._id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="bg-gray-50 p-4 rounded-lg"
                                    >
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <p className="font-medium text-gray-800">
                                                    {comment.author}
                                                </p>
                                                <p className="text-sm text-gray-500">
                                                    {new Date(comment.createdAt).toLocaleDateString()}
                                                </p>
                                            </div>
                                            {(user?.username === comment.author || user?.role === 'admin') && (
                                                <button
                                                    onClick={() => handleDeleteComment(comment._id)}
                                                    className="text-red-500 hover:text-red-700 transition-colors"
                                                >
                                                    <FaTrash size={14} />
                                                </button>
                                            )}
                                        </div>
                                        <p className="mt-2 text-gray-600">{comment.content}</p>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </article>
        </div>
    );
};

export default BlogPostDetail; 