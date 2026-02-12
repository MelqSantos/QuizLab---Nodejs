import express, { Application, Request, Response } from 'express';
import dotenv from 'dotenv';
import { connectDatabase } from './config/database';
import { routes } from './routes';

const app: Application = express();
dotenv.config();

app.use(express.json());

app.use(routes);

const startServer = async () => {
  await connectDatabase();

  app.listen(process.env.PORT, () => {
    console.log(`Servidor rodando em http://localhost:${process.env.PORT}`);
  });
};

startServer();
