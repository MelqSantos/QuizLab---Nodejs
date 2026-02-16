import { Request, Response } from 'express';

import { CreateQuizService } from '../services/CreateQuizService';
import { CreateQuestionService } from '../services/CreateQuestionService';
import { JoinQuizService } from '../services/JoinQuizService';
import { SubmitAnswerService } from '../services/SubmitAnswerService';
import { GetRankingService } from '../services/GetRankingService';
import { GetMyScoreService } from '../services/GetMyScoreService';

import { QuizzesRepository } from '../repositories/QuizzesRepository';
import { QuestionsRepository } from '../repositories/QuestionsRepository';
import { AlternativesRepository } from '../repositories/AlternativesRepository';
import { QuizParticipantsRepository } from '../repositories/QuizParticipantsRepository';
import { AnswersRepository } from '../repositories/AnswersRepository';
import { UpdateQuestionService } from '../services/UpdateQuestionService';

export class QuizzesController {

  /* ==========================
      PROFESSOR
  ========================== */

  async createQuiz(req: any, res: Response) {
    const { title, className, theme } = req.body;

    const quizzesRepository = new QuizzesRepository();
    const service = new CreateQuizService(quizzesRepository);

    const quiz = await service.execute({
      title,
      className,
      theme,
      createdBy: req.user.id,
      role: req.user.role
    });

    return res.status(201).json(quiz);
  }

  async listProfessorQuizzes(req: any, res: Response) {
    const quizzesRepository = new QuizzesRepository();
    const quizzes = await quizzesRepository.findByProfessor(req.user.id);

    return res.json(quizzes);
  }

  async listQuizzes(req: Request, res: Response) {
    const quizzesRepository = new QuizzesRepository();
    const quizzes = await quizzesRepository.findAll();

    return res.json(quizzes);
  }

  async toggleStatus(req: Request, res: Response) {
    const { quizId } = req.params;
    const { isActive } = req.body;

    const quizzesRepository = new QuizzesRepository();
    await quizzesRepository.updateStatus(quizId as string, isActive);

    return res.status(200).send();
  }

  async createQuestion(req: Request, res: Response) {
    const { quizId } = req.params;
    const { statement, points, penalty, alternatives } = req.body;

    const quizzesRepository = new QuizzesRepository();
    const questionsRepository = new QuestionsRepository();
    const alternativesRepository = new AlternativesRepository();

    const service = new CreateQuestionService(
      quizzesRepository,
      questionsRepository,
      alternativesRepository
    );

    const question = await service.execute({
      quizId: quizId as string,
      statement,
      points,
      penalty,
      alternatives
    });

    return res.status(201).json(question);
  }

  async updateQuestion(req: Request, res: Response) {
    const { quizId, questionId } = req.params;
    const { statement, points, penalty, alternatives } = req.body;

    const quizzesRepository = new QuizzesRepository();
    const questionsRepository = new QuestionsRepository();
    const alternativesRepository = new AlternativesRepository();

    const service = new UpdateQuestionService(
      quizzesRepository,
      questionsRepository,
      alternativesRepository
    );

    const question = await service.execute({
      quizId: quizId as string,
      questionId: questionId as string,
      statement,
      points,
      penalty,
      alternatives
    });

    return res.status(200).json(question);
  }

  async listQuestions(req: Request, res: Response) {
    const { quizId } = req.params;

    const questionsRepository = new QuestionsRepository();
    const questions = await questionsRepository.listByQuiz(quizId as string);

    return res.json(questions);
  }

  /* ==========================
      ALUNO
  ========================== */

  async joinQuiz(req: any, res: Response) {
    const { quizId } = req.params;

    const quizzesRepository = new QuizzesRepository();
    const participantsRepository = new QuizParticipantsRepository();

    const service = new JoinQuizService(
      quizzesRepository,
      participantsRepository
    );

    await service.execute(
      quizId as string,
      req.user.id,
      req.user.role
    );

    return res.status(201).send();
  }

  async playQuiz(req: Request, res: Response) {
    const { quizId } = req.params;

    const questionsRepository = new QuestionsRepository();
    const questions = await questionsRepository.listByQuiz(quizId as string);

    return res.json(questions);
  }

  async answerQuestion(req: any, res: Response) {
    const { quizId, questionId } = req.params;
    const { alternativeId } = req.body;

    const answersRepository = new AnswersRepository();
    const questionsRepository = new QuestionsRepository();
    const alternativesRepository = new AlternativesRepository();
    const participantsRepository = new QuizParticipantsRepository();

    const service = new SubmitAnswerService(
      answersRepository,
      questionsRepository,
      alternativesRepository,
      participantsRepository
    );

    const result = await service.execute(
      quizId as string,
      questionId as string,
      alternativeId,
      req.user.id
    );

    return res.json(result);
  }

  async myScore(req: any, res: Response) {
    const { quizId } = req.params;

    const participantsRepository = new QuizParticipantsRepository();
    const service = new GetMyScoreService(participantsRepository);

    const score = await service.execute(
      quizId as string,
      req.user.id
    );

    return res.json(score);
  }

  async ranking(req: Request, res: Response) {
    const { quizId } = req.params;

    const participantsRepository = new QuizParticipantsRepository();
    const service = new GetRankingService(participantsRepository);

    const ranking = await service.execute(quizId as string);

    return res.json(ranking);
  }

  async topRanking(req: Request, res: Response) {
    const { quizId } = req.params;

    const participantsRepository = new QuizParticipantsRepository();
    const service = new GetRankingService(participantsRepository);

    const ranking = await service.execute(quizId as string);

    return res.json(ranking.slice(0, 3));
  }
}
