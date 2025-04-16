import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import Card from '../components/Card';
import { FaCircleNotch, FaFilter } from 'react-icons/fa';

// Sample quotes data - this would typically come from an API
const allQuotes = [
  {
    id: 1,
    text: "The greatest glory in living lies not in never falling, but in rising every time we fall.",
    author: "Nelson Mandela",
    category: "inspiration"
  },
  {
    id: 2,
    text: "The way to get started is to quit talking and begin doing.",
    author: "Walt Disney",
    category: "motivation"
  },
  {
    id: 3,
    text: "Life is what happens when you're busy making other plans.",
    author: "John Lennon",
    category: "life"
  },
  {
    id: 4,
    text: "Spread love everywhere you go. Let no one ever come to you without leaving happier.",
    author: "Mother Teresa",
    category: "love"
  },
  {
    id: 5,
    text: "When you reach the end of your rope, tie a knot in it and hang on.",
    author: "Franklin D. Roosevelt",
    category: "perseverance"
  },
  {
    id: 6,
    text: "Always remember that you are absolutely unique. Just like everyone else.",
    author: "Margaret Mead",
    category: "humor"
  },
  {
    id: 7,
    text: "Don't judge each day by the harvest you reap but by the seeds that you plant.",
    author: "Robert Louis Stevenson",
    category: "wisdom"
  },
  {
    id: 8,
    text: "The future belongs to those who believe in the beauty of their dreams.",
    author: "Eleanor Roosevelt",
    category: "dreams"
  },
  {
    id: 9,
    text: "Tell me and I forget. Teach me and I remember. Involve me and I learn.",
    author: "Benjamin Franklin",
    category: "education"
  },
  {
    id: 10,
    text: "The best and most beautiful things in the world cannot be seen or even touched — they must be felt with the heart.",
    author: "Helen Keller",
    category: "beauty"
  }
];

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
