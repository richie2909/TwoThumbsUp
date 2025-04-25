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
  import { FaCircleNotch, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
  import { useAuth } from '../Context/AuthContext';
  import { useFetchImages } from './useFetchImages';
  
  interface CardProps {
    filter?: string;
    sortBy?: string;
    sortOrder?: string;
    onPhotoCountChange?: React.Dispatch<React.SetStateAction<number>>;
    onFilterChange?: (filter: string) => void;
    selectedTag?: string;
    limit?: number;
  }
  
  const ITEMS_PER_PAGE = 12; // Show 12 images per page
  
  const Card: React.FC<CardProps> = ({
    filter = '',
    sortBy = 'name',
    sortOrder = 'asc',
    selectedTag = '',
    limit,
    // onFilterChange = () => {}
  }) => {
    const { photo, setPhoto } = useContext(ImageContext);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [selectedImageId, setSelectedImageId] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [enlargedImageSrc, setEnlargedImageSrc] = useState<string | null>(null);
    const [actionLoading, setActionLoading] = useState<string | null>(null);
    const { isAuthenticated, user } = useAuth();
  
    // Fetch images using our custom hook with pagination
    const { fetchData, loading, pageLoading } = useFetchImages(setPhoto);
  
    useEffect(() => {
      fetchData(filter, sortBy, sortOrder, ITEMS_PER_PAGE, currentPage);
    }, [fetchData, filter, sortBy, sortOrder, currentPage]);
  
    // Client-side filtering (if needed).
    const filteredPhotos = useMemo(() => {
      if (!photo) return [];
      
      // First filter by search term if provided
      let filtered = !filter.trim() 
        ? photo 
        : photo.filter((item) => item.Name.toLowerCase().includes(filter.trim().toLowerCase()));
      
      // Then filter by tag if selected
      if (selectedTag) {
        filtered = filtered.filter(item => 
          item.tags && item.tags.some(tag => tag.toLowerCase() === selectedTag.toLowerCase())
        );
      }
      
      // Apply limit if provided
      if (limit && filtered.length > limit) {
        filtered = filtered.slice(0, limit);
      }
      
      return filtered;
    }, [photo, filter, selectedTag, limit]);
  
    // Convert Buffer image data to base64.
    const getImageSrc = (item: ImageType): string => {
      // If we have image data and it's in Buffer format, convert to base64
      if (item.ImageData) {
        try {
          let base64String = '';
          if ((item.ImageData as { data: number[] }).data) {
            base64String = Buffer.from(
              (item.ImageData as { data: number[] }).data
            ).toString('base64');
            return `data:${item.ContentType};base64,${base64String}`;
          } else if (typeof item.ImageData === 'string' && item.ImageData.includes('base64')) {
            return item.ImageData;
          }
        } catch (error) {
          console.error('Error converting image:', error);
        }
      }
      
      // Fall back to using the URL endpoint
      return `/img/${item._id}`;
    };
  
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
  
    
    // Open enlarged modal when image is clicked.
    const handleImageClick = useCallback((src: string) => {
      setEnlargedImageSrc(src);
    }, []);
  
    const handlePageChange = (newPage: number) => {
      setCurrentPage(newPage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };
  
    // Pagination UI component
    const PaginationControls = () => (
      <div className="mt-8 flex justify-center items-center gap-4">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1 || loading}
          className="px-4 py-2 rounded-lg bg-indigo-500 text-white disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-indigo-600 transition-colors flex items-center gap-2"
        >
          <FaChevronLeft size={14} />
          Previous
        </button>
        <span className="text-gray-600">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages || loading}
          className="px-4 py-2 rounded-lg bg-indigo-500 text-white disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-indigo-600 transition-colors flex items-center gap-2"
        >
          Next
          <FaChevronRight size={14} />
        </button>
      </div>
    );
  
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
            
            {/* Pagination Controls */}
            <PaginationControls />
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
  