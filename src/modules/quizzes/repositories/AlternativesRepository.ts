import { pool } from '../../../config/database';

interface IAlternative {
  text: string;
  isCorrect: boolean;
}

export class AlternativesRepository {

  async createMany(questionId: string, alternatives: IAlternative[]) {

    for (const alt of alternatives) {
      await pool.query(
        `
        INSERT INTO alternatives (question_id, text, is_correct)
        VALUES ($1, $2, $3)
        `,
        [questionId, alt.text, alt.isCorrect]
      );
    }
  }

  async findById(id: string) {
    const result = await pool.query(
      `
      SELECT *
      FROM alternatives
      WHERE id = $1
      `,
      [id]
    );

    return result.rows[0];
  }

  async listByQuestion(questionId: string) {
    const result = await pool.query(
      `
      SELECT id, text
      FROM alternatives
      WHERE question_id = $1
      `,
      [questionId]
    );

    return result.rows;
  }
}
