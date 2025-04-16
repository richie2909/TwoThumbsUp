import React, { useState } from 'react';
import { FaCompress, FaDownload, FaTrash, FaFilter, FaSearch, FaTags } from 'react-icons/fa';

const AdminTools: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'optimize' | 'batch'>('optimize');
  const [compressionLevel, setCompressionLevel] = useState<number>(75);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [selectedFormat, setSelectedFormat] = useState<string>('jpeg');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  
  const TAGS = ['Motivational', 'Inspirational', 'Wisdom', 'Love', 'Success', 'Happiness', 'Life'];

  const handleOptimizeImages = async () => {
    setIsProcessing(true);
    try {
      // This would be an API call in a real application
      console.log(`Optimizing images with level: ${compressionLevel}, format: ${selectedFormat}`);
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate processing time
      alert('Images optimized successfully!');
    } catch (error) {
      console.error('Error optimizing images:', error);
      alert('Failed to optimize images. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleBatchDelete = async () => {
    if (!window.confirm('Are you sure you want to delete the selected images?')) {
      return;
    }

    setIsProcessing(true);
    try {
      // This would be an API call in a real application
      console.log(`Batch deleting images with search: ${searchTerm}, tags: ${selectedTags.join(',')}`);
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate processing time
      alert('Selected images deleted successfully!');
    } catch (error) {
      console.error('Error deleting images:', error);
      alert('Failed to delete images. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleBatchDownload = async () => {
    setIsProcessing(true);
    try {
      // This would be an API call in a real application
      console.log(`Batch downloading images with search: ${searchTerm}, tags: ${selectedTags.join(',')}`);
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate processing time
      alert('Images are being downloaded. Check your downloads folder.');
    } catch (error) {
      console.error('Error downloading images:', error);
      alert('Failed to download images. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Admin Tools</h2>
      
      {/* Tab Navigation */}
      <div className="flex space-x-2 mb-6 border-b pb-2">
        <button 
          onClick={() => setActiveTab('optimize')}
          className={`px-4 py-2 rounded transition-colors ${
            activeTab === 'optimize' 
              ? 'bg-indigo-500 text-white' 
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Image Optimization
        </button>
        <button 
          onClick={() => setActiveTab('batch')}
          className={`px-4 py-2 rounded transition-colors ${
            activeTab === 'batch' 
              ? 'bg-indigo-500 text-white' 
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Batch Operations
        </button>
      </div>
      
      {/* Tab Content */}
      {activeTab === 'optimize' ? (
        <div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Compression Level: {compressionLevel}%
            </label>
            <input
              type="range"
              min="0"
              max="100"
              value={compressionLevel}
              onChange={(e) => setCompressionLevel(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>Maximum Quality</span>
              <span>Balanced</span>
              <span>Maximum Compression</span>
            </div>
          </div>
          
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Output Format
            </label>
            <select
              value={selectedFormat}
              onChange={(e) => setSelectedFormat(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="jpeg">JPEG (.jpg)</option>
              <option value="png">PNG (.png)</option>
              <option value="webp">WebP (.webp)</option>
              <option value="avif">AVIF (.avif)</option>
            </select>
          </div>
          
          <button
            onClick={handleOptimizeImages}
            disabled={isProcessing}
            className="w-full py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition flex items-center justify-center disabled:bg-gray-400"
          >
            {isProcessing ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
                Processing...
              </>
            ) : (
              <>
                <FaCompress className="mr-2" /> Optimize All Images
              </>
            )}
          </button>
        </div>
      ) : (
        <div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Search by Name
            </label>
            <div className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Enter image name..."
                className="w-full p-2 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
          </div>
          
          <div className="mb-6">
            <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
              <FaTags className="mr-1" /> Filter by Tags
            </label>
            <div className="flex flex-wrap gap-2 mt-2">
              {TAGS.map(tag => (
                <button
                  key={tag}
                  onClick={() => toggleTag(tag)}
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    selectedTags.includes(tag)
                      ? 'bg-indigo-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-2">
            <button
              onClick={handleBatchDownload}
              disabled={isProcessing}
              className="flex-1 py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition flex items-center justify-center disabled:bg-gray-400"
            >
              <FaDownload className="mr-2" /> Download
            </button>
            
            <button
              onClick={handleBatchDelete}
              disabled={isProcessing}
              className="flex-1 py-2 px-4 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition flex items-center justify-center disabled:bg-gray-400"
            >
              <FaTrash className="mr-2" /> Delete
            </button>
          </div>
          
          {isProcessing && (
            <div className="mt-4 text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-indigo-500 border-t-transparent"></div>
              <p className="mt-2 text-gray-600">Processing your request...</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminTools; 