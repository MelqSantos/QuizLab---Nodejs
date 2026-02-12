import { UsersRepository } from '../repositories/UsersRepository';

export class ListUsersService {
  private usersRepository = new UsersRepository();

  async execute() {
    return this.usersRepository.findAll();
  }
}