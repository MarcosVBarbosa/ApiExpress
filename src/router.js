import { Router } from 'express';
import UsersController from './app/controllers/UsersController.js';
import PermissionsUsersController from './app/controllers/PermissionsUsersController.js';

const router = new Router();

router.get('/Users', UsersController.index);
router.get('/Users/:id', UsersController.show);
router.post('/Users', UsersController.create);
router.put('/Users/:id', UsersController.update);
router.delete('/Users/:id', UsersController.destroy);

router.get('/PermissionsUsers', PermissionsUsersController.index);
router.get('/PermissionsUsers/:id', PermissionsUsersController.show);
router.post('/PermissionsUsers', PermissionsUsersController.create);
router.put('/PermissionsUsers/:id', PermissionsUsersController.update);
router.delete('/UsPermissionsUsersers/:id', PermissionsUsersController.destroy);

export default router;
