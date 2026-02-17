import { QuizParticipantsRepository } from '../repositories/QuizParticipantsRepository';

export class GetMyScoreService {
  constructor(
    private participantsRepository: QuizParticipantsRepository
  ) {}

  async execute(quizId: string, userId: string) {

    const participant =
      await this.participantsRepository.findByQuizAndUser(quizId, userId);

    if (!participant) {
      throw new Error('Aluno não está participando do quiz');
    }

    return {
      score: participant.total_score
    };
  }
}