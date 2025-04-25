import React from 'react';
import { FaTimes } from 'react-icons/fa';
import { motion } from 'framer-motion';

interface EnlargeImageModalProps {
  imageSrc: string;
  onClose: () => void;
}

const EnlargeImageModal: React.FC<EnlargeImageModalProps> = ({ imageSrc, onClose }) => {
  console.log("Modal opened with image:", imageSrc);
  
  // Handle backdrop click to close
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-80 z-50 flex items-center justify-center p-4"
      onClick={handleBackdropClick}
    >
      <div className="relative max-w-4xl max-h-[90vh] overflow-hidden rounded-lg">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 z-10 bg-black bg-opacity-50 rounded-full p-2 text-white hover:bg-opacity-70 transition"
          aria-label="Close modal"
        >
          <FaTimes />
        </button>
        
        <img
          src={imageSrc}
          alt="Enlarged view"
          className="max-h-[90vh] max-w-full object-contain"
          onError={(e) => {
            console.error(`Failed to load enlarged image: ${imageSrc}`);
            (e.target as HTMLImageElement).src = '/placeholder.jpg';
          }}
        />
      </div>
    </motion.div>
  );
};

export default EnlargeImageModal;
