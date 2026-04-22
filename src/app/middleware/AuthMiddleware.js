import jwt from 'jsonwebtoken';
import { promisify } from 'util';
import authConfig from '../../config/auth.js';

// Model
import UserModel from '../models/UsersModel.js';

const normalizeCrud = (crud = {}) => {
  const normalized = {};

  Object.keys(crud).forEach((module) => {
    const value = crud[module];

    if (Array.isArray(value)) {
      normalized[module.toLowerCase()] = {
        view: value.includes('read'),
        create: value.includes('create'),
        edit: value.includes('update'),
        delete: value.includes('delete'),
      };
      return;
    }

    if (typeof value === 'object') {
      normalized[module.toLowerCase()] = {
        view: !!value.view || value['0'] === 'read',
        create: !!value.create || value['1'] === 'create',
        edit: !!value.edit || value['2'] === 'update',
        delete: !!value.delete || value['3'] === 'delete',
      };
      return;
    }

    // fallback
    normalized[module.toLowerCase()] = {
      view: false,
      create: false,
      edit: false,
      delete: false,
    };
  });

  return normalized;
};

export default async function AuthMiddleware(req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ error: 'Token não fornecido' });
    }

    const parts = authHeader.split(' ');

    if (parts.length !== 2) {
      return res.status(401).json({ error: 'Token mal formatado' });
    }

    const [scheme, token] = parts;

    if (!/^Bearer$/i.test(scheme)) {
      return res.status(401).json({ error: 'Token mal formatado' });
    }

    const decoded = await promisify(jwt.verify)(token, authConfig.secret);

    // 🔥 busca usuário com role
    const user = await UserModel.findByPk(decoded.id, {
      include: ['roles'],
    });

    if (!user) {
      return res.status(401).json({ error: 'Usuário não encontrado' });
    }

    if (!user.status) {
      return res.status(401).json({ error: 'Usuário inativo' });
    }

    // 🔥 pega crud do role (ajuste conforme seu model)
    const rawCrud = user.roles?.crud || user.roles?.dataValues?.crud || {};

    const permissions = normalizeCrud(rawCrud);

    // 🔥 injeta no request
    req.userId = user.id;
    req.user = user;
    req.permissions = permissions;

    return next();
  } catch (error) {
    console.error(error);

    return res.status(401).json({
      error: 'Token inválido ou expirado',
    });
  }
}
