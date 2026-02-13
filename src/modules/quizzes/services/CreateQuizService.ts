import { QuizzesRepository } from '../repositories/QuizzesRepository';

interface IRequest {
  title: string;
  className: string;
  theme: string;
  createdBy: string;
  role: string;
}

export class CreateQuizService {
  constructor(private quizzesRepository: QuizzesRepository) {}

  async execute({ title, className, theme, createdBy, role }: IRequest) {
    if (role !== 'PROFESSOR') {
      throw new Error('Apenas professor pode criar quiz');
    }

    return this.quizzesRepository.create({
      title,
      className,
      theme,
      createdBy
    });
  }
}