import React, {
  useState,
  useEffect,
  useContext,
  useCallback,
  useMemo,
} from 'react';
import { ImageContext, ImageType } from '../Context/context';
import { Dispatch, SetStateAction } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaCircleNotch } from 'react-icons/fa';
import { useAuth } from '../Context/AuthContext';

interface EditModalProps {
  imageId: string;
  onClose: () => void; // The modal should be the same size as the edit modal or slightly larger to accommodate the photo.
  setPhoto: Dispatch<SetStateAction<ImageType[] | null>>;
}

const EditModal: React.FC<EditModalProps> = ({ imageId, onClose, setPhoto }) => {
  const [name, setName] = useState<string>('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { photo } = useContext(ImageContext);
  const [localLoading, setLocalLoading] = useState(false);
  const { isAuthenticated, user } = useAuth();

  // Initialize name from the current photo data.
  useEffect(() => {
    if (photo) {
      const selectedImage = photo.find((item) => item._id === imageId);
      if (selectedImage) {
        setName(selectedImage.Name);
      }
    }
  }, [imageId, photo]);

  // Callback for file input change.
  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setImageFile(e.target.files[0]);
    } else {
      setImageFile(null);
    }
  }, []);

  // Callback to re-fetch image data after updating.
  const refetchData = useCallback(async () => {
    try {
      const response = await fetch('/img', { credentials: 'include' });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const json = await response.json();
      if (json && json.img) {
        setPhoto(json.img);
      } else {
        console.error('Error: JSON data is invalid or missing img property.');
      }
    } catch (error) {
      console.error('Error refetching data:', error);
      setErrorMessage('Failed to refresh image data.');
    }
  }, [setPhoto]);

  // Callback for form submission.
  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMessage(null);
    setErrorMessage(null);
    setLocalLoading(true);

    const formData = new FormData();
    formData.append('name', name);
    if (imageFile) {
      formData.append('image', imageFile);
    }

    try {
      const response = await fetch(`/img/${imageId}`, {
        method: 'PATCH',
        credentials: 'include',
        body: formData,
      });

      if (response.ok) {
        setSuccessMessage('Image updated successfully!');
        await refetchData();
        onClose();
      } else {
        let errorData: any = {};
        try {
          const contentType = response.headers.get('content-type');
          if (contentType && contentType.includes('application/json')) {
            errorData = await response.json();
          } else {
            const errorText = await response.text();
            errorData.message = errorText;
          }
        } catch (jsonError) {
          console.error('Failed to parse error response:', jsonError);
        }
        setErrorMessage(errorData.message || 'Failed to update image.');
      }
    } catch (error) {
      console.error('Error updating image:', error);
      setErrorMessage('An error occurred during update.');
    } finally {
      setLocalLoading(false);
    }
  }, [name, imageFile, imageId, refetchData, onClose]);

  // Memoized modal output to avoid unnecessary re-renders.
  const memoizedModal = useMemo(() => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 bg-gray-100/40 backdrop-blur-md overflow-y-auto h-screen w-full flex items-center justify-center"
    >
      {/* Using max-w-md to keep modal size consistent */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.3 }}
        className="relative p-8 bg-white rounded-xl shadow-2xl w-full max-w-md"
      >
        <h3 className="text-2xl font-bold mb-6 text-gray-800 text-center">Edit Image</h3>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block mb-2 text-gray-700 font-medium">Name:</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none transition"
            />
          </div>
          <div>
            <label className="block mb-2 text-gray-700 font-medium">Image:</label>
            {/* Custom Upload Button */}
            <label
              htmlFor="file-upload"
              className="flex items-center gap-3 uppercase text-xs font-bold text-white bg-[#488aec] py-3 px-6 rounded-lg select-none transition-all duration-600 ease shadow-[0_4px_6px_-1px_#488aec31,0_2px_4px_-1px_#488aec17] hover:shadow-[0_10px_15px_-3px_#488aec4f,0_4px_6px_-2px_#488aec17] focus:opacity-[0.85] active:opacity-[0.85] focus:shadow-none active:shadow-none cursor-pointer"
            >
              <svg
                aria-hidden="true"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5"
              >
                <path
                  strokeWidth="2"
                  stroke="#ffffff"
                  d="M13.5 3H12H8C6.34315 3 5 4.34315 5 6V18C5 19.6569 6.34315 21 8 21H11M13.5 3L19 8.625M13.5 3V7.625C13.5 8.17728 13.9477 8.625 14.5 8.625H19M19 8.625V11.8125"
                  strokeLinejoin="round"
                  strokeLinecap="round"
                />
                <path
                  strokeLinejoin="round"
                  strokeLinecap="round"
                  strokeWidth="2"
                  stroke="#ffffff"
                  d="M17 15V18M17 21V18M17 18H14M17 18H20"
                />
              </svg>
              ADD FILE
            </label>
            <input
              id="file-upload"
              type="file"
              className="hidden"
              onChange={handleFileChange}
            />
          </div>
          {errorMessage && (
            <p className="text-red-500 text-sm text-center p-3 bg-red-50 rounded-lg">
              {errorMessage}
            </p>
          )}
          {successMessage && (
            <p className="text-green-500 text-sm text-center p-3 bg-green-50 rounded-lg">
              {successMessage}
            </p>
          )}
          <div className="flex justify-center mt-6">
            <button
              type="submit"
              className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition font-medium flex items-center disabled:bg-gray-400"
              disabled={localLoading}
            >
              {localLoading ? (
                <>
                  <FaCircleNotch className="animate-spin mr-2" />
                  Updating...
                </>
              ) : (
                'Update'
              )}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="ml-4 px-6 py-3 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition font-medium"
            >
              Cancel
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  ), [handleSubmit, localLoading, name, errorMessage, successMessage, onClose, handleFileChange]);

  if (!isAuthenticated || user?.role !== 'admin') {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-gray-200 bg-opacity-70 backdrop-blur-sm">
        <div className="bg-white p-6 rounded-md shadow-lg">
          <p className="text-red-500 font-bold">Unauthorized access.</p>
          <button
            onClick={onClose}
            className="mt-4 bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <AnimatePresence>
      {memoizedModal}
    </AnimatePresence>
  );
};

export default React.memo(EditModal);
