import { Model, DataTypes } from 'sequelize';
import bcrypt from 'bcrypt';

class UserModel extends Model {
  static init(sequelize) {
    super.init(
      {
        name: {
          type: DataTypes.STRING,
          allowNull: false,
        },

        username: {
          type: DataTypes.STRING,
          allowNull: false,
          unique: true,
        },

        password_hash: {
          type: DataTypes.STRING,
          allowNull: false,
        },

        role_id: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },

        file_id: {
          type: DataTypes.INTEGER,
          allowNull: true,
        },

        status: {
          type: DataTypes.BOOLEAN,
          defaultValue: true,
        },
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
    // User pertence a Role
    this.belongsTo(models.RolesModel, {
      foreignKey: 'role_id',
      as: 'roles',
    });

    // User pertence a File
    this.belongsTo(models.FilesModel, {
      foreignKey: 'file_id',
      as: 'file',
    });
  }

  // Método para comparar senha
  checkPassword(password) {
    return bcrypt.compare(password, this.password_hash);
  }
}

export default UserModel;
