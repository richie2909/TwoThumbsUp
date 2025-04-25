import React, { useState, useEffect, useCallback } from 'react';
import { Buffer } from 'buffer';
import { motion } from 'framer-motion';
import { FaHeart, FaFire } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { ImageType } from '../Context/context';
import LikeButton from './LikeButton';
import EnlargeImageModal from './EnlargementImageModal';

interface PopularImagesProps {
  limit?: number;
  className?: string;
}

const PopularImages: React.FC<PopularImagesProps> = ({ limit = 5, className = '' }) => {
  const [popularImages, setPopularImages] = useState<ImageType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [enlargedImage, setEnlargedImage] = useState<string | null>(null);
  const [showModal, setShowModal] = useState<boolean>(false);

  // Function to fetch popular images
  const fetchPopularImages = useCallback(async () => {
    try {
      const response = await fetch(`/img?sort=likes&order=desc&limit=${limit}`, {
        credentials: 'include'
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const json = await response.json();
      console.log("Popular images response:", json);
      
      if (json && Array.isArray(json.img)) {
        setPopularImages(json.img);
      } else if (json && Array.isArray(json)) {
        setPopularImages(json);
      } else {
        console.error("Unexpected response format:", json);
        throw new Error('Invalid response format');
      }
    } catch (error) {
      console.error('Error fetching popular images:', error);
      setError('Failed to load popular images');
    } finally {
      setLoading(false);
    }
  }, [limit]);

  // Effect to fetch images when component mounts
  useEffect(() => {
    setLoading(true);
    fetchPopularImages();
  }, [fetchPopularImages]);

  // Direct URL for image source
  const getImageSrc = (item: ImageType): string => {
    if (!item || !item._id) {
      console.error("Invalid image item:", item);
      return ''; // Return empty string or placeholder
    }
    return `/img/${item._id}`;
  };

  // Handle image click to show enlarged view
  const handleImageClick = (item: ImageType) => {
    const imgSrc = getImageSrc(item);
    console.log("Enlarging image:", imgSrc);
    setEnlargedImage(imgSrc);
    setShowModal(true);
  };

  // Handle like action to update the hearts count in real-time
  const handleHeartUpdate = (imageId: string) => {
    setPopularImages(prevImages => prevImages.map(image => {
      if (image._id === imageId) {
        // Toggle the heart count without refetching the entire list
        const wasHearted = image.heartedByCurrentUser || false;
        return {
          ...image,
          hearts: wasHearted ? (image.hearts || 0) - 1 : (image.hearts || 0) + 1,
          heartedByCurrentUser: !wasHearted
        };
      }
      return image;
    }));
  };

  if (loading) {
    return (
      <div className={`p-4 bg-white rounded-xl shadow-md ${className}`}>
        <div className="flex items-center justify-center h-40">
          <div className="animate-spin rounded-full h-10 w-10 border-4 border-indigo-500 border-t-transparent"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`p-4 bg-white rounded-xl shadow-md ${className}`}>
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  if (popularImages.length === 0) {
    return (
      <div className={`p-4 bg-white rounded-xl shadow-md ${className}`}>
        <p className="text-gray-500">No popular images found</p>
      </div>
    );
  }

  return (
    <>
      <div className={`bg-white rounded-xl shadow-md ${className}`}>
        <div className="p-4 border-b border-gray-100">
          <div className="flex items-center">
            <FaFire className="text-orange-500 mr-2" />
            <h2 className="text-lg font-semibold text-gray-800">Popular Images</h2>
          </div>
        </div>
        <div className="p-4">
          <div className="grid grid-cols-1 gap-4">
            {popularImages.map((item) => (
              <motion.div
                key={item._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded-lg transition"
              >
                <div 
                  onClick={() => handleImageClick(item)} 
                  className="block relative w-16 h-16 rounded overflow-hidden bg-gray-100 cursor-pointer"
                >
                  <img
                    src={getImageSrc(item)}
                    alt={item.Name}
                    className="w-full h-full object-contain"
                    onError={(e) => {
                      console.error(`Error loading image: ${item._id}`);
                      (e.target as HTMLImageElement).src = '/placeholder.jpg';
                    }}
                  />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-gray-800 truncate">{item.Name}</h3>
                  <div className="flex items-center text-sm text-gray-500">
                    <FaHeart className="text-red-500 mr-1" />
                    <span>{item.hearts || 0} hearts</span>
                  </div>
                </div>
                <LikeButton 
                  imageId={item._id} 
                  initialLiked={item.heartedByCurrentUser || false}
                  onLikeUpdate={() => handleHeartUpdate(item._id)} 
                />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Image enlargement modal */}
      {showModal && enlargedImage && (
        <EnlargeImageModal
          imageSrc={enlargedImage}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  );
};

export default PopularImages; 