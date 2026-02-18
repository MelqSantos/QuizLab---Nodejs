import { pool } from '../../../config/database';
import { AlternativesRepository } from '../repositories/AlternativesRepository';
import { QuestionsRepository } from '../repositories/QuestionsRepository';
import { QuizzesRepository } from '../repositories/QuizzesRepository';

interface IAlternative {
  text: string;
  is_correct: boolean;
}

interface IQuestionDTO {
  statement: string;
  points: number;
  penalty: number;
  alternatives: IAlternative[];
}

interface IRequest {
  quizId: string;
  questions: IQuestionDTO[];
}

export class ReplaceAllQuestionsService {
  constructor(
    private quizzesRepository: QuizzesRepository,
    private questionsRepository: QuestionsRepository,
    private alternativesRepository: AlternativesRepository
  ) {}

  async execute({ quizId, questions }: IRequest) {
    const quiz = await this.quizzesRepository.findById(quizId);
    if (!quiz) {
      throw new Error('Quiz não encontrado');
    }

    const client = await pool.connect();

    try {
      await client.query('BEGIN');

      // remove existing alternatives and questions for this quiz
      await this.questionsRepository.deleteByQuizWithClient(client, quizId);

      const createdQuestions: any[] = [];

      // create new questions and alternatives
      for (const q of questions) {
        const createdQ = await this.questionsRepository.createWithClient(
          client,
          quizId,
          q.statement,
          q.points,
          q.penalty
        );

        if (q.alternatives && q.alternatives.length > 0) {
          await this.alternativesRepository.createManyWithClient(client, createdQ.id, q.alternatives);
        }

        createdQuestions.push({ ...createdQ, alternatives: q.alternatives || [] });
      }

      await client.query('COMMIT');

      return createdQuestions;
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
  }
}
