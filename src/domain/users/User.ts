import { Document } from 'mongoose';
import { v4 as generateUid } from 'uuid';

export type UserParams = {
  name: string, 
  surname: string,
  patronymic: string,
  email: string,
  password: string,
  uid: string,
  title: UserTitle,
  schoolUid: string,
};

export type UserTitle = 'director' | 'student' | 'assistant' | 'teacher' | 'parent';

abstract class User {
  name: string;
  surname: string;
  patronymic: string;
  email: string;
  password: string;
  uid: string;
  title: string;
  schoolUid: string;

  constructor({ name, surname, patronymic, email, password, uid, title, schoolUid }: UserParams) {
    this.name = name;
    this.surname = surname;
    this.patronymic = patronymic;
    this.email = email;
    this.password = password;
    this.uid = uid ?? generateUid();
    this.title = title;
    this.schoolUid = schoolUid;
  }

  abstract toSchema(): Document;

  abstract toJSON(): Record<string, unknown>;
}


export default User;