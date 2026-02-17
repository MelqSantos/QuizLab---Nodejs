import { AnswersRepository } from '../repositories/AnswersRepository';
import { QuestionsRepository } from '../repositories/QuestionsRepository';
import { AlternativesRepository } from '../repositories/AlternativesRepository';
import { QuizParticipantsRepository } from '../repositories/QuizParticipantsRepository';

export class SubmitAnswerService {
  constructor(
    private answersRepository: AnswersRepository,
    private questionsRepository: QuestionsRepository,
    private alternativesRepository: AlternativesRepository,
    private participantsRepository: QuizParticipantsRepository
  ) {}

  async execute(
    quizId: string,
    questionId: string,
    alternativeId: string,
    userId: string
  ) {

    const alreadyAnswered =
      await this.answersRepository.findByQuestionAndUser(questionId, userId);

    if (alreadyAnswered) {
      throw new Error('Pergunta já respondida');
    }

    const question = await this.questionsRepository.findById(questionId);
    if (!question) {
      throw new Error('Pergunta não encontrada');
    }

    const alternative =
      await this.alternativesRepository.findById(alternativeId);

    if (!alternative) {
      throw new Error('Alternativa inválida');
    }

    const scoreChange = alternative.is_correct
      ? question.points
      : -question.penalty;

    await this.answersRepository.create({
      quizId,
      questionId,
      userId,
      alternativeId,
      isCorrect: alternative.is_correct
    });

    await this.participantsRepository.updateScore(
      quizId,
      userId,
      scoreChange
    );

    return {
      correct: alternative.is_correct,
      scoreChange
    };
  }
}