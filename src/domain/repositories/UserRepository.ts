import AppError from './../../application/errors/error';

abstract class UserRepository<User> {

  abstract saveOne(user: User): Promise<void | AppError>;

  abstract saveMany(users: User[]): Promise<void | AppError>;

  abstract updateOne(uid: string, newUser: User): Promise<void | AppError>;

  abstract updateMany(uids: string[], newUsers: User[]): Promise<void | AppError>;

  abstract getOne(uid: string): Promise<User | AppError>;

  abstract getOneByEmail(email: string): Promise<User | AppError>;

  abstract getMany(uids: string[]): Promise<User[] | AppError>;

  abstract getManyByEmail(emails: string[]): Promise<User[] | AppError>;
}

export default UserRepository;
