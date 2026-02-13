import { Router } from 'express';
import { usersRoutes } from './modules/users/routes/user.routes';
import { quizzesRoutes } from './modules/quizzes/routes/quizzes.routes';

const routes = Router();

routes.use('/users', usersRoutes);
routes.use('/quizzes', quizzesRoutes);

export { routes };