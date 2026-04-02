import { Sequelize, Model } from 'sequelize';

class UsersModel extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        password_hash: Sequelize.STRING,
        permissions_user_id: Sequelize.INTEGER,
        status: true,
      },
      {
        sequelize,
        tableName: 'users',
      }
    );
  }

  static associations(models) {
    this.belongsTo(models.PermissionsUsers, {
      foreignKey: 'permissions_user_id',
    });
  }
}

export default UsersModel;
