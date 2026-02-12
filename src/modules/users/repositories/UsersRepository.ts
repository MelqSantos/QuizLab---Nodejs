import { pool } from '../../../config/database';
import { UserRole } from '../enums/UserRole';

export interface User {
  id: string;
  name: string;
  email: string;
  password_hash: string;
  role: UserRole;
  created_at: Date;
}

export class UsersRepository {
  async create(data: {
    name: string;
    email: string;
    password_hash: string;
    role: UserRole;
  }): Promise<User> {
    const query = `
      INSERT INTO users (name, email, password_hash, role)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `;

    const values = [
      data.name,
      data.email,
      data.password_hash,
      data.role
    ];

    const { rows } = await pool.query(query, values);
    return rows[0];
  }

  async findByEmail(email: string): Promise<User | undefined> {
    const { rows } = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );

    return rows[0];
  }

  async findAll(): Promise<User[]> {
    const { rows } = await pool.query(
      'SELECT id, name, email, role, created_at FROM users'
    );

    return rows;
  }
}