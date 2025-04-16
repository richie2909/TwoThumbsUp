import React from 'react';
import { ImageType } from '../Context/context';
import { HiPencilAlt, HiTrash } from 'react-icons/hi';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import LikeButton from './LikeButton';

interface CardItemMobileProps {
  item: ImageType;
  getImageSrc: (item: ImageType) => string;
  isAuthenticated: boolean;
  user: any | null;
  onDelete: (id: string) => void;
  onEdit: (id: string) => void;
  onImageClick: (src: string) => void;
}

const CardItemMobile: React.FC<CardItemMobileProps> = ({
  item,
  getImageSrc,
  isAuthenticated,
  user,
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
      className="w-full bg-white rounded-xl shadow-md overflow-hidden"
    >
      <div 
        className="h-48 overflow-hidden cursor-pointer" 
        onClick={() => onImageClick(imageSrc)}
      >
        <img
          src={imageSrc}
          alt={item.Name}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-1">{item.Name}</h3>
        <p className="text-sm text-gray-500 mb-2">Added on {formattedDate}</p>
        
        {/* Like button */}
        <div className="flex justify-between items-center mb-3">
          <LikeButton imageId={item._id} />
        </div>
        
        {/* Tags display */}
        {item.tags && item.tags.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1 mb-3">
            {item.tags.map(tag => (
              <Link 
                key={tag} 
                to={`/search?tag=${tag.toLowerCase()}`}
                className="inline-block bg-indigo-100 text-indigo-800 text-xs px-2 py-1 rounded-full hover:bg-indigo-200 transition-colors"
              >
                #{tag}
              </Link>
            ))}
          </div>
        )}
        
        {/* Admin controls */}
        {isAuthenticated && user?.role === 'admin' && (
          <div className="flex gap-2 mt-2">
            <button
              onClick={() => onEdit(item._id)}
              className="flex-1 py-2 px-3 bg-blue-500 text-white rounded-lg text-sm font-medium flex items-center justify-center gap-1"
            >
              <HiPencilAlt size={16} />
              <span>Edit</span>
            </button>
            <button
              onClick={() => onDelete(item._id)}
              className="flex-1 py-2 px-3 bg-red-500 text-white rounded-lg text-sm font-medium flex items-center justify-center gap-1"
            >
              <HiTrash size={16} />
              <span>Delete</span>
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default React.memo(CardItemMobile);
