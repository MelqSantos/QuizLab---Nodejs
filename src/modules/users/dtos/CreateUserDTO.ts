import { UserRole } from '../enums/UserRole';

export interface CreateUserDTO {
  name: string;
  email: string;
  password: string;
  role: UserRole;
}