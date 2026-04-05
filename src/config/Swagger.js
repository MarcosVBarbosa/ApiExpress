import swaggerJSDoc from 'swagger-jsdoc';

const options = {
  definition: {
    servers: [
      {
        url: 'http://localhost:3000',
      },
    ],
  },

  // 🔥 Aqui ele lê seus controllers
  apis: ['src/app/controllers/*.js'],
};

export default swaggerJSDoc(options);
