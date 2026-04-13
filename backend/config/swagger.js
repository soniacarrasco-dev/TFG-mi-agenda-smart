const swaggerJsdoc = require('swagger-jsdoc');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'API Mi Agenda SMART',
            version: '1.0.0',
            description: 'Documentación de la API para la gestión de tareas, asignaturas y profesores',
        },
        servers: [
            {
                url: 'http://localhost:3001',
                description: 'Servidor Local',
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
    },
    // Ruta donde Swagger buscará los comentarios para generar la doc
    apis: ['./routes/*.js'],
};

const specs = swaggerJsdoc(options);
module.exports = specs;