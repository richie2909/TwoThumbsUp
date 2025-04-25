import axios from 'axios';
import { Auth0ContextInterface } from '@auth0/auth0-react'; // Import for type hinting

const apiClient = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api/${import.meta.env.VITE_API_VERSION || 'v1'}`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Function to initialize the interceptor
// Call this function once in your app, perhaps near where Auth0Provider is used,
// passing the getAccessTokenSilently function.
export const setupAuthInterceptor = (
    getAccessTokenSilently: Auth0ContextInterface['getAccessTokenSilently']
) => {
  apiClient.interceptors.request.use(
    async (config) => {
      // Only add the token if the request is going to our API
      // (prevents sending token to external URLs if apiClient is reused)
      const apiBaseUrl = `${import.meta.env.VITE_API_URL}/api/`;
      if (config.url?.startsWith('/') || config.url?.startsWith(apiBaseUrl)) {
          try {
              // console.log('Getting access token for API request...');
              const token = await getAccessTokenSilently({
                  authorizationParams: {
                      audience: import.meta.env.VITE_AUTH0_AUDIENCE,
                      // Add any necessary scopes here if needed beyond default
                  },
              });
              // console.log('Token received, attaching to header.');
              config.headers.Authorization = `Bearer ${token}`;
          } catch (error) {
              console.error('Could not get access token for API call:', error);
              // Optionally handle token acquisition errors (e.g., redirect to login)
              // For now, let the request proceed without the token (backend should reject)
          }
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // Optional: Response interceptor for handling 401 errors globally
  apiClient.interceptors.response.use(
    response => response,
    error => {
      if (error.response && error.response.status === 401) {
        console.error('API Request Unauthorized (401):', error.response.data);
        // Here you could potentially trigger a logout or refresh attempt
        // Or display a global notification
      }
      return Promise.reject(error);
    }
  );
};

export default apiClient; 