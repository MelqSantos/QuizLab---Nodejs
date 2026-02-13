import { Router } from 'express';
import { UsersController } from '../controllers/UsersController';
import { AuthController } from '../controllers/AuthController';

const usersRoutes = Router();
const controller = new UsersController();
const authController = new AuthController();

usersRoutes.post('/', controller.create);
usersRoutes.get('/', controller.list);

//LOGIN
usersRoutes.post('/login', authController.login);

export { usersRoutes };