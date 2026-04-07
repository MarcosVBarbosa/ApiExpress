import jwt from 'jsonwebtoken';
import { promisify } from 'util';
import authConfig from '../../config/auth.js';

// Model
import UserModel from '../models/UsersModel.js';

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

    // 🔥 busca usuário (já com role)
    const user = await UserModel.findByPk(decoded.id, {
      include: ['role'],
    });

    if (!user) {
      return res.status(401).json({ error: 'Usuário não encontrado' });
    }

    if (!user.status) {
      return res.status(401).json({ error: 'Usuário inativo' });
    }

    // injeta no request
    req.userId = user.id;
    req.user = user;

    return next();
  } catch (error) {
    console.error(error);

    return res.status(401).json({ error: 'Token inválido ou expirado' });
  }
}
