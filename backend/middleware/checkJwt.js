import { auth } from 'express-oauth2-jwt-bearer';
import dotenv from 'dotenv';

// Ensure environment variables are loaded
dotenv.config();

// Set up Auth0 validation middleware
const checkJwt = auth({
  audience: process.env.AUTH0_AUDIENCE || 'https://dev-4cy465i0emep1id3.jp.auth0.com/api/v2/',
  issuerBaseURL: `https://${process.env.AUTH0_DOMAIN || 'dev-4cy465i0emep1id3.jp.auth0.com'}/`,
  tokenSigningAlg: 'RS256'
});

// Export middleware
export default checkJwt; 