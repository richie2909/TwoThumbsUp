import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../components/Card';
import UploadForm from './Upload';
import TrafficChart from '../pages/TrafficChart';
import { useAuth } from '../Context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { FaImage, FaTag, FaHeart, FaUser } from 'react-icons/fa';

const Admin: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [photoStats, setPhotoStats] = useState({
    total: 0,
    totalLikes: 0,
    totalTags: 0
  });
  const [activeTab, setActiveTab] = useState('dashboard');

  useEffect(() => {
    const handleOffline = () => {
      navigate('/');
    };
    window.addEventListener('offline', handleOffline);
    return () => window.removeEventListener('offline', handleOffline);
  }, [navigate]);

  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('New image added!');

  const triggerAlert = useCallback((message = 'New image added!') => {
    setAlertMessage(message);
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

  // Fetch photo stats
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/img?stats=true', {
          credentials: 'include'
        });
        
        if (response.ok) {
          const stats = await response.json();
          setPhotoStats({
            total: stats.totalImages || 0,
            totalLikes: stats.totalLikes || 0,
            totalTags: stats.uniqueTags?.length || 0
          });
        }
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      }
    };
    
    fetchStats();
  }, [photoCount]);

  const renderTabContent = () => {
    switch (activeTab) {
      case 'upload':
        return (
          <div className="bg-white p-6 rounded-xl shadow-md">
            <UploadForm />
          </div>
        );
      case 'manage':
        return (
          <div className="bg-white p-6 rounded-xl shadow-md">
            <Card onPhotoCountChange={setPhotoCount} />
          </div>
        );
      case 'analytics':
        return (
          <div className="bg-white p-6 rounded-xl shadow-md">
            <TrafficChart />
          </div>
        );
      default: // dashboard
        return (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white p-6 rounded-xl shadow-md flex items-center">
                <div className="bg-indigo-100 p-3 rounded-full mr-4">
                  <FaImage className="text-indigo-500 text-xl" />
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Total Images</p>
                  <p className="text-2xl font-bold">{photoStats.total}</p>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-md flex items-center">
                <div className="bg-pink-100 p-3 rounded-full mr-4">
                  <FaHeart className="text-pink-500 text-xl" />
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Total Likes</p>
                  <p className="text-2xl font-bold">{photoStats.totalLikes}</p>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-md flex items-center">
                <div className="bg-blue-100 p-3 rounded-full mr-4">
                  <FaTag className="text-blue-500 text-xl" />
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Total Tags</p>
                  <p className="text-2xl font-bold">{photoStats.totalTags}</p>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-md flex items-center">
                <div className="bg-green-100 p-3 rounded-full mr-4">
                  <FaUser className="text-green-500 text-xl" />
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Admin</p>
                  <p className="text-lg font-bold truncate max-w-[150px]">{user?.username}</p>
                </div>
              </div>
            </div>
            
            {/* Charts & Upload */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <div className="bg-white p-6 rounded-xl shadow-md">
                <h3 className="text-lg font-semibold mb-4 text-gray-800">Traffic Overview</h3>
                <TrafficChart />
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-md">
                <h3 className="text-lg font-semibold mb-4 text-gray-800">Quick Upload</h3>
                <UploadForm />
              </div>
            </div>
            
            {/* Recent Images */}
            <div className="bg-white p-6 rounded-xl shadow-md">
              <h3 className="text-lg font-semibold mb-4 text-gray-800">Recent Images</h3>
              <Card limit={6} onPhotoCountChange={setPhotoCount} />
            </div>
          </>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 relative">
      <AnimatePresence>
        {showAlert && (
          <motion.div
            className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 bg-blue-500 text-white px-6 py-3 rounded shadow-lg"
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1, transition: { duration: 0.5, ease: 'easeOut' } }}
            exit={{ y: -100, opacity: 0, transition: { duration: 0.3, ease: 'easeIn' } }}
          >
            {alertMessage}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <button
              onClick={() => navigate('/')}
              className="text-blue-500 hover:text-blue-600 font-medium"
            >
              &larr; Back to Site
            </button>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mt-2">
              Admin Dashboard
            </h2>
          </div>
          
          <div className="bg-white shadow-md rounded-lg p-2">
            <span className="text-sm text-gray-500 mr-2">Logged in as:</span>
            <span className="text-sm font-medium text-indigo-600">{user?.username}</span>
          </div>
        </div>
        
        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-md p-3 mb-6 flex flex-wrap space-x-2">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === 'dashboard' 
                ? 'bg-indigo-500 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Dashboard
          </button>
          <button
            onClick={() => setActiveTab('upload')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === 'upload' 
                ? 'bg-indigo-500 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Upload Image
          </button>
          <button
            onClick={() => setActiveTab('manage')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === 'manage' 
                ? 'bg-indigo-500 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Manage Images
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === 'analytics' 
                ? 'bg-indigo-500 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Analytics
          </button>
        </div>
        
        {/* Tab Content */}
        <div className="mb-8">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
};

export default Admin;