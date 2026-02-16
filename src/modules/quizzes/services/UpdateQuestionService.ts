import { pool } from '../../../config/database';
import { AlternativesRepository } from '../repositories/AlternativesRepository';
import { QuestionsRepository } from '../repositories/QuestionsRepository';
import { QuizzesRepository } from '../repositories/QuizzesRepository';

interface IAlternative {
  text: string;
  isCorrect: boolean;
}

interface IRequest {
  quizId: string;
  questionId: string;
  statement: string;
  points: number;
  penalty: number;
  alternatives: IAlternative[];
}

export class UpdateQuestionService {
  constructor(
    private quizzesRepository: QuizzesRepository,
    private questionsRepository: QuestionsRepository,
    private alternativesRepository: AlternativesRepository
  ) {}

  async execute({ quizId, questionId, statement, points, penalty, alternatives }: IRequest) {
    const quiz = await this.quizzesRepository.findById(quizId);
    if (!quiz) {
      throw new Error('Quiz não encontrado');
    }

    const question = await this.questionsRepository.findById(questionId);
    if (!question) {
      throw new Error('Pergunta não encontrada');
    }

    if (question.quiz_id && question.quiz_id !== quizId) {
      throw new Error('Pergunta não pertence a esse quiz');
    }

    const client = await pool.connect();

    try {
      await client.query('BEGIN');

      const updatedQuestion = await this.questionsRepository.updateWithClient(
        client,
        questionId,
        statement,
        points,
        penalty
      );

      await this.alternativesRepository.deleteByQuestionWithClient(client, questionId);

      if (alternatives && alternatives.length > 0) {
        await this.alternativesRepository.createManyWithClient(client, questionId, alternatives);
      }

      await client.query('COMMIT');

      return updatedQuestion;
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
  }
}
