import { Document } from 'mongoose';
import DirectorSchema from '../../infrastructure/orm/schemas/users/director_schema';
import User, { UserParams, UserTitle } from './User';

class Director extends User {
    constructor(
        params:
        UserParams) {
        const newParams = params;

        newParams.title = 'director';

        super(params);
    }

    copyWith({ name, surname, patronymic, email, password, schoolUid }: Record<string, unknown>): Director {
        return new Director({
            name: name as string ?? this.name ,
            surname: surname as string ?? this.surname,
            patronymic: patronymic as string ?? this.patronymic,
            email: email as string ?? this.email,
            password: password as string ?? this.password,
            schoolUid: schoolUid as string ?? this.schoolUid,
            title: this.title as UserTitle,
            uid: this.uid,
        });
    } 

   toSchema(): Document {
        return new DirectorSchema(this.toJSON());
    }

    toJSON(): Record<string, unknown> {
        return {
            'name': this.name,
            'surname': this.surname,
            'patronymic': this.patronymic,
            'email': this.email,
            'password': this.password,
            'uid': this.uid,
            'title': 'director',
            'schoolUid': this.schoolUid, 
        };
    }

    static fromJSON(json: Record<string, unknown>): Director {
        return new Director({
            email: json['email'] as string,
            password: json['password'] as string,
            name: json['name'] as string,
            patronymic: json['patronymic'] as string,
            surname: json['surname'] as string,
            title: json['title'] as UserTitle,
            uid: json['uid'] as string,
            schoolUid: json['schoolUid'] as string,
        });
    }
}

export default Director;