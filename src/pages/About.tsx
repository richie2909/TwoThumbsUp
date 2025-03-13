import { useState, useEffect } from 'react';
import { FaCircleNotch } from 'react-icons/fa';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';

const About = () => {
  const [isLoading, setIsLoading] = useState(true);

  // Simulate content loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <FaCircleNotch className="animate-spin text-4xl text-blue-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <FaCircleNotch className="animate-spin text-4xl text-white" />
        </div>
      )}
      
      <Navigation />
      
      <main className="container mx-auto px-4 md:px-6 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">About Us</h1>
          
          <div className="bg-white rounded-xl shadow-md p-6 md:p-8">
            <div className="grid md:grid-cols-2 gap-8">
              {/* Image Section */}
              <div className="relative h-64 md:h-auto">
                <img 
                  src="https://source.unsplash.com/random/800x600" 
                  alt="About us"
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>
              
              {/* Content Section */}
              <div className="space-y-4">
                <h2 className="text-2xl font-semibold text-gray-800">
                  Who We Are
                </h2>
                <p className="text-gray-600 leading-relaxed">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod 
                  tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, 
                  quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                </p>
                <p className="text-gray-600 leading-relaxed">
                  Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore 
                  eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt 
                  in culpa qui officia deserunt mollit anim id est laborum.
                </p>
              </div>
            </div>

            {/* Additional Content Section */}
            <div className="mt-8 pt-8 border-t border-gray-200">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                Our Mission
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-blue-50 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold text-blue-600 mb-2">
                    Innovation
                  </h3>
                  <p className="text-gray-600">
                    We strive to push boundaries and deliver cutting-edge solutions.
                  </p>
                </div>
                <div className="bg-green-50 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold text-green-600 mb-2">
                    Sustainability
                  </h3>
                  <p className="text-gray-600">
                    Committed to eco-friendly practices and sustainable growth.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>

  );
};

export default About;