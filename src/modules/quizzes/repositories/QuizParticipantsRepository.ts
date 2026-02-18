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
      SELECT u.name as aluno, u.email, CONCAT(q.theme, ' - ', q.class_name) as revisao,  qp.total_score
      FROM quiz_participants qp
      JOIN users u ON u.id = qp.user_id
      join quizzes q on q.id = qp.quiz_id 
      WHERE qp.quiz_id = $1
	    order by qp.total_score desc;
      `,
      [quizId]
    );

    return result.rows;
  }
}