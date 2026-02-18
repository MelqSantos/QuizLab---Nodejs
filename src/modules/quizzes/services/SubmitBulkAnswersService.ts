import { pool } from '../../../config/database';
import { AnswersRepository } from '../repositories/AnswersRepository';
import { QuestionsRepository } from '../repositories/QuestionsRepository';
import { AlternativesRepository } from '../repositories/AlternativesRepository';
import { QuizParticipantsRepository } from '../repositories/QuizParticipantsRepository';

interface IAnswerDTO {
  questionId: string;
  alternativeId: string;
  alternativeText: string;
}

interface IRequest {
  quizId: string;
  answers: IAnswerDTO[];
  userId: string;
}

export class SubmitBulkAnswersService {
  constructor(
    private answersRepository: AnswersRepository,
    private questionsRepository: QuestionsRepository,
    private alternativesRepository: AlternativesRepository,
    private participantsRepository: QuizParticipantsRepository
  ) {}

  async execute({ quizId, answers, userId }: IRequest) {
    const client = await pool.connect();

    try {
      await client.query('BEGIN');

      let totalScoreChange = 0;
      const results: any[] = [];
      const errors: any[] = [];

      for (const answer of answers) {
        const { questionId, alternativeId, alternativeText } = answer;

        try {
          // Check if already answered
          const alreadyAnswered = await this.answersRepository.findByQuestionAndUser(
            questionId,
            userId
          );

          if (alreadyAnswered) {
            errors.push({
              questionId,
              alternativeId,
              error: 'Pergunta já foi respondida',
              status: 'ALREADY_ANSWERED'
            });
            continue;
          }

          // Get question
          const question = await this.questionsRepository.findById(questionId);
          if (!question) {
            errors.push({
              questionId,
              alternativeId,
              error: 'Pergunta não encontrada',
              status: 'QUESTION_NOT_FOUND'
            });
            continue;
          }

          if (question.quiz_id !== quizId) {
            errors.push({
              questionId,
              alternativeId,
              error: 'Pergunta não pertence a este quiz',
              status: 'INVALID_QUIZ'
            });
            continue;
          }

          // Get alternative
          const alternative = await this.alternativesRepository.findById(alternativeId);
          if (!alternative) {
            errors.push({
              questionId,
              alternativeId,
              error: 'Alternativa inválida',
              status: 'INVALID_ALTERNATIVE'
            });
            continue;
          }

          // Calculate score change
          const scoreChange = alternative.is_correct
            ? question.points
            : -question.penalty;

          // Insert answer
          await client.query(
            `
            INSERT INTO answers (quiz_id, question_id, user_id, alternative_id, is_correct)
            VALUES ($1, $2, $3, $4, $5)
            `,
            [quizId, questionId, userId, alternativeId, alternative.is_correct]
          );

          totalScoreChange += scoreChange;

          results.push({
            questionId,
            alternativeId,
            alternativeText,
            correct: alternative.is_correct,
            scoreChange,
            status: 'SUCCESS'
          });
        } catch (itemError: any) {
          errors.push({
            questionId,
            alternativeId,
            error: itemError.message,
            status: 'ERROR'
          });
        }
      }

      // Only update score if there are successful answers
      if (results.length > 0) {
        await this.participantsRepository.updateScore(
          quizId,
          userId,
          totalScoreChange
        );
      }

      await client.query('COMMIT');

      return {
        totalScoreChange,
        successCount: results.length,
        errorCount: errors.length,
        answers: results,
        errors: errors.length > 0 ? errors : undefined
      };
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
  }
}
