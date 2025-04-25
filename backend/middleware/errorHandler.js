// middleware/errorHandler.js

const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);
  
  // Default status code and message
  let statusCode = 500;
  let message = 'Server error';
  
  // Handle specific types of errors
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = 'Validation error';
  } else if (err.name === 'CastError') {
    statusCode = 400;
    message = 'Invalid ID format';
  } else if (err.code === 11000) {
    statusCode = 400;
    message = 'Duplicate key error';
  }
  
  // Send response
  res.status(statusCode).json({
    error: message,
    details: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
};

export default errorHandler;