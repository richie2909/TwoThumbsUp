import React from 'react';
import { motion } from 'framer-motion';
import { ImageType } from '../Context/context';
import { HiPencilAlt, HiTrash } from 'react-icons/hi';
import { Link } from 'react-router-dom';
import LikeButton from './LikeButton';

interface CardItemProps {
  item: ImageType;
  getImageSrc: (item: ImageType) => string;
  isAuthenticated: boolean;
  user: any | null;
  actionLoading?: string | null;
  onDelete?: (id: string) => void;
  onEdit?: (id: string) => void;
  onImageClick?: (src: string) => void;
}

const CardItemDesktop: React.FC<CardItemProps> = ({
  item,
  getImageSrc,
  isAuthenticated,
  user,
  actionLoading,
  onDelete,
  onEdit,
  onImageClick,
}) => {
  const formattedDate = item.createdAt
    ? new Date(item.createdAt).toLocaleDateString()
    : 'Unknown date';

  const imageSrc = getImageSrc(item);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="w-full max-w-sm bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow"
    >
      {/* Image Section */}
      <div 
        className="h-48 overflow-hidden cursor-pointer" 
        onClick={() => onImageClick && onImageClick(imageSrc)}
      >
        <img
          src={imageSrc}
          alt={item.Name}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
        />
      </div>

      {/* Content Section */}
      <div className="p-4">
        <div className="flex justify-between items-start mb-3">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-1">{item.Name}</h3>
            <p className="text-sm text-gray-500">Added on {formattedDate}</p>
          </div>

          {/* Admin Controls - Edit & Delete buttons */}
          {isAuthenticated && user?.role === 'admin' && (
            <div className="flex space-x-2">
              <button
                onClick={() => onEdit && onEdit(item._id)}
                className="text-blue-500 hover:text-blue-700 transition"
                aria-label="Edit"
              >
                <HiPencilAlt size={20} />
              </button>
              <button
                onClick={() => onDelete && onDelete(item._id)}
                className="text-red-500 hover:text-red-700 transition"
                aria-label="Delete"
                disabled={actionLoading === item._id}
              >
                {actionLoading === item._id ? (
                  <div className="animate-spin h-5 w-5 border-2 border-red-500 rounded-full border-t-transparent"></div>
                ) : (
                  <HiTrash size={20} />
                )}
              </button>
            </div>
          )}
        </div>
        
        {/* Like button and tags row */}
        <div className="flex items-center justify-between mt-3">
          <LikeButton imageId={item._id} />
          
          {/* Tags display */}
          <div className="flex flex-wrap gap-1 justify-end">
            {item.tags && item.tags.length > 0 && (
              item.tags.map(tag => (
                <Link 
                  key={tag} 
                  to={`/search?tag=${tag.toLowerCase()}`}
                  className="inline-block bg-indigo-100 text-indigo-800 text-xs px-2 py-1 rounded-full hover:bg-indigo-200 transition-colors"
                >
                  #{tag}
                </Link>
              ))
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default React.memo(CardItemDesktop);
