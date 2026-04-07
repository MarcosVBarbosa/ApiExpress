export function can(resource, action) {
  return (req, res, next) => {
    const permissions = req.user?.role?.permissions;

    if (!permissions) {
      return res.status(403).json({ error: 'Sem permissão' });
    }

    const allowed = permissions?.[resource]?.includes(action);

    if (!allowed) {
      return res.status(403).json({ error: 'Sem permissão' });
    }

    return next();
  };
}
