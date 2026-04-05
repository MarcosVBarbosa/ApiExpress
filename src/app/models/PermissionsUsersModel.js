import { Sequelize, Model } from 'sequelize';

class PermissionsUsersModel extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        description: Sequelize.STRING,
        permissions: Sequelize.JSONB,
        status: Sequelize.BOOLEAN,
      },
      {
        sequelize,
        tableName: 'permissions_users',
      }
    );
  }
  static associate(models) {
    this.hasMany(models.UsersModel, {
      foreignKey: 'permissions_user_id',
      as: 'users',
    });
  }
}

export default PermissionsUsersModel;
