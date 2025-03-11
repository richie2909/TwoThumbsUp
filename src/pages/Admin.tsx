import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../components/Card';
import UploadForm from './Upload';
import TrafficChart from '../pages/TrafficChart';
import { useAuth } from '../Context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

const Admin: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    const handleOffline = () => {
      navigate('/');
    };
    window.addEventListener('offline', handleOffline);
    return () => window.removeEventListener('offline', handleOffline);
  }, [navigate]);

  const [showAlert, setShowAlert] = useState(false);

  const triggerAlert = useCallback(() => {
    setShowAlert(true);
    setTimeout(() => {
      setShowAlert(false);
    }, 2000);
  }, []);

  const [photoCount, setPhotoCount] = useState<number>(0);
  const prevPhotoCountRef = useRef<number>(photoCount);

  useEffect(() => {
    if (photoCount > prevPhotoCountRef.current) {
      triggerAlert();
    }
    prevPhotoCountRef.current = photoCount;
  }, [photoCount, triggerAlert]);

  return (
    <div className="min-h-screen bg-gray-50 p-4 relative">
      <AnimatePresence>
        {showAlert && (
          <motion.div
            className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 bg-blue-500 text-white px-6 py-3 rounded shadow-lg"
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1, transition: { duration: 1.5, ease: 'easeInOut' } }}
            exit={{ y: -100, opacity: 0, transition: { duration: 1, ease: 'easeInOut' } }}
          >
            New image added!
          </motion.div>
        )}
      </AnimatePresence>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8"> {/* Added padding for small and larger screens */}
        <div className="mb-4">
          <button
            onClick={() => navigate('/')}
            className="text-blue-500 hover:text-blue-600 font-medium"
          >
            &larr; Back
          </button>
        </div>
        <p className="text-xl text-gray-700 text-center mb-2">Welcome, {user?.username}</p>
        <h2 className="text-3xl font-bold mb-6 text-gray-800 text-center">
          Admin Dashboard
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-4 rounded-md shadow-sm">
            <UploadForm bg-white p-4 md:p-6 lg:p-8 rounded-md shadow-sm max-w-md mx-auto />
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <TrafficChart />
          </div>
        </div>
        <div className="mt-8">
          <Card onPhotoCountChange={setPhotoCount} />
        </div>
      </div>
    </div>
  );
};

export default Admin;