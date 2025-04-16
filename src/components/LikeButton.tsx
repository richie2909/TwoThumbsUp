import React, { useState, useEffect } from 'react';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import { useAuth } from '../Context/AuthContext';

interface LikeButtonProps {
  imageId: string;
}

const LikeButton: React.FC<LikeButtonProps> = ({ imageId }) => {
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const { isAuthenticated, user } = useAuth();

  // Fetch initial like status
  useEffect(() => {
    if (isAuthenticated && imageId) {
      fetchLikeStatus();
    }
  }, [imageId, isAuthenticated]);

  const fetchLikeStatus = async () => {
    try {
      const response = await fetch(`/img/${imageId}/like-status`, {
        credentials: 'include'
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
    if (!isAuthenticated) {
      // Prompt user to log in
      alert('Please log in to like this image');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`/img/${imageId}/like`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
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
    <div className="flex items-center">
      <button
        onClick={handleLike}
        disabled={isLoading}
        className={`flex items-center mr-1 transition-all ${
          liked ? 'text-red-500' : 'text-gray-400 hover:text-red-400'
        }`}
        aria-label={liked ? 'Unlike this image' : 'Like this image'}
      >
        {liked ? (
          <FaHeart className={`${isLoading ? 'opacity-50' : ''} text-xl`} />
        ) : (
          <FaRegHeart className={`${isLoading ? 'opacity-50' : ''} text-xl`} />
        )}
      </button>
      <span className="text-sm font-medium text-gray-700">{likes}</span>
    </div>
  );
};

export default LikeButton; 