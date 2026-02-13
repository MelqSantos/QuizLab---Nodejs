import { QuizParticipantsRepository } from '../repositories/QuizParticipantsRepository';

export class GetRankingService {
  constructor(
    private participantsRepository: QuizParticipantsRepository
  ) {}

  async execute(quizId: string) {
    return this.participantsRepository.getRanking(quizId);
  }
}