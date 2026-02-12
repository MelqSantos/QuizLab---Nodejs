import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

export const pool = new Pool({
  host: process.env.DATABASE_HOST,
  port: Number(process.env.DATABASE_PORT),
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  ssl: false // colocar true se usar banco em nuvem
});

// Teste de conexão
export const connectDatabase = async (): Promise<void> => {
  try {
    const client = await pool.connect();
    console.log('✅ Banco de dados conectado com sucesso');
    client.release();
  } catch (error) {
    console.error('Erro ao conectar no banco:', error);
    process.exit(1);
  }
};
