import { pool } from '../../../config/database';

export class QuizParticipantsRepository {

  async create(quizId: string, userId: string) {
    await pool.query(
      `
      INSERT INTO quiz_participants (quiz_id, user_id, score)
      VALUES ($1, $2, 0)
      `,
      [quizId, userId]
    );
  }

  async findByQuizAndUser(quizId: string, userId: string) {
    const result = await pool.query(
      `
      SELECT *
      FROM quiz_participants
      WHERE quiz_id = $1 AND user_id = $2
      `,
      [quizId, userId]
    );

    return result.rows[0];
  }

  async updateScore(
    quizId: string,
    userId: string,
    scoreChange: number
  ) {
    await pool.query(
      `
      UPDATE quiz_participants
      SET score = score + $1
      WHERE quiz_id = $2 AND user_id = $3
      `,
      [scoreChange, quizId, userId]
    );
  }

  async getRanking(quizId: string) {
    const result = await pool.query(
      `
      SELECT u.id, u.name, qp.score
      FROM quiz_participants qp
      JOIN users u ON u.id = qp.user_id
      WHERE qp.quiz_id = $1
      ORDER BY qp.score DESC
      `,
      [quizId]
    );

    return result.rows;
  }
}