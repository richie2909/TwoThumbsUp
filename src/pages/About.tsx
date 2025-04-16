import { useState, useEffect } from 'react';
import { FaCircleNotch, FaQuoteLeft, FaLightbulb, FaUsers } from 'react-icons/fa';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';

const About = () => {
  const [isLoading, setIsLoading] = useState(true);

  // Simulate content loading
  useEffect(() => {
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
      {/* Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <FaCircleNotch className="animate-spin text-4xl text-white" />
        </div>
      )}
      
      <Navigation />
      
      <main className="container mx-auto px-4 md:px-6 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">About Two Thumbs Up</h1>
          
          <div className="bg-white rounded-xl shadow-md p-6 md:p-8 mb-8">
            <div className="grid md:grid-cols-2 gap-8">
              {/* Image Section */}
              <div className="relative h-64 md:h-auto">
                <img 
                  src="https://images.unsplash.com/photo-1455390582262-044cdead277a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80" 
                  alt="Books and quotes"
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>
              
              {/* Content Section */}
              <div className="space-y-4">
                <h2 className="text-2xl font-semibold text-gray-800">
                  Our Story
                </h2>
                <p className="text-gray-600 leading-relaxed">
                  Two Thumbs Up was created with a simple mission: to collect and share inspiring 
                  quotes through beautiful imagery. We believe that the right words at the right time can 
                  change perspectives, lift spirits, and inspire action.
                </p>
                <p className="text-gray-600 leading-relaxed">
                  Our team of administrators carefully curates quote images from diverse sources,
                  each named and categorized for easy browsing. We're dedicated to providing a platform 
                  where you can discover, save, and share quote images that resonate with you.
                </p>
              </div>
            </div>
          </div>

          {/* Values Section */}
          <div className="bg-white rounded-xl shadow-md p-6 md:p-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">
              Our Values
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-indigo-50 p-6 rounded-lg text-center">
                <div className="flex justify-center mb-4">
                  <FaQuoteLeft className="text-3xl text-indigo-600" />
                </div>
                <h3 className="text-lg font-semibold text-indigo-600 mb-2">
                  Visual Wisdom
                </h3>
                <p className="text-gray-600">
                  We believe in the power of combining powerful words with compelling visuals.
                </p>
              </div>
              <div className="bg-purple-50 p-6 rounded-lg text-center">
                <div className="flex justify-center mb-4">
                  <FaLightbulb className="text-3xl text-purple-600" />
                </div>
                <h3 className="text-lg font-semibold text-purple-600 mb-2">
                  Inspiration
                </h3>
                <p className="text-gray-600">
                  Our collection aims to spark creativity, motivation, and positive change.
                </p>
              </div>
              <div className="bg-blue-50 p-6 rounded-lg text-center">
                <div className="flex justify-center mb-4">
                  <FaUsers className="text-3xl text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-blue-600 mb-2">
                  Community
                </h3>
                <p className="text-gray-600">
                  We're building a community of people who appreciate the transformative power of visual quotes.
                </p>
              </div>
            </div>
            
            {/* How It Works Section */}
            <div className="mt-8 pt-8 border-t border-gray-200">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                How It Works
              </h2>
              <ol className="space-y-4">
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-medium">1</span>
                  <div>
                    <h3 className="font-medium text-gray-800">Browse our collection</h3>
                    <p className="text-gray-600">Explore quote images by name, or use our search function to find specific quotes.</p>
                  </div>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-medium">2</span>
                  <div>
                    <h3 className="font-medium text-gray-800">View and appreciate</h3>
                    <p className="text-gray-600">Click on any quote image to view it in full size and appreciate the details.</p>
                  </div>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-medium">3</span>
                  <div>
                    <h3 className="font-medium text-gray-800">Share with others</h3>
                    <p className="text-gray-600">Share inspirational quotes with friends or on social media directly from our platform.</p>
                  </div>
                </li>
              </ol>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default About;