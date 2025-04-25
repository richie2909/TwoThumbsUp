import React, { useState, useEffect } from 'react';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

interface HeartButtonProps {
  imageId: string;
  size?: 'sm' | 'md' | 'lg';
  showCount?: boolean;
  initialLiked?: boolean;
  onLikeUpdate?: () => void;
}

const HeartButton: React.FC<HeartButtonProps> = ({ 
  imageId,
  size = 'md',
  showCount = true,
  initialLiked = false,
  onLikeUpdate
}) => {
  const [hearted, setHearted] = useState<boolean>(initialLiked);
  const [hearts, setHearts] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [showBurst, setShowBurst] = useState(false);

  // Calculate sizes based on size prop
  const iconSize = size === 'sm' ? 'text-lg' : size === 'md' ? 'text-xl' : 'text-2xl';
  const buttonPadding = size === 'sm' ? 'p-1.5' : size === 'md' ? 'p-2' : 'p-3';
  
  // Check the heart status on component mount
  useEffect(() => {
    const checkHeartStatus = async () => {
      try {
        const response = await fetch(`/img/${imageId}/like/status`, {
          credentials: 'include',
        });
        
        if (response.ok) {
          const data = await response.json();
          setHearted(data.liked);
          setHearts(data.likes);
        }
      } catch (error) {
        console.error('Error checking heart status:', error);
      }
    };
    
    checkHeartStatus();
  }, [imageId]);

  const handleHeart = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/img/${imageId}/like`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      if (response.ok) {
        setHearted(!hearted);
        // Call the callback if provided
        if (onLikeUpdate) {
          onLikeUpdate();
        }
      } else {
        console.error('Failed to heart image');
      }
    } catch (error) {
      console.error('Error hearting image:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative inline-flex items-center">
      <motion.button
        onClick={handleHeart}
        disabled={isLoading}
        className={`${buttonPadding} rounded-full transition-all relative overflow-hidden ${
          hearted ? 'bg-red-50' : 'bg-gray-50 hover:bg-gray-100'
        }`}
        whileTap={{ scale: 0.9 }}
        aria-label={hearted ? 'Remove heart' : 'Heart this'}
      >
        <motion.div
          animate={{ 
            scale: hearted ? [1, 1.2, 1] : 1,
            color: hearted ? '#ef4444' : '#9ca3af'
          }}
          transition={{ duration: 0.3 }}
          className={`${iconSize} ${hearted ? 'text-red-500' : 'text-gray-400'}`}
        >
          {isLoading ? (
            <div className="animate-pulse">
              <FaRegHeart />
            </div>
          ) : hearted ? (
            <FaHeart />
          ) : (
            <FaRegHeart />
          )}
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
            color: hearted ? '#ef4444' : '#4b5563',
            scale: showBurst ? [1, 1.2, 1] : 1
          }}
          transition={{ duration: 0.3 }}
        >
          {hearts}
        </motion.span>
      )}
    </div>
  );
};

export default HeartButton; 