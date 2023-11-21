const express = require('express')
const mongoose = require('mongoose')
const config = require('./config/config')
const authRoutes = require('./app/routes/auth')
const noteRoutes = require('./app/routes/note')
const rateLimit = require('express-rate-limit')
const swaggerUi = require('swagger-ui-express')
const swaggerSpec = require('./swagger') // Import the swagger configuration

const app = express()

// Middleware
app.use(express.json())

// Apply rate limiting to all routes
const limiter = rateLimit(config.rateLimit)
app.use(limiter)

/// MongoDB Connection
mongoose
  .connect(config.mongoURI)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error(err))

// Swagger UI route
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))

// Routes
app.use('/auth', authRoutes)
app.use('/api', noteRoutes)

const PORT = config.port

const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})

module.exports = server
