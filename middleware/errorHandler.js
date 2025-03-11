// middleware/errorHandler.js

const errorHandler = (err, req, res, next) => {
    // Default error structure
    let error = {
      statusCode: err.statusCode || 500,
      message: err.message || 'Internal Server Error',
      errors: []
    };
  
    // Development logging
    if (process.env.NODE_ENV === 'development') {
      console.error(`[${new Date().toISOString()}] ERROR:`);
      console.error(err.stack);
      error.stack = err.stack;
      error.type = err.name;
    }
  
    // Handle different error types
    // Mongoose Validation Error
    if (err.name === 'ValidationError') {
      error.statusCode = 400;
      error.message = 'Validation Error';
      error.errors = Object.values(err.errors).map(e => ({
        field: e.path,
        message: e.message
      }));
    }
  
    // Mongoose Cast Error
    if (err.name === 'CastError') {
      error.statusCode = 400;
      error.message = `Invalid ${err.path}: ${err.value}`;
    }
  
    // JWT Errors
    if (err.name === 'JsonWebTokenError') {
      error.statusCode = 401;
      error.message = 'Invalid token';
    }
    
    if (err.name === 'TokenExpiredError') {
      error.statusCode = 401;
      error.message = 'Token expired';
    }
  
    // Express Validator Errors
    if (err.errors && Array.isArray(err.errors)) {
      error.statusCode = 400;
      error.message = 'Validation Failed';
      error.errors = err.errors.map(e => ({
        field: e.param,
        message: e.msg
      }));
    }
  
    // Final response
    res.status(error.statusCode).json({
      success: false,
      message: error.message,
      errors: error.errors,
      ...(process.env.NODE_ENV === 'development' && {
        stack: error.stack,
        errorType: error.type
      })
    });
  };
  
  export default errorHandler;