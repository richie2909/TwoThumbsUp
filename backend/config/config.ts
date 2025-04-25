import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env file
dotenv.config();

const config = {
  jwt: {
    secret: process.env.JWT_SECRET || 'fallback_secret_not_for_production',
    expiration: process.env.JWT_EXPIRATION || '7d',
  },
  mongodb: {
    uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/twothumbsup',
  },
  firebase: {
    type: process.env.FIREBASE_TYPE,
    projectId: process.env.FIREBASE_PROJECT_ID,
    privateKeyId: process.env.FIREBASE_PRIVATE_KEY_ID,
    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    clientId: process.env.FIREBASE_CLIENT_ID,
    authUri: process.env.FIREBASE_AUTH_URI,
    tokenUri: process.env.FIREBASE_TOKEN_URI,
    authProviderCertUrl: process.env.FIREBASE_AUTH_PROVIDER_CERT_URL,
    clientCertUrl: process.env.FIREBASE_CLIENT_CERT_URL,
  },
  google: {
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  },
  server: {
    port: process.env.PORT || 3001,
    env: process.env.NODE_ENV || 'development',
  },
  cookie: {
    secret: process.env.COOKIE_SECRET,
    domain: process.env.COOKIE_DOMAIN,
    secure: process.env.NODE_ENV === 'production',
  },
};

// Validate required environment variables
const requiredEnvVars = [
  'JWT_SECRET',
  'MONGODB_URI',
  'FIREBASE_PROJECT_ID',
  'FIREBASE_PRIVATE_KEY',
  'FIREBASE_CLIENT_EMAIL',
  'GOOGLE_CLIENT_ID',
];

const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);

if (missingEnvVars.length > 0) {
  throw new Error(
    `Missing required environment variables: ${missingEnvVars.join(', ')}`
  );
}

export default config; 