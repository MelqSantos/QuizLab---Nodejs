import { pool } from '../../../config/database';

interface ICreateAnswerDTO {
  questionId: string;
  userId: string;
  alternativeId: string;
}

export class AnswersRepository {

  async create({
    questionId,
    userId,
    alternativeId
  }: ICreateAnswerDTO) {

    await pool.query(
      `
      INSERT INTO answers (question_id, user_id, alternative_id)
      VALUES ($1, $2, $3)
      `,
      [questionId, userId, alternativeId]
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