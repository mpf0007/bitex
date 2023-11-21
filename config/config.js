module.exports = {
  // MongoDB Configuration
  mongoURI: process.env.MONGO_URI || 'mongodb://localhost:27017/test',

  // JWT Configuration
  jwtSecret: process.env.JWT_SECRET || 'secret-key',
  jwtExpiration: process.env.JWT_EXPIRATION || '1h',

  // Server Configuration
  port: process.env.PORT || 3000,
  rateLimit: {
    windowMs: 1 * 60 * 1000, // 1 minutes
    max: 100, // limit each IP to 3 requests per windowMs
    message: 'Too many requests from this IP, please try again later.',
  },
}
