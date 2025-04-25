import axios from 'axios';

// Determine API Base URL from environment variables
const apiBaseUrl = '/api/v1';

const apiClient = axios.create({
  baseURL: apiBaseUrl,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Store the getAccessTokenSilently function reference
let getAccessTokenSilentlyFunc: any = null;

// Function to set up the auth interceptor
export const setupAuthInterceptor = (getTokenFunc: any) => {
  console.log('Setting up Auth0 interceptor...');
  getAccessTokenSilentlyFunc = getTokenFunc;

  // Add request interceptor
  apiClient.interceptors.request.use(
    async (config) => {
      // Only add token if the function is available
      if (!getAccessTokenSilentlyFunc) {
        return config;
      }

      try {
        const token = await getAccessTokenSilentlyFunc();
        config.headers.Authorization = `Bearer ${token}`;
      } catch (error) {
        console.error('Auth interceptor error:', error);
      }

      return config;
    },
    (error) => Promise.reject(error)
  );

  // Add response interceptor for error handling
  apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response) {
        // Handle specific status codes
        if (error.response.status === 401) {
          console.error('Authentication error. Please log in again.');
        }
      }
      return Promise.reject(error);
    }
  );
};

export default apiClient; 