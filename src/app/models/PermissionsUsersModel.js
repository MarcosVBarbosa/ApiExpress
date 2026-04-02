import { Sequelize, Model } from 'sequelize';

class PermissionsUsersModel extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        description: Sequelize.STRING,
        permissions: Sequelize.JSONB,
        status: true,
      },
      {
        sequelize,
        tableName: 'permissions_users',
      }
    );
  }
  static associations(models) {
    this.hasMany(models.Users);
  }
}

export default PermissionsUsersModel;
