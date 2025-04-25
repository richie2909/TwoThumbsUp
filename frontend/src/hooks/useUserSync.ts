import { useEffect, useState, useCallback } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import apiClient from '../utils/apiClient'; // Assuming apiClient uses the interceptor now

export const useUserSync = () => {
  const { isAuthenticated, user, isLoading, getAccessTokenSilently } = useAuth0();
  const [isSynced, setIsSynced] = useState(false);
  const [syncError, setSyncError] = useState<string | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);

  const syncUser = useCallback(async () => {
    // No need to sync if not authenticated or already synced or currently syncing
    if (!isAuthenticated || isSynced || isSyncing || isLoading) {
       // console.log('User sync skipped:', { isAuthenticated, isSynced, isSyncing, isLoading });
      return;
    }

    // console.log('Attempting user sync...');
    setIsSyncing(true);
    setSyncError(null);

    try {
        // The interceptor in apiClient should handle getting the token automatically
        const response = await apiClient.post('/users/sync-me'); // Call the sync endpoint

        if (response.status === 200) {
            // console.log('User sync successful:', response.data);
            setIsSynced(true);
            // Optionally store the synced user profile from response.data.user in context/state
        } else {
            // This case might not be hit if errors are thrown
            console.error('User sync failed with status:', response.status);
            setSyncError('User sync failed with status: ' + response.status);
        }
    } catch (error: any) {
        console.error('Error during user sync API call:', error);
        setSyncError(error.response?.data?.error || error.message || 'An unknown error occurred during sync.');
        setIsSynced(false); // Ensure sync status is false on error
    } finally {
        setIsSyncing(false);
    }
  }, [isAuthenticated, isSynced, isLoading, isSyncing]); // Removed getAccessTokenSilently as interceptor handles it

  // Effect to trigger sync automatically when authentication state changes
  useEffect(() => {
    if (isAuthenticated && !isLoading && !isSynced && !isSyncing) {
      // console.log('Auth state ready, triggering sync...');
      syncUser();
    }
     // Reset sync status on logout
     if (!isAuthenticated && !isLoading && isSynced) {
        setIsSynced(false);
     }
  }, [isAuthenticated, isLoading, isSynced, syncUser, isSyncing]);

  return { isSynced, syncUser, syncError, isSyncing };
}; 