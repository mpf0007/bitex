const swaggerJSDoc = require('swagger-jsdoc')

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Note API',
    version: '1.0.0',
    description: 'API for a simple note-taking application',
    contact: {
      name: 'Pouya Farahaani',
      url: 'https://www.linkedin.com/in/pouyafarahaani/',
    },
  },
  servers: [
    {
      url: 'http://localhost:3000',
      description: 'Development server',
    },
  ],
}

const options = {
  swaggerDefinition,
  apis: ['./app/routes/*.js'], // Path to the API routes
}

const swaggerSpec = swaggerJSDoc(options)

module.exports = swaggerSpec
