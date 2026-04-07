import { Model, DataTypes } from 'sequelize';

class RefreshTokenModel extends Model {
  static init(sequelize) {
    super.init(
      {
        refresh_token: {
          type: DataTypes.STRING(255),
          allowNull: false,
          unique: true,
        },

        expires_at: {
          type: DataTypes.DATE,
          allowNull: false,
        },

        revoked_at: {
          type: DataTypes.DATE,
          allowNull: true,
        },

        user_id: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
      },
      {
        sequelize,
        tableName: 'refresh_tokens',
      }
    );
  }

  static associate(models) {
    this.belongsTo(models.UserModel, {
      foreignKey: 'user_id',
      as: 'user',
    });
  }

  // 🔍 Verifica se o token expirou
  isExpired() {
    return new Date() > this.expires_at;
  }

  // 🚫 Verifica se foi revogado
  isRevoked() {
    return !!this.revoked_at;
  }

  // 🔒 Verifica se é válido
  isValid() {
    return !this.isExpired() && !this.isRevoked();
  }
}

export default RefreshTokenModel;
