import React, { useState } from 'react';
import { FaTimes, FaSpinner, FaExclamationCircle } from 'react-icons/fa';
import { useAuth } from '../Context/AuthContext';

interface BlogPost {
    _id: string;
    title: string;
    content: string;
    author: string;
    createdAt: string;
    tags: string[];
}

interface CreateEditPostModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: (post: BlogPost) => void;
    existingPost?: BlogPost;
}

const CreateEditPostModal: React.FC<CreateEditPostModalProps> = ({ 
    isOpen, 
    onClose, 
    onSuccess,
    existingPost 
}) => {
    const { getAccessTokenSilently } = useAuth();
    const [formData, setFormData] = useState({
        title: existingPost?.title || '',
        content: existingPost?.content || '',
        tags: existingPost?.tags?.join(', ') || ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        setError(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            // Check if title and content are not empty
            if (!formData.title.trim() || !formData.content.trim()) {
                throw new Error('Title and content are required');
            }

            // Process tags (convert comma-separated string to array and trim whitespace)
            const processedTags = formData.tags
                ? formData.tags.split(',').map(tag => tag.trim()).filter(Boolean)
                : [];

            // Get the auth token
            const token = await getAccessTokenSilently();

            // Determine if this is a create or update operation
            const url = existingPost 
                ? `/api/v1/blog/${existingPost._id}`
                : '/api/v1/blog';
            
            const method = existingPost ? 'PUT' : 'POST';

            // Send the request
            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    title: formData.title,
                    content: formData.content,
                    tags: processedTags
                })
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.error || `Failed to ${existingPost ? 'update' : 'create'} post`);
            }

            const newPost = await response.json();
            onSuccess(newPost);
        } catch (err) {
            console.error('Error submitting blog post:', err);
            setError(err instanceof Error ? err.message : 'Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div 
                className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                onClick={e => e.stopPropagation()}
            >
                <div className="flex justify-between items-center p-4 border-b">
                    <h2 className="text-xl font-bold text-gray-800">
                        {existingPost ? 'Edit Blog Post' : 'Create New Blog Post'}
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <FaTimes size={24} />
                    </button>
                </div>

                {error && (
                    <div className="m-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md flex items-center gap-2">
                        <FaExclamationCircle />
                        <span>{error}</span>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="p-4">
                    <div className="mb-4">
                        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                            Title <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            id="title"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
                            Content <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            id="content"
                            name="content"
                            value={formData.content}
                            onChange={handleChange}
                            rows={10}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            required
                        />
                    </div>

                    <div className="mb-6">
                        <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-1">
                            Tags (comma separated)
                        </label>
                        <input
                            type="text"
                            id="tags"
                            name="tags"
                            value={formData.tags}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            placeholder="technology, news, tutorial"
                        />
                    </div>

                    <div className="flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                            disabled={loading}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-indigo-500 text-white rounded-md hover:bg-indigo-600 transition-colors flex items-center gap-2"
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <FaSpinner className="animate-spin" />
                                    <span>Processing...</span>
                                </>
                            ) : (
                                <span>{existingPost ? 'Update' : 'Create'} Post</span>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateEditPostModal; 