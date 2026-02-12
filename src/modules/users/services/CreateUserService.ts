import bcrypt from 'bcrypt';
import { UsersRepository } from '../repositories/UsersRepository';
import { CreateUserDTO } from '../dtos/CreateUserDTO';
import { UserRole } from '../enums/UserRole';

export class CreateUserService {
  private usersRepository = new UsersRepository();

  async execute({ name, email, password, role }: CreateUserDTO) {
    const emailAlreadyExists = await this.usersRepository.findByEmail(email);

    if (emailAlreadyExists) {
      throw new Error('Email already registered');
    }

    if (!Object.values(UserRole).includes(role)) {
      throw new Error('Invalid user role');
    }

    const password_hash = await bcrypt.hash(password, 10);

    const user = await this.usersRepository.create({
      name,
      email,
      password_hash,
      role
    });

    // nunca retornar password_hash
    const { password_hash: _, ...userWithoutPassword } = user;

    return userWithoutPassword;
  }
}