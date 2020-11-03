import AppError from '../../../src/application/errors/error';
import School from '../school/School';
import { Socket } from 'socket.io';

abstract class SchoolRepository {
    abstract save(school: School): Promise<void | AppError>;

    abstract confirm(schoolUid: string): Promise<void | AppError>;

    abstract streamOne(schoolUid: string, app: Socket): Promise<void>;

    abstract streamAll(app: Socket): Promise<void>; 
}

export default SchoolRepository;
