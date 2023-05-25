// src/domain/repositories/userRepository.ts

import { User } from '../entity';

export interface UserRepository {
  createUser(user: User): Promise<User>;
  getUserById(id: number): Promise<User | null>;
  getAllUsers(): Promise<User[]>;
  updateUser(user: User): Promise<User | null>;
  deleteUser(id: number): Promise<boolean>;
}
