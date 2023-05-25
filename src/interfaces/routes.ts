// src/interfaces/routes.ts

import { Router } from 'express';
import { UserController } from './controllers/userController';
import { UserRepository } from '../domain/repositories/userRepository';
import { MysqlUserRepository } from '../infrastructure/repositories/mysqlUserRepository';

const router = Router();
const userRepository: UserRepository = new MysqlUserRepository();
const userController = new UserController(userRepository);

router.post('/users', userController.createUser.bind(userController));
router.get('/users/:id', userController.getUserById.bind(userController));
router.get('/users', userController.getAllUsers.bind(userController));
router.put('/users/:id', userController.updateUser.bind(userController));
router.delete('/users/:id', userController.deleteUser.bind(userController));

export default router;
