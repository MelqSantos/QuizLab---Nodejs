import { AlternativesRepository } from '../repositories/AlternativesRepository';
import { QuestionsRepository } from '../repositories/QuestionsRepository';
import { QuizzesRepository } from '../repositories/QuizzesRepository';

interface IAlternative {
  text: string;
  isCorrect: boolean;
}

interface IRequest {
  quizId: string;
  statement: string;
  points: number;
  penalty: number;
  alternatives: IAlternative[];
}

export class CreateQuestionService {
  constructor(
    private quizzesRepository: QuizzesRepository,
    private questionsRepository: QuestionsRepository,
    private alternativesRepository: AlternativesRepository
  ) {}

  async execute({
    quizId,
    statement,
    points,
    penalty,
    alternatives
  }: IRequest) {

    const quiz = await this.quizzesRepository.findById(quizId);
    if (!quiz) {
      throw new Error('Quiz não encontrado');
    }

    const hasCorrect = alternatives.some(a => a.isCorrect);
    if (!hasCorrect) {
      throw new Error('Deve haver ao menos uma alternativa correta');
    }

    const question = await this.questionsRepository.create({
      quizId,
      statement,
      points,
      penalty
    });

    await this.alternativesRepository.createMany(
      question.id,
      alternatives
    );

    return question;
  }
}
