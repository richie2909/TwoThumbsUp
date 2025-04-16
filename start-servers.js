// start-servers.js
import { spawn, exec } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const BACKEND_PORT = 5943;
const ENV_PATH = path.join(__dirname, 'backend', '.env');

// Kill any process using the backend port
console.log(`Killing any processes using port ${BACKEND_PORT}...`);
exec(`fuser -k ${BACKEND_PORT}/tcp`, (error, stdout, stderr) => {
  if (error) {
    console.log('No processes were using the port or kill command failed - continuing anyway');
  } else {
    console.log(`Killed processes on port ${BACKEND_PORT}`);
  }
  
  startBackend();
});

function startBackend() {
  console.log('Starting backend server...');
  
  // Check if .env file exists
  if (!fs.existsSync(ENV_PATH)) {
    console.error(`ERROR: .env file not found at ${ENV_PATH}`);
    process.exit(1);
  }
  
  // Read environment variables from .env
  const envConfig = {};
  const envContent = fs.readFileSync(ENV_PATH, 'utf8');
  envContent.split('\n').forEach(line => {
    if (line.trim() && !line.startsWith('#')) {
      const [key, ...valueParts] = line.split('=');
      const value = valueParts.join('=');
      envConfig[key.trim()] = value.trim();
    }
  });
  
  // Check required environment variables
  const requiredVars = ['MONGO_URI', 'JWT_SECRET', 'PORT'];
  const missingVars = requiredVars.filter(varName => !envConfig[varName]);
  
  if (missingVars.length > 0) {
    console.error(`ERROR: Missing required environment variables: ${missingVars.join(', ')}`);
    process.exit(1);
  }
  
  console.log('Environment variables loaded:');
  console.log('MONGO_URI:', envConfig.MONGO_URI ? '[FOUND]' : '[MISSING]');
  console.log('JWT_SECRET:', envConfig.JWT_SECRET ? '[FOUND]' : '[MISSING]');
  console.log('PORT:', envConfig.PORT);
  
  // Start backend process with environment variables
  const backend = spawn('node', ['backend/app.js'], {
    env: { ...process.env, ...envConfig },
    stdio: 'inherit'
  });
  
  backend.on('error', (error) => {
    console.error('Failed to start backend:', error);
  });
  
  backend.on('close', (code) => {
    if (code !== 0) {
      console.error(`Backend process exited with code ${code}`);
    } else {
      console.log('Backend process closed successfully');
    }
  });
  
  // Start frontend after a short delay to let backend initialize
  setTimeout(startFrontend, 2000);
}

function startFrontend() {
  console.log('Starting frontend server...');
  
  const frontend = spawn('npm', ['run', 'dev'], {
    stdio: 'inherit'
  });
  
  frontend.on('error', (error) => {
    console.error('Failed to start frontend:', error);
  });
  
  frontend.on('close', (code) => {
    if (code !== 0) {
      console.error(`Frontend process exited with code ${code}`);
    } else {
      console.log('Frontend process closed successfully');
    }
  });
}

// Handle process termination
process.on('SIGINT', () => {
  console.log('Shutting down servers...');
  process.exit();
}); 