import { pool } from '../../../config/database';

export class QuizParticipantsRepository {

  async create(quizId: string, userId: string) {
    await pool.query(
      `
      INSERT INTO quiz_participants (quiz_id, user_id, total_score)
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
    // First, check if participant exists
    const participant = await this.findByQuizAndUser(quizId, userId);
    
    if (!participant) {
      // Create participant if doesn't exist
      await this.create(quizId, userId);
    }

    // Now update the score
    await pool.query(
      `
      UPDATE quiz_participants
      SET total_score = total_score + $1
      WHERE quiz_id = $2 AND user_id = $3
      `,
      [scoreChange, quizId, userId]
    );
  }

  async getRanking(quizId: string) {
    const result = await pool.query(
      `
      SELECT u.id, u.name, u.email, qp.total_score
      FROM quiz_participants qp
      JOIN users u ON u.id = qp.user_id
      WHERE qp.quiz_id = $1
      ORDER BY qp.total_score DESC
      `,
      [quizId]
    );

    return result.rows;
  }
}