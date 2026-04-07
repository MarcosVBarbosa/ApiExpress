import { Model, DataTypes } from 'sequelize';

class FilesModel extends Model {
  static init(sequelize) {
    super.init(
      {
        name: {
          type: DataTypes.STRING,
          allowNull: false,
        },

        key: {
          type: DataTypes.STRING,
          allowNull: false,
          unique: true,
        },

        path: {
          type: DataTypes.STRING,
          allowNull: false,
        },

        size: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },

        mime_type: {
          type: DataTypes.STRING,
          allowNull: false,
        },

        status: {
          type: DataTypes.BOOLEAN,
          defaultValue: true,
        },
      },
      {
        sequelize,
        tableName: 'files',
      }
    );
  }

  static associate(models) {
    this.hasMany(models.UserModel, {
      foreignKey: 'file_id',
      as: 'users',
    });
  }
}

export default FilesModel;
