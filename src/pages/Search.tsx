import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import Card from '../components/Card';
import { FaCircleNotch, FaFilter } from 'react-icons/fa';


const Search = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const query = searchParams.get('query') || '';
  const tag = searchParams.get('tag') || '';
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    // Simulate API loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-purple-50">
        <FaCircleNotch className="animate-spin text-4xl text-indigo-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50">
      <Navigation />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">Search Results</h1>
          
          {/* Filters Section */}
          <div className="bg-white p-6 rounded-3xl shadow-md mb-8">
            {/* Filters Toggle */}
            <div className="flex justify-between items-center">
              <button 
                onClick={() => setShowFilters(!showFilters)} 
                className="flex items-center text-indigo-600 font-medium gap-2"
              >
                <FaFilter /> {showFilters ? 'Hide Sorting' : 'Show Sorting'}
              </button>
            </div>
            
            {/* Sorting Options */}
            {showFilters && (
              <div className="mt-4 pt-4 border-t border-gray-100">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Sort By
                  </label>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => {
                        setSortBy('name');
                        setSortOrder('asc');
                      }}
                      className={`px-4 py-2 rounded-full text-sm font-medium ${
                        sortBy === 'name' && sortOrder === 'asc'
                          ? 'bg-indigo-600 text-white' 
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      Name (A-Z)
                    </button>
                    <button
                      onClick={() => {
                        setSortBy('name');
                        setSortOrder('desc');
                      }}
                      className={`px-4 py-2 rounded-full text-sm font-medium ${
                        sortBy === 'name' && sortOrder === 'desc'
                          ? 'bg-indigo-600 text-white' 
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      Name (Z-A)
                    </button>
                    <button
                      onClick={() => {
                        setSortBy('createdAt');
                        setSortOrder('desc');
                      }}
                      className={`px-4 py-2 rounded-full text-sm font-medium ${
                        sortBy === 'createdAt' && sortOrder === 'desc'
                          ? 'bg-indigo-600 text-white' 
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      Newest
                    </button>
                    <button
                      onClick={() => {
                        setSortBy('createdAt');
                        setSortOrder('asc');
                      }}
                      className={`px-4 py-2 rounded-full text-sm font-medium ${
                        sortBy === 'createdAt' && sortOrder === 'asc'
                          ? 'bg-indigo-600 text-white' 
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      Oldest
                    </button>
                    <button
                      onClick={() => {
                        setSortBy('likes');
                        setSortOrder('desc');
                      }}
                      className={`px-4 py-2 rounded-full text-sm font-medium ${
                        sortBy === 'likes' && sortOrder === 'desc'
                          ? 'bg-indigo-600 text-white' 
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      Most Liked
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {/* Results */}
          <div className="bg-white p-6 rounded-3xl shadow-md">
            <h3 className="text-xl md:text-2xl font-semibold text-gray-800 border-b border-gray-200 pb-4 mb-6">
              {query 
                ? `Search Results for "${query}"` 
                : tag
                  ? `Quotes Tagged with "${tag}"`
                  : 'All Quotes'
              }
            </h3>
            <Card 
              filter={query} 
              sortBy={sortBy} 
              sortOrder={sortOrder} 
              selectedTag={tag}
            />
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Search;
