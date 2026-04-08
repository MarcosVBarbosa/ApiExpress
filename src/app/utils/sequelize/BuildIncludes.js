import RolesModel from '../../models/RolesModel.js';
import FilesModel from '../../models/UsersModel.js';

/**
 * Retorna array de includes dinamicamente
 * @param {string} includelist - nomes de relacionamentos separados por vírgula
 * @returns {Array} include para Sequelize
 */
export function BuildIncludes(includelist) {
  const includeOptions = {
    roles: {
      model: RolesModel,
      as: 'roles',
      attributes: ['id', 'name', 'permissions'],
      required: false,
    },
    file: {
      model: FilesModel,
      as: 'files',
      attributes: ['id', 'name', 'path'],
      required: false,
    },
  };

  const include = [];
  if (includelist) {
    includelist.split(',').forEach((key) => {
      const item = key.trim();
      if (includeOptions[item]) include.push(includeOptions[item]);
    });
  }
  return include;
}
