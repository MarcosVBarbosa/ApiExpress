import express from 'express';
import router from './router.js';

class App {
    constructor(){
        this.server = express();
        this.middlewares();
        this.router();
    }

    middlewares(){
        this.server.use(express.json());
    }
     router(){
        this.server.use(router);
     }
}

export default new App().server