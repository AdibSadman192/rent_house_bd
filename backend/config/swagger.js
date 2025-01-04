const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Rent House BD API Documentation',
      version: '1.0.0',
      description: 'API documentation for Rent House BD - A modern house rental platform for Bangladesh',
      contact: {
        name: 'API Support',
        email: 'support@renthousebd.com'
      },
    },
    servers: [
      {
        url: 'http://localhost:5000',
        description: 'Development server',
      },
      {
        url: 'https://api.renthousebd.com',
        description: 'Production server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [{
      bearerAuth: [],
    }],
  },
  apis: [
    './routes/*.js',
    './models/*.js',
  ],
};

const specs = swaggerJsdoc(options);

module.exports = specs;
