import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth0, withAuthenticationRequired } from '@auth0/auth0-react';
import { useUserSync } from './hooks/useUserSync';

// --- Page/Component Imports ---
import Navigation from './components/Navigation'; // Your main navigation
import HomePage from './pages/HomePage';         // Your home page component
import BlogPage from './pages/BlogPage';         // Page listing all blog posts
import BlogPostDetail from './components/BlogPostDetail'; // Single blog post view
import UploadPage from './pages/UploadPage';     // Image upload page (example)
import ProfilePage from './pages/ProfilePage';   // User profile page (example)
import CreatePostPage from './pages/CreatePostPage'; // Example page for creating a post
import LoadingSpinner from './components/LoadingSpinner'; // A component to show while Auth0 loads

// --- Protected Route Component ---
// Helper to wrap components needing authentication
const ProtectedRoute: React.FC<{ component: React.ComponentType }> = ({ component: Component, ...rest }) => {
  const AuthenticatedComponent = withAuthenticationRequired(Component, {
    onRedirecting: () => <LoadingSpinner />, // Show loading spinner while redirecting
  });
  return <AuthenticatedComponent {...rest} />;
};

function App() {
  const { isLoading, error } = useAuth0();
  const { isSynced, syncError, isSyncing } = useUserSync();

  useEffect(() => {
    if (syncError) {
      console.error("User Sync Error:", syncError);
    }
  }, [syncError]);

  if (isLoading || isSyncing) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <div>Oops... {error.message}</div>; // Handle Auth0 initialization errors
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navigation />
      <main className="flex-grow container mx-auto p-4">
        <Routes>
          {/* --- Public Routes --- */}
          <Route path="/" element={<HomePage />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/blog/:id" element={<BlogPostDetail />} />

          {/* --- Routes to Remove --- */}
          {/* <Route path="/login" element={<Login />} /> */}
          {/* <Route path="/login/success" element={<LoginSuccess />} /> */}
          {/* <Route path="/login/error" element={<SomeErrorPage />} /> */}

          {/* --- Protected Routes (Require Login) --- */}
          {/* Use the ProtectedRoute component */}
          <Route path="/upload" element={<ProtectedRoute component={UploadPage} />} />
          <Route path="/profile" element={<ProtectedRoute component={ProfilePage} />} />
          <Route path="/create-post" element={<ProtectedRoute component={CreatePostPage} />} />
          {/* Add other protected routes here */}


          {/* --- Fallback Route --- */}
          <Route path="*" element={<Navigate to="/" replace />} /> {/* Or a 404 page */}
        </Routes>
      </main>
      {/* Optional Footer */}
    </div>
  );
}

export default App; 