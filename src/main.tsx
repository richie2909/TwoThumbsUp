import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Auth0Provider } from '@auth0/auth0-react';
import './index.css'
import App from './App.tsx'



createRoot(document.getElementById('root')!).render(
  <StrictMode>
    
    <Auth0Provider
    domain="dev-4cy465i0emep1id3.jp.auth0.com"
    clientId="kl0l2IlImafWfVzeoxEnktcQRmXrd61y"
    authorizationParams={{
      redirect_uri: window.location.origin,
      audience: "https://dev-4cy465i0emep1id3.jp.auth0.com/api/v2/",
      scope: "read:current_user update:current_user_metadata"
    }}>
          <App />
    </Auth0Provider>
    
    
      

  
  </StrictMode>,
)
