import { Router } from 'express';
import UsersController from './app/controllers/UsersController.js';
import PermissionsUsersController from './app/controllers/PermissionsUsersController.js';
import SessionsController from './app/controllers/SessionsController.js';
import AuthMiddlware from './app/middleware/AuthMiddlware.js';

const router = new Router();

// 🔓 Login
router.post('/sessions', SessionsController.create);

// 🔒 Protege tudo abaixo
router.use(AuthMiddlware);

// 👤 Users
router.get('/users', UsersController.index);
router.get('/users/:id', UsersController.show);
router.post('/users', UsersController.create);
router.put('/users/:id', UsersController.update);
router.delete('/users/:id', UsersController.destroy);

// 🔐 Permissions
router.get('/permissions-users', PermissionsUsersController.index);
router.get('/permissions-users/:id', PermissionsUsersController.show);
router.post('/permissions-users', PermissionsUsersController.create);
router.put('/permissions-users/:id', PermissionsUsersController.update);
router.delete('/permissions-users/:id', PermissionsUsersController.destroy);

export default router;
