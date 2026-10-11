/**
 * Error Handling Middleware
 */

export const notFoundHandler = (req, res, next) => {
  res.status(404).json({
    success: false,
    message: `Route Not Found - ${req.originalUrl}`
  });
};

export const globalErrorHandler = (err, req, res, next) => {
  console.error('Unhandled Server Error:', err);

  // Handle MySQL Duplicate Entry Error (ER_DUP_ENTRY / Code 1062)
  if (err.code === 'ER_DUP_ENTRY' || err.errno === 1062) {
    return res.status(409).json({
      success: false,
      message: 'A user with this email address already exists.'
    });
  }

  // Handle Malformed JSON payload
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({
      success: false,
      message: 'Malformed JSON payload in request body.'
    });
  }

  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
};
