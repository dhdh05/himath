export const errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  const status = err.status || 500;
  const message = err.message || 'Internal server error';

  res.status(status).json({
    success: false,
    message: process.env.NODE_ENV === 'production' ? 'An error occurred' : message,
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack })
  });
};

export class AppError extends Error {
  constructor(message, status = 500) {
    super(message);
    this.status = status;
  }
}
