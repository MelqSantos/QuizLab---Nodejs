import { pool } from '../../../config/database';

interface ICreateAnswerDTO {
  quizId: string;
  questionId: string;
  userId: string;
  alternativeId: string;
  isCorrect: boolean;
}

export class AnswersRepository {

  async create({
    quizId,
    questionId,
    userId,
    alternativeId,
    isCorrect
  }: ICreateAnswerDTO) {

    await pool.query(
      `
      INSERT INTO answers (quiz_id, question_id, user_id, alternative_id, is_correct)
      VALUES ($1, $2, $3, $4, $5)
      `,
      [quizId, questionId, userId, alternativeId, isCorrect]
    );
  }

  async findByQuestionAndUser(
    questionId: string,
    userId: string
  ) {
    const result = await pool.query(
      `
      SELECT *
      FROM answers
      WHERE question_id = $1 AND user_id = $2
      `,
      [questionId, userId]
    );

    return result.rows[0];
  }
}