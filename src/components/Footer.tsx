import React from 'react';
import logo from "../assets/logo.jpg";
import { Link } from 'react-router-dom';
import { FaFacebook, FaTwitter, FaInstagram } from 'react-icons/fa';

// Common categories matching the uploaded quotes tags
const CATEGORIES = ['Inspirational', 'Motivational', 'Wisdom', 'Love', 'Success', 'Happiness', 'Life'];

const Footer: React.FC = () => {
  const [currentYear, setCurrentYear] = React.useState<number>(0);

  React.useEffect(() => {
    setCurrentYear(new Date().getFullYear());
  }, []);

  return (
    <footer className="bg-gray-800 text-white pt-12 mt-auto">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Company Info */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2">
              <img
                src={logo}
                alt="Company Logo"
                className="w-10 h-10 rounded-full"
              />
              <span className="text-xl font-bold">TwoThumbsUp</span>
            </Link>
            <p className="text-gray-400 text-sm">
              Sharing wisdom and inspiration through our curated collection of quote images to uplift and motivate.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <nav>
              <ul className="space-y-2">
                <li>
                  <Link
                    to="/"
                    className="text-gray-400 hover:text-blue-400 transition-colors"
                  >
                    Home
                  </Link>
                </li>
                <li>
                  <Link
                    to="/about"
                    className="text-gray-400 hover:text-blue-400 transition-colors"
                  >
                    About
                  </Link>
                </li>
                <li>
                  <Link
                    to="/search"
                    className="text-gray-400 hover:text-blue-400 transition-colors"
                  >
                    Search Quotes
                  </Link>
                </li>
              </ul>
            </nav>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Categories</h3>
            <nav>
              <ul className="space-y-2">
                {CATEGORIES.map(category => (
                  <li key={category}>
                    <Link 
                      to={`/search?tag=${category.toLowerCase()}`} 
                      className="text-gray-400 hover:text-blue-400 transition-colors"
                    >
                      {category}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          {/* Social Media */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Connect With Us</h3>
            <div className="flex space-x-4">
              <a
                href="#"
                className="text-gray-400 hover:text-blue-400 transition-colors"
                aria-label="Facebook"
              >
                <FaFacebook size={24} />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-blue-400 transition-colors"
                aria-label="Twitter"
              >
                <FaTwitter size={24} />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-blue-400 transition-colors"
                aria-label="Instagram"
              >
                <FaInstagram size={24} />
              </a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-700 py-6 mt-8">
          <p className="text-center text-gray-400 text-sm">
            © {currentYear} TwoThumbsUp. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;