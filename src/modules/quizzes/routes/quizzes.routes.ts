import { Router } from 'express';
import { QuizzesController } from '../controllers/QuizzesController';
import { ensureAuthenticated } from '../../../shared/middlewares/ensureAuthenticated';
import { ensureRole } from '../../../shared/middlewares/ensureRole';

const router = Router();
const controller = new QuizzesController();

/* ====================================
   QUIZZES - PROFESSOR
==================================== */

// Criar quiz
router.post(
  '/',
  ensureAuthenticated,
  ensureRole('PROFESSOR'),
  controller.createQuiz
);

// Listar todos quizzes
router.get(
  '/',
  ensureAuthenticated,
  ensureRole('PROFESSOR'),
  controller.listQuizzes
);

// Listar quizzes do professor
// router.get(
//   '/:userId',
//   ensureAuthenticated,
//   ensureRole('PROFESSOR'),
//   controller.listProfessorQuizzes
// );

// Ativar / desativar
router.patch(
  '/:quizId/status',
  ensureAuthenticated,
  ensureRole('PROFESSOR'),
  controller.toggleStatus
);

/* ====================================
   QUESTIONS - PROFESSOR
==================================== */

// Criar pergunta
router.post(
  '/:quizId/questions',
  ensureAuthenticated,
  ensureRole('PROFESSOR'),
  controller.createQuestion
);

// Listar perguntas do quiz
router.get(
  '/:quizId/questions',
  ensureAuthenticated,
  controller.listQuestions
);

/* ====================================
   PARTICIPAÇÃO - ALUNO
==================================== */

// Entrar no quiz
router.post(
  '/:quizId/join',
  ensureAuthenticated,
  ensureRole('ALUNO'),
  controller.joinQuiz
);

// Buscar quiz para responder
router.get(
  '/:quizId/play',
  ensureAuthenticated,
  ensureRole('ALUNO'),
  controller.playQuiz
);

/* ====================================
   ANSWERS - ALUNO
==================================== */

// Responder pergunta
router.post(
  '/:quizId/questions/:questionId/answers',
  ensureAuthenticated,
  ensureRole('ALUNO'),
  controller.answerQuestion
);

/* ====================================
   SCORE & RANKING
==================================== */

// Minha pontuação
router.get(
  '/:quizId/my-score',
  ensureAuthenticated,
  ensureRole('ALUNO'),
  controller.myScore
);

// Ranking completo
router.get(
  '/:quizId/ranking',
  ensureAuthenticated,
  controller.ranking
);

// Top 3
router.get(
  '/:quizId/ranking/top',
  ensureAuthenticated,
  controller.topRanking
);

export { router as quizzesRoutes };