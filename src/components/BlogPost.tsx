import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

interface BlogPostProps {
    _id: string;
    title: string;
    content: string;
    author: string;
    createdAt: string;
    tags: string[];
}

const BlogPost: React.FC<BlogPostProps> = ({
    _id,
    title,
    content,
    author,
    createdAt,
    tags
}) => {
    const formattedDate = new Date(createdAt).toLocaleDateString();
    const previewContent = content.slice(0, 200) + (content.length > 200 ? '...' : '');

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow"
        >
            <div className="p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-2 hover:text-indigo-600 transition-colors">
                    <Link to={`/blog/${_id}`}>{title}</Link>
                </h2>
                
                <div className="flex items-center text-sm text-gray-500 mb-4">
                    <span className="mr-4">{author}</span>
                    <span>{formattedDate}</span>
                </div>
                
                <p className="text-gray-600 mb-4">{previewContent}</p>
                
                {tags && tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                        {tags.map(tag => (
                            <Link
                                key={tag}
                                to={`/blog?tag=${tag.toLowerCase()}`}
                                className="text-xs bg-indigo-100 text-indigo-800 px-2 py-1 rounded-full hover:bg-indigo-200 transition-colors"
                            >
                                #{tag}
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </motion.div>
    );
};

export default React.memo(BlogPost); 