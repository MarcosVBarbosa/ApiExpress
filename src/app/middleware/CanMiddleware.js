// middleware/CanMiddleware.js
export function can(resource, action) {
  return (req, res, next) => {
    const crud = req.user?.roles?.crud;

    if (!crud) {
      // return res.status(403).json({ error: 'Sem permissão' });
    }

    if (!crud[resource]?.includes(action)) {
      // return res.status(403).json({ error: 'Sem permissão' });
    }

    return next();
  };
}
