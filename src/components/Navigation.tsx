import React, { useState, useCallback, FormEvent, useMemo, useEffect } from 'react';
import logo from '../assets/logo.jpg';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { CiMenuBurger } from 'react-icons/ci';
import { HiSearch, HiHome, HiInformationCircle, HiUserCircle, HiLogout, HiLogin, HiViewGrid } from 'react-icons/hi';
import { useAuth } from '../Context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

interface Credentials {
  username: string;
  password: string;
}

const Navigation: React.FC = () => {
  const { isAuthenticated, user, logout, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Auth-related state
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [credentials, setCredentials] = useState<Credentials>({ username: '', password: '' });
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Navigation and search states
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Close sidebar on navigation
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

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
    setIsMenuOpen(prevState => !prevState);
    console.log("Menu toggled, new state:", !isMenuOpen); // Debug log
  }, [isMenuOpen]);

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

  // Check if the current route matches 
  const isActive = useCallback((path: string) => {
    return location.pathname === path;
  }, [location]);

  // Memoized search bar UI – resizable to fit available space
  const searchBar = useMemo(() => (
    <form onSubmit={handleSearchSubmit} className="relative w-full max-w-xs flex-grow">
      <input
        type="text"
        placeholder="Search quotes..."
        value={searchQuery}
        onChange={handleSearchChange}
        className="w-full border border-gray-300 rounded-full py-2 px-4 pr-10 -mr-15 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
      />
      <button
        type="submit"
        className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-indigo-500"
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
        <Link to="/about" className="text-gray-600 hover:text-indigo-600 transition-colors duration-200 whitespace-nowrap">
          About
        </Link>
        {isAuthenticated && user?.role === 'admin' && (
          <Link to="/admin" className="text-gray-600 hover:text-indigo-600 transition-colors duration-200 whitespace-nowrap">
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
            className="px-4 py-2 bg-indigo-500 text-white whitespace-nowrap rounded-lg hover:bg-indigo-600 transition-colors duration-200"
          >
            Log in
          </button>
        )}
      </div>
    </div>
  ), [isAuthenticated, user, handleLogout, searchBar]);

  // Mobile header: single row with logo, resizable search bar (centered), and hamburger menu (visible on screens below lg)
  const mobileHeader = useMemo(() => (
    <div className="lg:hidden p-4 bg-white flex items-center shadow-sm" >
      <Link to="/" className="flex items-center mr-4" onClick={() => setIsMenuOpen(false)}>
        <img src={logo} className="w-12 h-12 rounded-full" alt="Logo" />
        <span className="ml-2 text-lg font-bold text-gray-800 whitespace-nowrap mr-7">TwoThumbsUp</span>
      </Link>
      <div className="flex-grow mx-2 flex justify-center">
        {searchBar}
      </div>
      <button 
        onClick={toggleMenu} 
        className="text-2xl p-2 rounded-full hover:bg-gray-100"
        aria-label="Toggle menu"
      >
        <CiMenuBurger />
      </button>
    </div>
  ), [toggleMenu, searchBar]);

  // Mobile sidebar: full-screen overlay with improved navigation and transitions
  const mobileSidebar = (
    <AnimatePresence>
      {isMenuOpen && (
        <>
          {/* Background overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 bg-black"
            onClick={toggleMenu}
          />
          
          {/* Sidebar */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed inset-y-0 right-0 z-50 w-72 bg-white shadow-2xl overflow-y-auto"
          >
            <div className="flex flex-col h-full">
              {/* Sidebar Header */}
              <div className="flex items-center justify-between p-4 border-b">
                <Link to="/" className="flex items-center" onClick={() => setIsMenuOpen(false)}>
                  <img src={logo} className="w-12 h-12 rounded-full" alt="Logo" />
                  <span className="ml-2 text-lg font-bold text-gray-800">TwoThumbsUp</span>
                </Link>
                <button 
                  onClick={toggleMenu} 
                  className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                >
                  <span className="text-2xl">✕</span>
                </button>
              </div>
              
              {/* User Info (if authenticated) */}
              {isAuthenticated && (
                <div className="p-4 bg-indigo-50 border-b">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-full bg-indigo-100">
                      <HiUserCircle className="w-6 h-6 text-indigo-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">{user?.username}</p>
                      <p className="text-sm text-gray-500">{user?.role}</p>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Navigation Links */}
              <nav className="flex-1 p-4">
                <div className="space-y-1">
                  <p className="text-xs text-gray-500 uppercase tracking-wider mb-2 ml-2">Navigation</p>
                  
                  <Link 
                    to="/" 
                    onClick={() => setIsMenuOpen(false)} 
                    className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
                      isActive('/') 
                        ? 'bg-indigo-100 text-indigo-800' 
                        : 'hover:bg-gray-100 text-gray-700'
                    }`}
                  >
                    <HiHome className="w-5 h-5" />
                    <span>Home</span>
                  </Link>
                  
                  <Link 
                    to="/about" 
                    onClick={() => setIsMenuOpen(false)} 
                    className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
                      isActive('/about') 
                        ? 'bg-indigo-100 text-indigo-800' 
                        : 'hover:bg-gray-100 text-gray-700'
                    }`}
                  >
                    <HiInformationCircle className="w-5 h-5" />
                    <span>About</span>
                  </Link>
                  
                  <Link 
                    to="/search" 
                    onClick={() => setIsMenuOpen(false)} 
                    className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
                      isActive('/search') 
                        ? 'bg-indigo-100 text-indigo-800' 
                        : 'hover:bg-gray-100 text-gray-700'
                    }`}
                  >
                    <HiSearch className="w-5 h-5" />
                    <span>Search</span>
                  </Link>
                  
                  {isAuthenticated && user?.role === 'admin' && (
                    <Link 
                      to="/admin" 
                      onClick={() => setIsMenuOpen(false)} 
                      className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
                        isActive('/admin') 
                          ? 'bg-indigo-100 text-indigo-800' 
                          : 'hover:bg-gray-100 text-gray-700'
                      }`}
                    >
                      <HiViewGrid className="w-5 h-5" />
                      <span>Admin</span>
                    </Link>
                  )}
                </div>
              </nav>
              
              {/* Authentication Button */}
              <div className="p-4 border-t">
                {isAuthenticated ? (
                  <button
                    onClick={() => { handleLogout(); setIsMenuOpen(false); }}
                    className="w-full flex items-center justify-center gap-2 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                  >
                    <HiLogout className="w-5 h-5" />
                    <span>Logout</span>
                  </button>
                ) : (
                  <button
                    onClick={() => { setShowLoginForm(true); setIsMenuOpen(false); }}
                    className="w-full flex items-center justify-center gap-2 py-3 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors"
                  >
                    <HiLogin className="w-5 h-5" />
                    <span>Log in</span>
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );

  return (
    <div className="relative">
      {/* Mobile header always visible on screens below lg */}
      {mobileHeader}
      {/* Desktop navigation visible on large screens */}
      <nav className="hidden border-1 lg:block w-[90%] mx-auto mt-3 bg-white text-black rounded-2xl shadow-sm p-4">
        {desktopNavLayout}
      </nav>
      {mobileSidebar}

      {/* Login form modal */}
      <AnimatePresence>
        {showLoginForm && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black"
              onClick={handleCloseLoginForm}
            />
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
            >
              <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold text-gray-800">Log In</h2>
                  <button 
                    onClick={handleCloseLoginForm}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    ✕
                  </button>
                </div>
                
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
                    {error}
                  </div>
                )}
                
                <form onSubmit={handleLoginSubmit}>
                  <div className="mb-4">
                    <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                      Username
                    </label>
                    <input
                      type="text"
                      id="username"
                      name="username"
                      value={credentials.username}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      required
                    />
                  </div>
                  
                  <div className="mb-6">
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                      Password
                    </label>
                    <input
                      type="password"
                      id="password"
                      name="password"
                      value={credentials.password}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      required
                    />
                  </div>
                  
                  <button
                    type="submit"
                    className="w-full py-2 bg-indigo-500 text-white rounded-md hover:bg-indigo-600 transition-colors"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Logging in...' : 'Log In'}
                  </button>
                </form>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Navigation;
