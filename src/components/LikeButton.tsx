import React, { useState, useEffect } from 'react';
import { FaHeart } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

interface LikeButtonProps {
  imageId: string;
  size?: 'sm' | 'md' | 'lg';
  showCount?: boolean;
}

const LikeButton: React.FC<LikeButtonProps> = ({ 
  imageId,
  size = 'md',
  showCount = true 
}) => {
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [showBurst, setShowBurst] = useState(false);

  // Calculate sizes based on size prop
  const iconSize = size === 'sm' ? 'text-lg' : size === 'md' ? 'text-xl' : 'text-2xl';
  const buttonPadding = size === 'sm' ? 'p-1.5' : size === 'md' ? 'p-2' : 'p-3';
  
  // Fetch initial like status
  useEffect(() => {
    if (imageId) {
      fetchLikeStatus();
    }
  }, [imageId]);

  const fetchLikeStatus = async () => {
    try {
      const response = await fetch(`/img/${imageId}/like-status`, {
        credentials: 'include' // Important for cookies
      });
      
      if (response.ok) {
        const data = await response.json();
        setLiked(data.liked);
        setLikes(data.likes);
      }
    } catch (error) {
      console.error('Error fetching like status:', error);
    }
  };

  const handleLike = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/img/${imageId}/like`, {
        method: 'POST',
        credentials: 'include', // Important for cookies
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        
        // If we're liking (not unliking), show animation
        if (!liked && data.liked) {
          setShowBurst(true);
          setTimeout(() => setShowBurst(false), 700);
        }
        
        setLiked(data.liked);
        setLikes(data.likes);
      }
    } catch (error) {
      console.error('Error liking image:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative inline-flex items-center">
      <motion.button
        onClick={handleLike}
        disabled={isLoading}
        className={`${buttonPadding} rounded-full transition-all relative overflow-hidden ${
          liked ? 'bg-red-50' : 'bg-gray-50 hover:bg-gray-100'
        }`}
        whileTap={{ scale: 0.9 }}
        aria-label={liked ? 'Unlike this image' : 'Like this image'}
      >
        <motion.div
          animate={{ 
            scale: liked ? [1, 1.2, 1] : 1,
            color: liked ? '#ef4444' : '#9ca3af'
          }}
          transition={{ duration: 0.3 }}
          className={`${iconSize} ${liked ? 'text-red-500' : 'text-gray-400'}`}
        >
          <FaHeart />
        </motion.div>
        
        {/* Heart burst animation */}
        <AnimatePresence>
          {showBurst && (
            <motion.div 
              className="absolute inset-0 pointer-events-none"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute inline-flex w-full h-full items-center justify-center"
                  initial={{ scale: 0 }}
                  animate={{ 
                    scale: 1.5,
                    opacity: [1, 0],
                    rotate: i * 60
                  }}
                  transition={{ 
                    duration: 0.6,
                    ease: 'easeOut' 
                  }}
                >
                  <div 
                    className="w-1 h-1 bg-red-500 rounded-full"
                    style={{
                      transform: `translateY(-12px)`,
                    }}
                  />
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
      
      {showCount && (
        <motion.span 
          className="text-sm font-medium ml-1.5"
          animate={{ 
            color: liked ? '#ef4444' : '#4b5563',
            scale: showBurst ? [1, 1.2, 1] : 1
          }}
          transition={{ duration: 0.3 }}
        >
          {likes}
        </motion.span>
      )}
    </div>
  );
};

export default LikeButton; 