import { Socket } from 'socket.io';
import AppError from './../../application/errors/error';

abstract class UserRepository<User> {

  abstract register(user: User): Promise<string | AppError>;
  
  abstract signIn(email: string, password: string): Promise<string | AppError>;

  abstract updateOne(uid: string, newData: Record<string, unknown>): Promise<void | AppError>;

  abstract getOne(uid: string, app: Socket): void;

}

export default UserRepository;
