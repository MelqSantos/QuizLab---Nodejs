import { pool } from '../../../config/database';

interface ICreateQuizDTO {
  title: string;
  className: string;
  theme: string;
  createdBy: string;
}

export class QuizzesRepository {

  async create({
    title,
    className,
    theme,
    createdBy
  }: ICreateQuizDTO) {

    const result = await pool.query(
      `
      INSERT INTO quizzes (title, class_name, theme, created_by, is_active)
      VALUES ($1, $2, $3, $4, false)
      RETURNING *
      `,
      [title, className, theme, createdBy]
    );

    return result.rows[0];
  }

  async findAll() {
    const result = await pool.query(
      `SELECT u.id, u.name as author, q.id, q.title, q.class_name, q.theme, q.created_by, q.is_active, q.created_at 
      FROM quizzes q
      JOIN users u ON u.id = q.created_by
      WHERE q.created_by = u.id`
    );

    return result.rows;
  }

  async findById(id: string) {
    const result = await pool.query(
      `SELECT * FROM quizzes WHERE id = $1`,
      [id]
    );

    return result.rows[0];
  }

  async findByProfessor(professorId: string) {
    const result = await pool.query(
      `
      SELECT *
      FROM quizzes
      WHERE created_by = $1
      ORDER BY created_at DESC
      `,
      [professorId]
    );

    return result.rows;
  }

  async updateStatus(quizId: string, isActive: boolean) {
    await pool.query(
      `
      UPDATE quizzes
      SET is_active = $1
      WHERE id = $2
      `,
      [isActive, quizId]
    );
  }
}