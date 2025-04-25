import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Auth0Provider } from '@auth0/auth0-react';
import { BrowserRouter } from 'react-router-dom';
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter basename="/TwoThumbsUp">
      <Auth0Provider
        domain="dev-3nzgn2p2tfqapfnf.us.auth0.com"
        clientId="XkTFttZWb19gOmMvTj5wOV3j8ch24GCd"
        authorizationParams={{
          redirect_uri: `${window.location.origin}/TwoThumbsUp`,
          audience: "https://dev-3nzgn2p2tfqapfnf.us.auth0.com/api/v2/",
          scope: "openid profile email read:current_user update:current_user_metadata"
        }}
      >
        <App />
      </Auth0Provider>
    </BrowserRouter>
  </StrictMode>,
)
