import swaggerJSDoc from 'swagger-jsdoc';

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'TCG Market API',
      version: '1.0.0',
      description: 'API para marketplace de cartas coleccionables',
      contact: {
        name: 'Soporte',
        email: 'support@tcgmarket.com'
      }
    },
    servers: [
      {
        url: process.env.BASE_URL || 'http://localhost:3000',
        description: 'Servidor de desarrollo'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    },
    security: [
      {
        bearerAuth: []
      }
    ]
  },
  apis: [
    './src/routes/*.js',
    './src/models/*.js',
    './src/swagger/*.js' // Para definiciones adicionales
  ]
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);

export default swaggerSpec; 