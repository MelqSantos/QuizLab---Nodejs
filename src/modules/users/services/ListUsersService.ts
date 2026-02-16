import { UsersRepository } from '../repositories/UsersRepository';

export class ListUsersService {
  private usersRepository = new UsersRepository();

  async execute() {
    return this.usersRepository.findAll();
  }

  async getById(id: string) {
    return this.usersRepository.findById(id);
  }
}