import React, { useState, useEffect } from 'react';
import Navigation from '../components/Navigation';
import Card from '../components/Card';
import CookieConsent from '../components/Cookie';
import Footer from '../components/Footer';
import { FaCircleNotch } from 'react-icons/fa';

const Home = () => {
  const [isLoading, setIsLoading] = useState(true);

  // Simulate loading delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500); // 1.5 second loading simulation

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
        <FaCircleNotch className="animate-spin text-4xl text-blue-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200">
      <Navigation />
      
      {/* Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <FaCircleNotch className="animate-spin text-4xl text-white" />
        </div>
      )}

      <CookieConsent />

      <div className="container mx-auto px-4 py-8">
        {/* Existing content */}
        <div className="mb-8">
          <div className="p-6 bg-white rounded-3xl shadow-md flex items-center justify-center">
            <div className="w-full text-center">
              <main>
                <h2 className="text-3xl md:text-4xl font-semibold text-gray-800 mb-4">
                  Inspiring Quote and Hopeful Prayer
                </h2>
              </main>
              <footer className="mt-5">
                <p className="text-lg text-gray-600 leading-relaxed">
                  Lorem ipsum, dolor sit amet consectetur adipisicing elit...
                </p>
              </footer>
            </div>
          </div>
        </div>

        <div className="mb-8 p-6 bg-white rounded-3xl shadow-md">
          <h3 className="text-xl md:text-2xl font-semibold text-gray-800 border-b border-gray-200 pb-4 mb-6">
            Quote
          </h3>
          <div className="h-90 overflow-y-auto text-gray-700 leading-relaxed">
            <Card />
          </div>
        </div>

        <div className="mt-8">
          {/* Add any other content here */}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Home;