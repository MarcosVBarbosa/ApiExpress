import express from 'express';
import router from './routes.js';
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './config/Swagger.js';
import cookieParser from 'cookie-parser';

import './database/index.js';

class App {
  constructor() {
    this.server = express();
    this.middlewares();
    this.router();
    this.server.use(cookieParser());
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
