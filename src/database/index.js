import Sequelize from 'sequelize';
import dataBaseConfig from '../config/database.js';

//Controllers
import User from '../app/models/UsersModel.js';
import RolesUsers from '../app/models/RolesModel.js';
import Files from '../app/models/FilesModel.js';
import RefreshTokenModel from '../app/models/RefreshTokenModel.js';

const models = [User, RolesUsers, Files, RefreshTokenModel];

class Database {
  constructor() {
    this.init();
  }

  init() {
    this.connection = new Sequelize(dataBaseConfig);

    // ✅ 1. Inicializa todos os models
    models.forEach((model) => {
      model.init(this.connection);
    });

    // ✅ 2. Executa associações
    models.forEach((model) => {
      if (model.associate) {
        model.associate(this.connection.models);
      }
    });
  }
}

export default new Database();
