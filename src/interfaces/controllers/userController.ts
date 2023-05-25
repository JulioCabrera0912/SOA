// src/interfaces/controllers/userController.ts

import { Request, Response } from 'express';
import { UserRepository } from '../../domain/repositories/userRepository';
import { User } from '../../domain/entity';

export class UserController {
  private userRepository: UserRepository;

  constructor(userRepository: UserRepository) {
    this.userRepository = userRepository;
  }

  createUser(req: Request, res: Response): void {
    const { name, email } = req.body;

    const user: User = {
      id: 0,
      name,
      email
    };

    this.userRepository
      .createUser(user)
      .then((createdUser: User) => {
        res.json(createdUser);
      })
      .catch((error: Error) => {
        res.status(500).json({ error: error.message });
      });
  }

  getUserById(req: Request, res: Response): void {
    const userId: number = parseInt(req.params.id);

    this.userRepository
      .getUserById(userId)
      .then((user: User | null) => {
        if (user) {
          res.json(user);
        } else {
          res.status(404).json({ error: 'User not found' });
        }
      })
      .catch((error: Error) => {
        res.status(500).json({ error: error.message });
      });
  }

  getAllUsers(req: Request, res: Response): void {
    this.userRepository
      .getAllUsers()
      .then((users: User[]) => {
        res.json(users);
      })
      .catch((error: Error) => {
        res.status(500).json({ error: error.message });
      });
  }

  updateUser(req: Request, res: Response): void {
    const userId: number = parseInt(req.params.id);
    const { name, email } = req.body;

    const updatedUser: User = {
      id: userId,
      name,
      email
    };

    this.userRepository
      .updateUser(updatedUser)
      .then((user: User | null) => {
        if (user) {
          res.json(user);
        } else {
          res.status(404).json({ error: 'User not found' });
        }
      })
      .catch((error: Error) => {
        res.status(500).json({ error: error.message });
      });
  }

  deleteUser(req: Request, res: Response): void {
    const userId: number = parseInt(req.params.id);

    this.userRepository
      .deleteUser(userId)
      .then((result: boolean) => {
        if (result) {
          res.json({ message: 'User deleted successfully' });
        } else {
          res.status(404).json({ error: 'User not found' });
        }
      })
      .catch((error: Error) => {
        res.status(500).json({ error: error.message });
      });
  }
}
