import { Router } from 'express';
import { UsersController } from '../controllers/UsersController';
import { AuthController } from '../controllers/AuthController';

const usersRoutes = Router();
const controller = new UsersController();
const authController = new AuthController();

//LOGIN
usersRoutes.post('/login', authController.login);

usersRoutes.post('/', controller.create);
usersRoutes.get('/', controller.list);
usersRoutes.get('/:id', controller.getById);


export { usersRoutes };