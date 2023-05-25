// src/infrastructure/repositories/mysqlUserRepository.ts

import mysql from 'mysql2/promise';
import { Pool, RowDataPacket, ResultSetHeader } from 'mysql2/promise';
import { UserRepository } from '../../domain/repositories/userRepository';
import { User } from '../../domain/entity';

export class MysqlUserRepository implements UserRepository {
  private pool: Pool;

  constructor() {
    this.pool = mysql.createPool({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE
    });
  }

  async createUser(user: User): Promise<User> {
    const connection = await this.pool.getConnection();
    try {
      const [result] = await connection.query<ResultSetHeader>(
        'INSERT INTO users (name, email) VALUES (?, ?)',
        [user.name, user.email]
      );

      user.id = result.insertId;

      return user;
    } finally {
      connection.release();
    }
  }

  async getUserById(id: number): Promise<User | null> {
    const connection = await this.pool.getConnection();
    try {
      const [result] = await connection.query<RowDataPacket[]>(
        'SELECT * FROM users WHERE id = ?',
        [id]
      );

      if (result.length === 0) {
        return null;
      }

      const user: User = {
        id: result[0].id,
        name: result[0].name,
        email: result[0].email
      };

      return user;
    } finally {
      connection.release();
    }
  }

  async getAllUsers(): Promise<User[]> {
    const connection = await this.pool.getConnection();
    try {
      const [result] = await connection.query<RowDataPacket[]>(
        'SELECT * FROM users'
      );

      const users: User[] = result.map((row: RowDataPacket) => ({
        id: row.id,
        name: row.name,
        email: row.email
      }));

      return users;
    } finally {
      connection.release();
    }
  }

  async updateUser(user: User): Promise<User | null> {
    const connection = await this.pool.getConnection();
    try {
      const [result] = await connection.query<ResultSetHeader>(
        'UPDATE users SET name = ?, email = ? WHERE id = ?',
        [user.name, user.email, user.id]
      );

      if (result.affectedRows === 0) {
        return null;
      }

      return user;
    } finally {
      connection.release();
    }
  }

  async deleteUser(id: number): Promise<boolean> {
    const connection = await this.pool.getConnection();
    try {
      const [result] = await connection.query<ResultSetHeader>(
        'DELETE FROM users WHERE id = ?',
        [id]
      );

      return result.affectedRows > 0;
    } finally {
      connection.release();
    }
  }
}

