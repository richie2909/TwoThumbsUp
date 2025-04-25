import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import BlogPost from './BlogPost';
import { useAuth } from '../Context/AuthContext';
import { FaCircleNotch, FaPen, FaExclamationTriangle } from 'react-icons/fa';
import CreateEditPostModal from './CreateEditPostModal';

interface BlogPostType {
    _id: string;
    title: string;
    content: string;
    author: string;
    createdAt: string;
    tags: string[];
}

const BlogSection: React.FC = () => {
    const [posts, setPosts] = useState<BlogPostType[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { isAuthenticated } = useAuth();
    const [showCreateModal, setShowCreateModal] = useState(false);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                setLoading(true);
                setError(null);
                
                const response = await fetch('/api/v1/blog?limit=3');
                if (!response.ok) {
                    const errorData = await response.json().catch(() => ({}));
                    throw new Error(errorData.error || `Error ${response.status}: Failed to fetch posts`);
                }
                
                const data = await response.json();
                if (!data.posts || !Array.isArray(data.posts)) {
                    throw new Error('Invalid response format');
                }
                
                setPosts(data.posts);
            } catch (error) {
                console.error('Error fetching blog posts:', error);
                setError(error instanceof Error ? error.message : 'Unable to load posts');
            } finally {
                setLoading(false);
            }
        };

        fetchPosts();
    }, []);
    
    const handlePostCreated = (newPost: BlogPostType) => {
        setPosts(prev => [newPost, ...prev]);
        setShowCreateModal(false);
    };

    return (
        <section className="py-12 bg-gradient-to-br from-indigo-50 to-purple-50">
            <div className="container mx-auto px-4">
                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-3xl font-bold text-gray-800">Latest Blog Posts</h2>
                    {isAuthenticated && (
                        <button
                            onClick={() => setShowCreateModal(true)}
                            className="px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors flex items-center gap-2"
                        >
                            <FaPen size={14} />
                            Create Post
                        </button>
                    )}
                </div>

                {loading ? (
                    <div className="flex justify-center items-center h-40">
                        <FaCircleNotch className="animate-spin text-4xl text-indigo-500" />
                    </div>
                ) : error ? (
                    <div className="bg-white rounded-xl shadow-md p-6 text-center">
                        <FaExclamationTriangle className="text-yellow-500 text-4xl mx-auto mb-4" />
                        <p className="text-gray-600 mb-4">{error}</p>
                        <button 
                            onClick={() => window.location.reload()}
                            className="px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors"
                        >
                            Try Again
                        </button>
                    </div>
                ) : posts.length === 0 ? (
                    <div className="bg-white rounded-xl shadow-md p-8 text-center">
                        <h3 className="text-xl text-gray-800 mb-2">No Blog Posts Yet</h3>
                        <p className="text-gray-600 mb-4">Be the first to create a blog post!</p>
                        {isAuthenticated ? (
                            <button
                                onClick={() => setShowCreateModal(true)}
                                className="px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors"
                            >
                                Create Your First Post
                            </button>
                        ) : (
                            <p className="text-sm text-gray-500 mt-4">
                                Log in to create a blog post.
                            </p>
                        )}
                    </div>
                ) : (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {posts.map(post => (
                            <BlogPost key={post._id} {...post} />
                        ))}
                    </div>
                )}

                {posts.length > 0 && (
                    <div className="text-center mt-8">
                        <Link
                            to="/blog"
                            className="inline-block px-6 py-3 bg-white text-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors"
                        >
                            View All Posts
                        </Link>
                    </div>
                )}
            </div>

            {/* Create Post Modal */}
            {showCreateModal && (
                <CreateEditPostModal
                    isOpen={showCreateModal}
                    onClose={() => setShowCreateModal(false)}
                    onSuccess={handlePostCreated}
                />
            )}
        </section>
    );
};

export default BlogSection; 