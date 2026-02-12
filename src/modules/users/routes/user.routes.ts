import { Router } from 'express';
import { UsersController } from '../controllers/UsersController';

const usersRoutes = Router();
const controller = new UsersController();

usersRoutes.post('/', controller.create);
usersRoutes.get('/', controller.list);

export { usersRoutes };