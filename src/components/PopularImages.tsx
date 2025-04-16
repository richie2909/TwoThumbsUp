import React, { useState, useEffect } from 'react';
import { Buffer } from 'buffer';
import { motion } from 'framer-motion';
import { FaHeart,  FaFire } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { ImageType } from '../Context/context';
import LikeButton from './LikeButton';

interface PopularImagesProps {
  limit?: number;
  className?: string;
}

const PopularImages: React.FC<PopularImagesProps> = ({ limit = 5, className = '' }) => {
  const [popularImages, setPopularImages] = useState<ImageType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPopularImages = async () => {
      setLoading(true);
      try {
        // Fetch images sorted by likes in descending order
        const response = await fetch(`/img?sort=likes&order=desc&limit=${limit}`, {
          credentials: 'include'
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const json = await response.json();
        if (json && json.img) {
          setPopularImages(json.img);
        } else {
          throw new Error('Invalid response format');
        }
      } catch (error) {
        console.error('Error fetching popular images:', error);
        setError('Failed to load popular images');
      } finally {
        setLoading(false);
      }
    };
    
    fetchPopularImages();
  }, [limit]);

  // Convert Buffer image data to base64
  const getImageSrc = (item: ImageType): string => {
    let base64String = '';
    if (item.ImageData) {
      if ((item.ImageData as { data: number[] }).data) {
        base64String = Buffer.from(
          (item.ImageData as { data: number[] }).data
        ).toString('base64');
      } else {
        base64String = Buffer.from(item.ImageData as any).toString('base64');
      }
    }
    return `data:${item.ContentType};base64,${base64String}`;
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
        <div className="text-red-500 text-center py-4">{error}</div>
      </div>
    );
  }

  if (popularImages.length === 0) {
    return (
      <div className={`p-4 bg-white rounded-xl shadow-md ${className}`}>
        <div className="text-gray-500 text-center py-4">No popular images found</div>
      </div>
    );
  }

  return (
    <div className={`p-4 bg-white rounded-xl shadow-md ${className}`}>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800 flex items-center">
          <FaFire className="text-orange-500 mr-2" /> 
          Popular Images
        </h3>
        <Link to="/search?sort=likes&order=desc" className="text-indigo-500 text-sm hover:text-indigo-700">
          View All
        </Link>
      </div>
      
      <div className="space-y-4">
        {popularImages.map((image, index) => (
          <motion.div 
            key={image._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-center p-2 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div className="w-16 h-16 mr-3 rounded-md overflow-hidden flex-shrink-0">
              <Link to={`/search?id=${image._id}`}>
                <img 
                  src={getImageSrc(image)} 
                  alt={image.Name} 
                  className="w-full h-full object-cover"
                />
              </Link>
            </div>
            
            <div className="flex-grow min-w-0">
              <Link to={`/search?id=${image._id}`} className="hover:text-indigo-600">
                <h4 className="font-medium text-gray-800 truncate">{image.Name}</h4>
              </Link>
              
              <div className="flex items-center mt-1">
                <div className="flex items-center text-xs text-gray-500">
                  <FaHeart className="text-red-500 mr-1" />
                  <span>{image.likes} likes</span>
                </div>
                
                {image.tags && image.tags.length > 0 && (
                  <div className="ml-3 flex flex-wrap gap-1">
                    {image.tags.slice(0, 2).map(tag => (
                      <Link 
                        key={tag}
                        to={`/search?tag=${tag.toLowerCase()}`}
                        className="text-xs bg-indigo-100 text-indigo-800 px-1.5 py-0.5 rounded-full"
                      >
                        #{tag}
                      </Link>
                    ))}
                    {image.tags.length > 2 && (
                      <span className="text-xs text-gray-500">+{image.tags.length - 2}</span>
                    )}
                  </div>
                )}
              </div>
            </div>
            
            <div className="ml-2">
              <LikeButton imageId={image._id} size="sm" showCount={false} />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default PopularImages; 