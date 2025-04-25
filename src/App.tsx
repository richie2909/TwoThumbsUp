import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './Context/AuthContext'; 
import { ImageProvider } from './Context/context.tsx'
import { useAuth0 } from '@auth0/auth0-react';
import { useEffect } from 'react';
import { setupAuthInterceptor } from './utils/apiClient';
import Home from './pages/Home';

function App() {
  const { getAccessTokenSilently } = useAuth0();
  
  // Set up auth interceptor on mount
  useEffect(() => {
    setupAuthInterceptor(getAccessTokenSilently);
  }, [getAccessTokenSilently]);

  return (
    <AuthProvider>
      <ImageProvider>
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
      </ImageProvider>
    </AuthProvider>
  );
}

export default App;