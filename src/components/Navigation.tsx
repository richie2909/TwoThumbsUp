import React, { useState, useCallback, FormEvent, useMemo } from 'react';
import logo from '../assets/logo.jpg';
import { Link, useNavigate } from 'react-router-dom';
import { CiMenuBurger } from 'react-icons/ci';
import { HiSearch } from 'react-icons/hi';
import { useAuth } from '../Context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

interface Credentials {
  username: string;
  password: string;
}

const Navigation: React.FC = () => {
  const { isAuthenticated, user, logout, login } = useAuth();
  const navigate = useNavigate();

  // Auth-related state
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [credentials, setCredentials] = useState<Credentials>({ username: '', password: '' });
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Navigation and search states
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Login submission handler
  const handleLoginSubmit = useCallback(async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      const response = await fetch('/img/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
        credentials: 'include',
      });
      if (!response.ok) {
        const data = await response.json();
        const errorMessage = data.error || data.message || 'Login failed';
        throw new Error(errorMessage);
      }
      const data = await response.json();
      if (!data.user) {
        console.error('Backend did not send user data', data);
        throw new Error('Login failed, user data missing');
      }
      login({ username: data.user.username, role: data.user.role, id: data.user.id });
      setShowLoginForm(false);
      setCredentials({ username: '', password: '' });
    } catch (error) {
      let errorMessage = 'Login failed. Please try again.';
      if (error instanceof SyntaxError) {
        errorMessage = 'Invalid JSON response from server.';
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }
      setError(errorMessage);
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  }, [credentials, login]);

  // Logout handler
  const handleLogout = useCallback(async () => {
    try {
      await fetch('/img/api/logout', { method: 'POST', credentials: 'include' });
      logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
  }, [logout]);

  // Input change handler for login credentials
  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCredentials(prev => ({ ...prev, [name]: value }));
    setError('');
  }, []);

  // Close the login form
  const handleCloseLoginForm = useCallback(() => {
    setShowLoginForm(false);
    setError('');
    setCredentials({ username: '', password: '' });
  }, []);

  // Toggle mobile menu sidebar visibility
  const toggleMenu = useCallback(() => {
    setIsMenuOpen(prev => !prev);
  }, []);

  // Search handlers
  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  }, []);

  const handleSearchSubmit = useCallback((e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?query=${encodeURIComponent(searchQuery.trim())}`);
      setIsMenuOpen(false);
    }
  }, [searchQuery, navigate]);

  // Memoized search bar UI – resizable to fit available space
  const searchBar = useMemo(() => (
    <form onSubmit={handleSearchSubmit} className="relative w-full max-w-xs flex-grow">
      <input
        type="text"
        placeholder="Search."
        value={searchQuery}
        onChange={handleSearchChange}
        className="w-full border border-gray-300 rounded-full py-2 px-4 pr-10 -mr-15 focus:outline-none focus:border-blue-500 transition-all"
      />
      <button
        type="submit"
        className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-blue-500"
      >
        <HiSearch size={20} />
      </button>
    </form>
  ), [searchQuery, handleSearchSubmit, handleSearchChange]);

  // Desktop navigation layout (visible on large screens)
  const desktopNavLayout = useMemo(() => (
    <div className="hidden lg:flex items-center justify-between w-full">
      {/* Left Section: Logo and Title */}
      <div className="flex items-center gap-3">
        <Link to="/" className="inline-flex items-center">
          <img src={logo} className="w-20 h-20 rounded-full" alt="Logo" />
          <span className="ml-3 text-2xl font-bold text-gray-800 whitespace-nowrap">TwoThumbsUp</span>
        </Link>
      </div>
      {/* Right Section: About link, Search Bar, Auth Controls */}
      <div className="flex items-center gap-6">
        <Link to="/about" className="text-gray-600 hover:text-blue-600 transition-colors duration-200 whitespace-nowrap">
          About
        </Link>
        {isAuthenticated && user?.role === 'admin' && (
          <Link to="/admin" className="text-gray-600 hover:text-blue-600 transition-colors duration-200 whitespace-nowrap">
            Admin
          </Link>
        )}
        {searchBar}
        {isAuthenticated ? (
          <div className="flex items-center gap-4">
            <span className="text-gray-600 whitespace-nowrap">Welcome, {user?.username}</span>
            <button 
              onClick={handleLogout} 
              className="px-4 py-2 bg-red-500 text-white whitespace-nowrap rounded-lg hover:bg-red-600 transition-colors duration-200"
            >
              Logout
            </button>
          </div>
        ) : (
          <button 
            onClick={() => setShowLoginForm(true)} 
            className="px-4 py-2 bg-blue-500 text-white whitespace-nowrap rounded-lg hover:bg-blue-600 transition-colors duration-200"
          >
            Log in
          </button>
        )}
      </div>
    </div>
  ), [isAuthenticated, user, handleLogout, searchBar]);

  // Mobile header: single row with logo, resizable search bar (centered), and hamburger menu (visible on screens below lg)
  const mobileHeader = useMemo(() => (
    <div className="lg:hidden p-4 bg-white flex items-center border-1 " >
      <Link to="/" className="flex items-center mr-4" onClick={() => setIsMenuOpen(false)}>
        <img src={logo} className="w-12 h-12 rounded-full" alt="Logo" />
        <span className="ml-2 text-lg font-bold text-gray-800 whitespace-nowrap mr-7">TwoThumbsUp</span>
      </Link>
      <div className="flex-grow mx-2  flex justify-center">
        {searchBar}
      </div>
      <button onClick={toggleMenu} className="text-2xl">
        <CiMenuBurger />
      </button>
    </div>
  ), [toggleMenu, searchBar]);

  // Mobile sidebar: full-screen overlay for additional navigation items.
  const mobileSidebar = useMemo(() => (
    <AnimatePresence>
      {isMenuOpen && (
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-50 bg-white p-6 overflow-y-auto"
        >
          <div className="flex items-center justify-between mb-6 border-b pb-4">
            <Link to="/" className="flex items-center" onClick={() => setIsMenuOpen(false)}>
              <img src={logo} className="w-12 h-12 rounded-full" alt="Logo" />
              <span className="ml-2 text-lg font-bold text-gray-800 whitespace-nowrap">TwoThumbsUp</span>
            </Link>
            <button onClick={toggleMenu} className="text-2xl">
              ✕
            </button>
          </div>
          <nav className="grid grid-cols-1 gap-4">
            <Link to="/about" onClick={toggleMenu} className="p-2 rounded hover:bg-gray-100 transition-colors whitespace-nowrap">
              About
            </Link>
            {isAuthenticated && user?.role === 'admin' && (
              <Link to="/admin" onClick={toggleMenu} className="p-2 rounded hover:bg-gray-100 transition-colors whitespace-nowrap">
                Admin
              </Link>
            )}
            <div className="border-t pt-4">
              {isAuthenticated ? (
                <div className="flex flex-col gap-4">
                  <span className="text-gray-600 whitespace-nowrap">Welcome, {user?.username}</span>
                  <button
                    onClick={() => { handleLogout(); toggleMenu(); }}
                    className="w-full py-2 bg-red-500 text-white whitespace-nowrap rounded-lg hover:bg-red-600 transition-colors duration-200"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => { setShowLoginForm(true); toggleMenu(); }}
                  className="w-full py-2 bg-blue-500 text-white whitespace-nowrap rounded-lg hover:bg-blue-600 transition-colors duration-200"
                >
                  Log in
                </button>
              )}
            </div>
          </nav>
        </motion.div>
      )}
    </AnimatePresence>
  ), [isAuthenticated, user, searchBar, toggleMenu, handleLogout, isMenuOpen]);

  return (
    <div className="relative">
      {/* Mobile header always visible on screens below lg */}
      {mobileHeader}
      {/* Desktop navigation visible on large screens */}
      <nav className="hidden border-1 lg:block w-[90%] mx-auto mt-3 bg-white text-black rounded-2xl  p-4">
        {desktopNavLayout}
      </nav>
      {mobileSidebar}
      {showLoginForm && (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={handleCloseLoginForm} />
          <div className="relative z-50 bg-white p-6 sm:p-8 rounded-xl  mx-auto max-w-md mt-20 animate-slide-down">
            <button className="absolute top-3 right-3 sm:top-4 sm:right-4 text-gray-500 hover:text-gray-700 transition-colors" onClick={handleCloseLoginForm}>
              ✕
            </button>
            <h2 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 text-gray-800 text-center">Admin Login</h2>
            <form onSubmit={handleLoginSubmit} className="space-y-4 sm:space-y-6">
              <div>
                <label className="block mb-2 text-gray-700 font-medium">Username</label>
                <input
                  type="text"
                  name="username"
                  className="w-full p-2 sm:p-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                  placeholder="Enter admin username"
                  value={credentials.username}
                  onChange={handleInputChange}
                  required
                  autoComplete="username"
                />
              </div>
              <div>
                <label className="block mb-2 text-gray-700 font-medium">Password</label>
                <input
                  type="password"
                  name="password"
                  className="w-full p-2 sm:p-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                  placeholder="Enter password"
                  value={credentials.password}
                  onChange={handleInputChange}
                  required
                  autoComplete="current-password"
                />
              </div>
              {error && (
                <div className="text-red-500 text-sm text-center p-2 bg-red-50 rounded-lg">
                  {error}
                </div>
              )}
              <button
                type="submit"
                className="w-full py-2 sm:py-3 bg-blue-500 text-white whitespace-nowrap rounded-lg hover:bg-blue-600 transition-colors duration-200 font-medium disabled:bg-gray-400"
                disabled={!credentials.username || !credentials.password || isLoading}
              >
                {isLoading ? 'Signing In...' : 'Sign In'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Navigation;
