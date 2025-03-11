import React, {
    useContext,
    useState,
    useEffect,
    useCallback,
    useMemo,
  } from 'react';
  import { Buffer } from 'buffer';
  import { ImageContext, ImageType } from '../Context/context';
  import CardItemDesktop from './CardItemDesktop';
  import CardItemMobile from './CardItemMobile';
  import EditModal from './EditModal';
  import EnlargeImageModal from './EnlargementImageModal';
  import { motion, AnimatePresence } from 'framer-motion';
  import { FaCircleNotch } from 'react-icons/fa';
  import { useAuth } from '../Context/AuthContext';
  import { useFetchImages } from './useFetchImages';
  
  interface CardProps {
    filter?: string;
    sortBy?: string;
    sortOrder?: string;
    onPhotoCountChange?: React.Dispatch<React.SetStateAction<number>>;
    onFilterChange?: (filter: string) => void
  }
  
  const Card: React.FC<CardProps> = ({
    filter = '',
    sortBy = 'name',
    sortOrder = 'asc',
    onFilterChange = () => {}

  }) => {
    const { photo, setPhoto } = useContext(ImageContext);
    const [selectedImageId, setSelectedImageId] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [enlargedImageSrc, setEnlargedImageSrc] = useState<string | null>(null);
    const [actionLoading, setActionLoading] = useState<string | null>(null);
    const { isAuthenticated, user } = useAuth();
  
    // Fetch images using our custom hook.
    const { fetchData, loading, pageLoading } = useFetchImages(setPhoto);
    useEffect(() => {
      fetchData(filter, sortBy, sortOrder);
    }, [fetchData, filter, sortBy, sortOrder]);
  
    // Client-side filtering (if needed).
    const filteredPhotos = useMemo(() => {
      if (!photo) return [];
      if (!filter.trim()) return photo;
      return photo.filter((item) =>
        item.Name.toLowerCase().includes(filter.trim().toLowerCase())
      );
    }, [photo, filter]);
  
    // Convert Buffer image data to base64.
    const getImageSrc = useCallback((item: ImageType): string => {
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
    }, []);
  
    const handleDelete = useCallback(
      async (id: string) => {
        setActionLoading(id);
        try {
          const response = await fetch(`/img/${id}`, {
            method: 'DELETE',
            credentials: 'include',
          });
          if (response.ok) {
            setPhoto((prevPhotos) =>
              prevPhotos ? prevPhotos.filter((item) => item._id !== id) : []
            );
          } else {
            console.error('Failed to delete image:', response.statusText);
          }
        } catch (error) {
          console.error('Error deleting image:', error);
        } finally {
          setActionLoading(null);
        }
      },
      [setPhoto]
    );
  
    const handleEdit = useCallback((id: string) => {
      setSelectedImageId(id);
      setIsModalOpen(true);
    }, []);
  
    const handleCloseModal = useCallback(() => {
      setIsModalOpen(false);
      setSelectedImageId(null);
    }, []);
  
    const handleFilterChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        // This filter prop can be used by parent if needed.
        onFilterChange(e.target.value);
      },
      [onFilterChange]
    );
  
    // Open enlarged modal when image is clicked.
    const handleImageClick = useCallback((src: string) => {
      setEnlargedImageSrc(src);
    }, []);
  
    return (
      <div className="p-4 pt-8">
        {/* Optional Filter Input if needed */}
        {/* <div className="mb-4">
          <input
            type="text"
            placeholder="Filter by name"
            value={filter}
            onChange={handleFilterChange}
            className="border p-2 rounded w-full bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
          />
        </div> */}
  
        {pageLoading || loading ? (
          <div className="flex justify-center items-center h-screen">
            <FaCircleNotch className="animate-spin text-4xl text-blue-500" />
          </div>
        ) : (
          <>
            {/* Mobile Layout */}
            <div className="block sm:hidden space-y-4">
              {filteredPhotos.map((item) => (
                <div key={item._id} className="flex justify-center">
                  <CardItemMobile
                    item={item}
                    getImageSrc={getImageSrc}
                    isAuthenticated={isAuthenticated}
                    user={user}
                    onDelete={handleDelete}
                    onEdit={handleEdit}
                    onImageClick={handleImageClick}
                  />
                </div>
              ))}
            </div>
            {/* Desktop Layout */}
            <motion.div
              className="hidden sm:grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              {filteredPhotos.map((item) => (
                <div key={item._id} className="flex justify-center">
                  <CardItemDesktop
                    item={item}
                    getImageSrc={getImageSrc}
                    isAuthenticated={isAuthenticated}
                    user={user}
                    actionLoading={actionLoading}
                    onDelete={handleDelete}
                    onEdit={handleEdit}
                    onImageClick={handleImageClick}
                  />
                </div>
              ))}
            </motion.div>
          </>
        )}
  
        {/* Edit Modal */}
        <AnimatePresence>
          {isModalOpen && selectedImageId && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <EditModal
                imageId={selectedImageId}
                onClose={handleCloseModal}
                setPhoto={setPhoto}
              />
            </motion.div>
          )}
        </AnimatePresence>
  
        {/* Enlarge Image Modal */}
        <AnimatePresence>
          {enlargedImageSrc && (
            <EnlargeImageModal
              imageSrc={enlargedImageSrc}
              onClose={() => setEnlargedImageSrc(null)}
            />
          )}
        </AnimatePresence>
      </div>
    );
  };
  
  export default React.memo(Card);
  