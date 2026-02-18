import { pool } from '../../../config/database';

interface IAlternative {
  text: string;
  is_correct: boolean;
}

export class AlternativesRepository {

  private async resolveTextColumn(): Promise<string> {
    const candidates = ['description', 'text', 'content', 'label', 'title'];
    const result = await pool.query(
      `
      SELECT column_name
      FROM information_schema.columns
      WHERE table_name = 'alternatives'
      `
    );

    const cols = result.rows.map((r: any) => r.column_name);
    for (const c of candidates) {
      if (cols.includes(c)) return c;
    }

    throw new Error('Nenhuma coluna de texto encontrada na tabela alternatives');
  }

  async createMany(questionId: string, alternatives: IAlternative[]) {
    const textColumn = await this.resolveTextColumn();

    for (const alt of alternatives) {
      const query = `INSERT INTO alternatives (question_id, ${textColumn}, is_correct) VALUES ($1, $2, $3)`;
      await pool.query(query, [questionId, alt.text, alt.is_correct]);
    }
  }

  async deleteByQuestion(questionId: string) {
    await pool.query(
      `
      DELETE FROM alternatives
      WHERE question_id = $1
      `,
      [questionId]
    );
  }

  async createManyWithClient(client: any, questionId: string, alternatives: IAlternative[]) {
    const textColumn = await this.resolveTextColumn();

    for (const alt of alternatives) {
      const query = `INSERT INTO alternatives (question_id, ${textColumn}, is_correct) VALUES ($1, $2, $3)`;
      await client.query(query, [questionId, alt.text, alt.is_correct]);
    }
  }

  async deleteByQuestionWithClient(client: any, questionId: string) {
    await client.query(`DELETE FROM alternatives WHERE question_id = $1`, [questionId]);
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
    const textColumn = await this.resolveTextColumn();
    const result = await pool.query(
      `
      SELECT id, ${textColumn} AS text, is_correct
      FROM alternatives
      WHERE question_id = $1
      `,
      [questionId]
    );

    return result.rows.map((r: any) => ({
      id: r.id,
      text: r.text,
      is_correct: r.is_correct
    }));
  }
}
