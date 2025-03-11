import React, { useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes } from 'react-icons/fa';

interface EnlargeImageModalProps {
  imageSrc: string;
  onClose: () => void;
}

const EnlargeImageModal: React.FC<EnlargeImageModalProps> = ({ imageSrc, onClose }) => {
  // Debug: log the imageSrc so you can verify it's passed correctly.
  useEffect(() => {
    console.log('EnlargeImageModal imageSrc:', imageSrc);
  }, [imageSrc]);

  const handleOverlayClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (e.target === e.currentTarget) {
        onClose();
      }
    },
    [onClose]
  );

  // If no image source is provided, don't render anything.
  if (!imageSrc) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 flex items-center justify-center bg-white/40 backdrop-blur-lg z-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={handleOverlayClick}
      >
        <motion.div
          className="relative p-6 bg-white rounded-xl shadow-2xl w-full max-w-lg max-h-[80vh] overflow-auto"
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0.8 }}
          transition={{ duration: 0.3 }}
        >
          {imageSrc ? (
            <img src={imageSrc} alt="Enlarged" className="w-full h-auto object-contain" />
          ) : (
            <div className="text-center text-gray-500">No image available</div>
          )}
          <button
            onClick={onClose}
            className="absolute top-2 right-2 text-white bg-black bg-opacity-50 p-2 rounded-full hover:bg-opacity-75 transition"
          >
            <FaTimes size={20} />
          </button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default React.memo(EnlargeImageModal);
