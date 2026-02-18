import { pool } from '../../../config/database';
import { AlternativesRepository } from './AlternativesRepository';

interface ICreateQuestionDTO {
  quizId: string;
  statement: string;
  points: number;
  penalty: number;
}

export class QuestionsRepository {

  async create({
    quizId,
    statement,
    points,
    penalty
  }: ICreateQuestionDTO) {

    const result = await pool.query(
      `
      INSERT INTO questions (quiz_id, statement, points, penalty)
      VALUES ($1, $2, $3, $4)
      RETURNING *
      `,
      [quizId, statement, points, penalty]
    );

    return result.rows[0];
  }

  async findById(id: string) {
    const result = await pool.query(
      `
      SELECT *
      FROM questions
      WHERE id = $1
      `,
      [id]
    );

    return result.rows[0];
  }

  async listByQuiz(quizId: string) {
    const result = await pool.query(
      `
      SELECT *
      FROM questions
      WHERE quiz_id = $1
      ORDER BY created_at ASC
      `,
      [quizId]
    );

    const questions = result.rows;
    const alternativesRepo = new AlternativesRepository();

    const questionsWithAlternatives = await Promise.all(
      questions.map(async (q: any) => {
        const alts = await alternativesRepo.listByQuestion(q.id);
        return { ...q, alternatives: alts };
      })
    );

    return questionsWithAlternatives;
  }

  async updateWithClient(client: any, id: string, statement: string, points: number, penalty: number) {
    const hasUpdatedAt = await this.hasUpdatedAtColumn();

    if (hasUpdatedAt) {
      const result = await client.query(
        `
        UPDATE questions
        SET statement = $1, points = $2, penalty = $3, updated_at = NOW()
        WHERE id = $4
        RETURNING *
        `,
        [statement, points, penalty, id]
      );

      return result.rows[0];
    }

    const result = await client.query(
      `
      UPDATE questions
      SET statement = $1, points = $2, penalty = $3
      WHERE id = $4
      RETURNING *
      `,
      [statement, points, penalty, id]
    );

    return result.rows[0];
  }

  async createWithClient(client: any, quizId: string, statement: string, points: number, penalty: number) {
    const result = await client.query(
      `
      INSERT INTO questions (quiz_id, statement, points, penalty)
      VALUES ($1, $2, $3, $4)
      RETURNING *
      `,
      [quizId, statement, points, penalty]
    );

    return result.rows[0];
  }

  async deleteByQuizWithClient(client: any, quizId: string) {
    await client.query(
      `DELETE FROM alternatives WHERE question_id IN (SELECT id FROM questions WHERE quiz_id = $1)`,
      [quizId]
    );

    await client.query(
      `DELETE FROM questions WHERE quiz_id = $1`,
      [quizId]
    );
  }

  private async hasUpdatedAtColumn(): Promise<boolean> {
    const result = await pool.query(
      `
      SELECT column_name
      FROM information_schema.columns
      WHERE table_name = 'questions' AND column_name = 'updated_at'
      `
    );

    return result.rowCount > 0;
  }
}