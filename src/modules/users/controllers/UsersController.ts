import { Request, Response } from 'express';
import { CreateUserService } from '../services/CreateUserService';
import { ListUsersService } from '../services/ListUsersService';

export class UsersController {
  async create(req: Request, res: Response) {
    try {
      const { name, email, password, role } = req.body;

      const service = new CreateUserService();
      const user = await service.execute({
        name,
        email,
        password,
        role
      });

      return res.status(201).json(user);
    } catch (error: any) {
      return res.status(400).json({ message: error.message });
    }
  }

  async list(req: Request, res: Response) {
    const service = new ListUsersService();
    const users = await service.execute();

    return res.json(users);
  }
}