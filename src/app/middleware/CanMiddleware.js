// middleware/CanMiddleware.js

export function can(resource, action = 'view') {
  return (req, res, next) => {
    const permissions = req.permissions;

    if (!permissions) {
      return res.status(403).json({ error: 'Sem permissão' });
    }

    const module = permissions[resource?.toLowerCase()];

    if (!module) {
      // return res.status(403).json({ error: 'Sem permissão' });
    }

    const allowed = module[action];

    if (!allowed) {
      // return res.status(403).json({ error: 'Acesso negado' });
    }

    return next();
  };
}
