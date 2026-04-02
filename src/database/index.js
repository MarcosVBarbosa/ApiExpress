import Sequelize from 'sequelize';
import databaseConfig from '../config/database.js';

import User from '../app/models/UsersModel.js';
import PermissionsUsers from '../app/models/PermissionsUsersModel.js';

const models = [User, PermissionsUsers];

class Database {
  constructor() {
    this.init();
  }

  init() {
    this.connection = new Sequelize(databaseConfig);
    models.forEach((model) => model.init(this.connection));
  }
}

export default new Database();
