import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { UsersRepository } from '../repositories/UsersRepository';
import { LoginDTO } from '../dtos/LoginDTO';

interface AuthResponse {
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
  token: string;
}

export class AuthenticateUserService {
  private usersRepository = new UsersRepository();

  async execute({ email, password }: LoginDTO): Promise<AuthResponse> {
    const user = await this.usersRepository.findByEmail(email);

    if (!user) {
      throw new Error('Invalid email or password');
    }

    const passwordMatch = await bcrypt.compare(
      password,
      user.password_hash
    );

    if (!passwordMatch) {
      throw new Error('Invalid email or password');
    }

    const token = jwt.sign(
      {
        role: user.role
      },
      process.env.JWT_SECRET as string,
      {
        subject: user.id,
        expiresIn: '1d'
      }
    );

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      },
      token
    };
  }
}
