import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth0, User as Auth0User } from '@auth0/auth0-react';
import apiClient from '../utils/apiClient'; // Ensure apiClient uses the interceptor

// Define your local user type based on MongoDB schema
interface LocalUser {
  _id: string;
  username: string;
  email: string;
  role: 'user' | 'admin';
  profilePicture?: string;
  createdAt: string; // Or Date
  // Add other relevant fields
}

interface AuthContextType {
  // Auth0 state/methods
  isAuthenticated: boolean;
  user: Auth0User | undefined; // Auth0 profile
  isLoading: boolean; // Combined loading state
  loginWithRedirect: () => Promise<void>;
  logout: (options?: any) => Promise<void>;
  getAccessTokenSilently: (options?: any) => Promise<string>; // Keep for manual token needs if any

  // Local synced user state/methods
  localUser: LocalUser | null; // Synced profile from your DB
  isLoadingLocalUser: boolean;
  syncUser: () => Promise<void>; // Function to manually trigger sync if needed
  syncError: string | null;
  isSynced: boolean; // Flag indicating if sync attempt has completed
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const auth0 = useAuth0();
  const [localUser, setLocalUser] = useState<LocalUser | null>(null);
  const [isLoadingLocalUser, setIsLoadingLocalUser] = useState(false);
  const [syncError, setSyncError] = useState<string | null>(null);
  const [isSynced, setIsSynced] = useState(false); // Track if sync attempt is done

  // Memoized sync function
  const syncUser = useCallback(async () => {
    // Don't sync if not authenticated or already loading
    if (!auth0.isAuthenticated || !auth0.user || isLoadingLocalUser) return;

    // console.log('Attempting user sync...');
    setIsLoadingLocalUser(true);
    setIsSynced(false); // Reset sync status on new attempt
    setSyncError(null);

    try {
      // Interceptor handles token
      const response = await apiClient.post('/users/sync-me');
      setLocalUser(response.data.user);
      setIsSynced(true);
      console.log('Local user data synced:', response.data.user);
    } catch (error: any) {
      console.error('Error during user sync API call:', error);
      setSyncError(error.response?.data?.error || error.message || 'Sync failed.');
      setLocalUser(null);
      setIsSynced(true); // Mark sync attempt as done even on error
    } finally {
      setIsLoadingLocalUser(false);
    }
  }, [auth0.isAuthenticated, auth0.user, isLoadingLocalUser]); // Dependencies for useCallback

  // Effect to trigger sync on auth change
  useEffect(() => {
    if (auth0.isAuthenticated && !auth0.isLoading) {
        // console.log('Auth state ready, calling syncUser...');
      syncUser();
    } else if (!auth0.isAuthenticated && !auth0.isLoading) {
      // Clear local user and reset sync state on logout
      setLocalUser(null);
      setIsSynced(false);
      setSyncError(null);
    }
     // Intentionally excluding syncUser from dependencies to avoid re-triggering on its recreation
     // We only want this effect to run when auth state itself changes.
  }, [auth0.isAuthenticated, auth0.isLoading]);


  const contextValue: AuthContextType = {
    // Auth0 values
    isAuthenticated: auth0.isAuthenticated,
    user: auth0.user,
    // Combined loading: True if Auth0 is loading OR local user is loading AND sync hasn't finished
    isLoading: auth0.isLoading || (isLoadingLocalUser && !isSynced),
    loginWithRedirect: auth0.loginWithRedirect,
    logout: auth0.logout,
    getAccessTokenSilently: auth0.getAccessTokenSilently,
    // Local user values
    localUser,
    isLoadingLocalUser,
    syncUser,
    syncError,
    isSynced
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 