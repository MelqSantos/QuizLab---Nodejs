import { pool } from '../../../config/database';

export class ParticipantsRepository {
  async join(quizId: string, userId: string) {
    await pool.query(
      `INSERT INTO quiz_participants (quiz_id, user_id)
       VALUES ($1,$2)
       ON CONFLICT DO NOTHING`,
      [quizId, userId]
    );
  }

  async updateScore(
    quizId: string,
    userId: string,
    points: number
  ) {
    await pool.query(
      `UPDATE quiz_participants
       SET total_score = total_score + $1
       WHERE quiz_id = $2 AND user_id = $3`,
      [points, quizId, userId]
    );
  }

  async getMyScore(quizId: string, userId: string) {
    const { rows } = await pool.query(
      `SELECT total_score
       FROM quiz_participants
       WHERE quiz_id = $1 AND user_id = $2`,
      [quizId, userId]
    );

    return rows[0];
  }

  async ranking(quizId: string, limit?: number) {
    const query = `
      SELECT u.name, qp.total_score
      FROM quiz_participants qp
      JOIN users u ON u.id = qp.user_id
      WHERE qp.quiz_id = $1
      ORDER BY qp.total_score DESC
      ${limit ? `LIMIT ${limit}` : ''}
    `;

    const { rows } = await pool.query(query, [quizId]);
    return rows;
  }
}
