import { QuizParticipantsRepository } from '../repositories/QuizParticipantsRepository';
import { QuizzesRepository } from '../repositories/QuizzesRepository';

export class JoinQuizService {
  constructor(
    private quizzesRepository: QuizzesRepository,
    private participantsRepository: QuizParticipantsRepository
  ) {}

  async execute(quizId: string, userId: string, role: string) {

    if (role !== 'ALUNO') {
      throw new Error('Apenas alunos podem entrar no quiz');
    }

    const quiz = await this.quizzesRepository.findById(quizId);
    if (!quiz || !quiz.is_active) {
      throw new Error('Quiz não está ativo');
    }

    const alreadyJoined =
      await this.participantsRepository.findByQuizAndUser(quizId, userId);

    if (alreadyJoined) {
      throw new Error('Aluno já entrou nesse quiz');
    }

    await this.participantsRepository.create(quizId, userId);
  }
}