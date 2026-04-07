import { Router } from 'express';
import multer from 'multer';

// Controllers
import UsersController from './app/controllers/UsersController.js';
import RolesController from './app/controllers/RolesController.js';
import SessionsController from './app/controllers/SessionsController.js';
import FilesController from './app/controllers/FilesController.js';

// Middlewares
import AuthMiddleware from './app/middleware/AuthMiddleware.js';
import { can } from './app/middleware/CanMiddleware.js';

// Config
import multerConfig from './config/multer.js';

const router = new Router();
const uploads = multer(multerConfig);

// 🔓 Auth (público)
router.post('/sessions', SessionsController.create);
router.post('/sessions/refresh', SessionsController.refresh);
router.post('/sessions/logout', SessionsController.logout);

// 🔒 Protege tudo abaixo
router.use(AuthMiddleware);

// 👤 Users
router.get('/users', can('users', 'read'), UsersController.index);
router.get('/users/:id', can('users', 'read'), UsersController.show);
router.post('/users', can('users', 'create'), UsersController.create);
router.put('/users/:id', can('users', 'update'), UsersController.update);
router.delete('/users/:id', can('users', 'delete'), UsersController.destroy);

// 🔐 Roles
router.get('/roles', can('roles', 'read'), RolesController.index);
router.get('/roles/:id', can('roles', 'read'), RolesController.show);
router.post('/roles', can('roles', 'create'), RolesController.create);
router.put('/roles/:id', can('roles', 'update'), RolesController.update);
router.delete('/roles/:id', can('roles', 'delete'), RolesController.destroy);

// 📁 Files
router.get('/files', can('files', 'read'), FilesController.index);
router.get('/files/:id', can('files', 'read'), FilesController.show);
router.post(
  '/files',
  can('files', 'create'),
  uploads.single('file'),
  FilesController.create
);
router.put('/files/:id', can('files', 'update'), FilesController.update);
router.delete('/files/:id', can('files', 'delete'), FilesController.destroy);

export default router;
