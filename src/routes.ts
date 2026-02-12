import { Router } from 'express';
import { usersRoutes } from './modules/users/routes/user.routes';

const routes = Router();

routes.use('/users', usersRoutes);

export { routes };