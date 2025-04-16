import { useState, useEffect } from 'react';
import Navigation from '../components/Navigation';
import Card from '../components/Card';
import CookieConsent from '../components/Cookie';
import Footer from '../components/Footer';
import PopularImages from '../components/PopularImages';
import { FaCircleNotch } from 'react-icons/fa';

// Interface for the Image/Quote data
interface QuoteImage {
  _id: string;
  Name: string;
  ImageData: Buffer | { data: number[] };
  ContentType: string;
  createdAt: string;
}

const Home = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [filter] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [featuredQuote, setFeaturedQuote] = useState<QuoteImage | null>(null);
  const [featuredQuoteImage, setFeaturedQuoteImage] = useState<string>('');

  // Fetch the newest quote for the Featured Quote section
  const fetchNewestQuote = async () => {
    try {
      const response = await fetch('/img?sort=createdAt&order=desc&limit=1');
      if (response.ok) {
        const data = await response.json();
        if (data.length > 0) {
          setFeaturedQuote(data[0]);
          // Convert image data to base64 for display
          let base64String = '';
          if (data[0].ImageData) {
            if ((data[0].ImageData as { data: number[] }).data) {
              base64String = Buffer.from(
                (data[0].ImageData as { data: number[] }).data
              ).toString('base64');
            } else {
              base64String = Buffer.from(data[0].ImageData as any).toString('base64');
            }
            setFeaturedQuoteImage(`data:${data[0].ContentType};base64,${base64String}`);
          }
        }
      }
    } catch (error) {
      console.error('Error fetching newest quote:', error);
    }
  };

  // Simulate loading delay and fetch newest quote
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800); // Reduced loading time for better UX

    fetchNewestQuote();

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

      <CookieConsent />

      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="mb-8">
          <div className="p-8 bg-white rounded-3xl shadow-md flex items-center justify-center">
            <div className="w-full text-center">
              <main>
                <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
                  Discover Inspiring Quotes
                </h1>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                  Find wisdom, motivation and inspiration through our collection of quote images.
                  Browse by category or search for your favorites.
                </p>
              </main>
            </div>
          </div>
        </div>

        {/* Featured Quote - Always shows the newest quote */}
        {featuredQuote && (
          <div className="mb-8 bg-white rounded-3xl shadow-md p-6">
            <h3 className="text-xl md:text-2xl font-semibold text-gray-800 mb-4">
              Featured Quote
            </h3>
            <div className="p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl">
              <div className="flex flex-col md:flex-row gap-6 items-center">
                {featuredQuoteImage && (
                  <div className="w-full md:w-1/2 rounded-lg overflow-hidden border border-gray-200">
                    <img 
                      src={featuredQuoteImage} 
                      alt={featuredQuote.Name} 
                      className="w-full h-auto object-contain"
                    />
                  </div>
                )}
                <div className="w-full md:w-1/2">
                  <h4 className="text-xl font-semibold text-gray-800 mb-2">{featuredQuote.Name}</h4>
                  <p className="text-gray-600">
                    Our newest quote, fresh from our collection. This inspiring message was added on {new Date(featuredQuote.createdAt).toLocaleDateString()}.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Main Content Area with Sidebar */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Content */}
          <div className="lg:w-3/4">
            {/* Sort Options */}
            <div className="mb-6 flex flex-wrap gap-4 items-center bg-white p-4 rounded-xl shadow-sm">
              <div className="font-medium text-gray-700">Sort by:</div>
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

            {/* Quotes Section */}
            <div className="mb-8 p-6 bg-white rounded-3xl shadow-md">
              <h3 className="text-xl md:text-2xl font-semibold text-gray-800 border-b border-gray-200 pb-4 mb-6">
                {filter ? `Search Results for "${filter}"` : 'All Quotes'}
              </h3>
              
              {/* Quote Cards - Using Original Card Component */}
              <Card filter={filter} sortBy={sortBy} sortOrder={sortOrder} />
            </div>
          </div>
          
          {/* Sidebar */}
          <div className="lg:w-1/4 space-y-6">
            {/* Popular Images */}
            <PopularImages limit={5} />
            
            {/* You might add other sidebar widgets here */}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Home;