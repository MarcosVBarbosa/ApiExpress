import express from 'express';
import router from './router.js';
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './config/Swagger.js';

import './database/index.js';

class App {
  constructor() {
    this.server = express();
    this.middlewares();
    this.router();
  }

  middlewares() {
    this.server.use(express.json());
  }
  router() {
    this.server.use(router);
    this.server.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  }
}

export default new App().server;
