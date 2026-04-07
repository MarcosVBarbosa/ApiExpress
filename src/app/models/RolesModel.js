import { Model, DataTypes } from 'sequelize';

class RoleModel extends Model {
  static init(sequelize) {
    super.init(
      {
        name: {
          type: DataTypes.STRING,
          allowNull: false,
          unique: true,
        },

        description: {
          type: DataTypes.TEXT,
          allowNull: true,
        },

        permissions: {
          type: DataTypes.JSONB,
          allowNull: false,
        },

        status: {
          type: DataTypes.BOOLEAN,
          defaultValue: true,
        },
      },
      {
        sequelize,
        tableName: 'roles',
      }
    );
  }

  static associate(models) {
    this.hasMany(models.UserModel, {
      foreignKey: 'role_id',
      as: 'users',
    });
  }
}

export default RoleModel;
