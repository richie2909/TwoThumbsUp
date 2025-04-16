// startBackend.js
import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read the .env file
const envPath = path.join(__dirname, 'backend', '.env');
console.log(`Reading .env from: ${envPath}`);

try {
  // Check if .env file exists
  if (!fs.existsSync(envPath)) {
    console.error(`ERROR: .env file not found at ${envPath}`);
    process.exit(1);
  }

  // Read .env file content
  const envConfig = fs.readFileSync(envPath, 'utf8')
    .split('\n')
    .filter(line => line.trim() !== '' && !line.startsWith('#'))
    .reduce((acc, line) => {
      const [key, ...valueParts] = line.split('=');
      const value = valueParts.join('=');
      acc[key.trim()] = value.trim();
      return acc;
    }, {});

  // Log environment variables for debugging  
  console.log('Environment variables loaded:');
  console.log('MONGO_URI:', envConfig.MONGO_URI ? '[FOUND]' : '[MISSING]');
  console.log('JWT_SECRET:', envConfig.JWT_SECRET ? '[FOUND]' : '[MISSING]');
  console.log('PORT:', envConfig.PORT || '(default)');

  // Start the backend process
  const backend = spawn('node', ['backend/app.js'], {
    env: { ...process.env, ...envConfig },
    stdio: 'inherit'
  });

  backend.on('close', (code) => {
    console.log(`Backend process exited with code ${code}`);
  });

} catch (error) {
  console.error('Error starting backend:', error);
  process.exit(1);
} 