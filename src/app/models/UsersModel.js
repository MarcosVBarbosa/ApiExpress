import { Sequelize, Model } from 'sequelize';
import bcrypt from 'bcrypt';

class UsersModel extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        password_hash: Sequelize.STRING,
        permissions_user_id: Sequelize.INTEGER,
        status: Sequelize.BOOLEAN,
      },
      {
        sequelize,
        tableName: 'users',
        defaultScope: {
          attributes: { exclude: ['password_hash'] },
        },
        scopes: {
          withPassword: {
            attributes: { include: ['password_hash'] },
          },
        },
      }
    );
  }

  static associate(models) {
    this.belongsTo(models.PermissionsUsersModel, {
      foreignKey: 'permissions_user_id',
      as: 'permissionUser',
    });
  }

  checkPassword(password) {
    return bcrypt.compare(password, this.password_hash);
  }
}

export default UsersModel;
