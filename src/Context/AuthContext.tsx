import React, { createContext, useContext } from 'react';
import { useAuth0 } from '@auth0/auth0-react';

// Define the shape of your local user data if needed (optional)
// This might come from your backend sync endpoint
interface LocalUser {
  _id: string; // From MongoDB
  username: string;
  email: string;
  role: 'user' | 'admin';
  profilePicture?: string;
  // Add other fields stored in your MongoDB User model
}

interface AuthContextType {
  // Directly expose Auth0 state and methods
  isAuthenticated: boolean;
  user: any;
  isLoading: boolean;
  loginWithRedirect: () => Promise<void>;
  logout: (options?: any) => Promise<void>;
  getAccessTokenSilently: () => Promise<string>;
  // Add localUser state if you fetch/sync user data from your backend
  localUser: LocalUser | null; // Your application's user profile
  isLoadingLocalUser: boolean;
  syncUser: () => Promise<void>; // Expose the sync function if needed elsewhere
  // You might not need login/loginWithGoogle anymore as Auth0 handles it
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Note: With Auth0Provider wrapping the app, this custom provider might be less necessary,
// unless you are adding extra state like `localUser`.
// You could potentially just use `useAuth0` directly in components.
// However, keeping it can be useful for adding app-specific auth state/logic.
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const auth0 = useAuth0();

  // --- Optional: State for local user profile fetched from your backend ---
  // This is an example, adjust based on how you want to manage synced user data
  const [localUser, setLocalUser] = React.useState<LocalUser | null>(null);
  const [isLoadingLocalUser, setIsLoadingLocalUser] = React.useState(false);
  const [initialSyncDone, setInitialSyncDone] = React.useState(false);

  const syncUser = React.useCallback(async () => {
    if (!auth0.isAuthenticated || !auth0.user || isLoadingLocalUser) return;

    setIsLoadingLocalUser(true);
    try {
      // Assuming apiClient is configured with the interceptor
      // The interceptor adds the token automatically
      const response = await apiClient.post('/users/sync-me'); // Backend sync endpoint
      setLocalUser(response.data.user);
      console.log('Local user data synced/fetched:', response.data.user);
    } catch (error) {
      console.error('Failed to sync/fetch local user:', error);
      setLocalUser(null); // Clear local user on error
    } finally {
      setIsLoadingLocalUser(false);
      setInitialSyncDone(true); // Mark that sync has been attempted
    }
  }, [auth0.isAuthenticated, auth0.user, isLoadingLocalUser]); // Removed getAccessTokenSilently

  // Trigger sync when user is authenticated and sync hasn't run
  React.useEffect(() => {
    if (auth0.isAuthenticated && !auth0.isLoading && !initialSyncDone && !isLoadingLocalUser) {
      syncUser();
    }
    // Reset local user on logout
    if (!auth0.isAuthenticated && !auth0.isLoading && localUser) {
        setLocalUser(null);
        setInitialSyncDone(false); // Reset sync flag
    }
  }, [auth0.isAuthenticated, auth0.isLoading, initialSyncDone, syncUser, localUser, isLoadingLocalUser]);
  // --- End Optional: Local User Sync ---

  const contextValue: AuthContextType = {
    isAuthenticated: auth0.isAuthenticated,
    user: auth0.user,
    isLoading: auth0.isLoading,
    loginWithRedirect: auth0.loginWithRedirect,
    logout: auth0.logout,
    getAccessTokenSilently: auth0.getAccessTokenSilently,
    localUser, // Provide local user state
    isLoadingLocalUser,
    syncUser // Expose sync function
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
    // If using Auth0Provider, maybe suggest using useAuth0 directly?
    // Or keep this check if the custom provider is necessary.
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Make sure you import apiClient if you implement the localUser sync part
import apiClient from '../utils/apiClient'; // Adjust path as needed