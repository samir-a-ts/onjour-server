import AppError from '../../../src/application/errors/error';
import School from '../school/School';
import WebSocket from 'ws';

abstract class SchoolRepository {
    abstract save(school: School): Promise<void | AppError>;

    abstract confirm(schoolUid: string): Promise<void | AppError>;

    abstract getOneStream(schoolUid: string, clients: WebSocket[]): Promise<void>;

    abstract getAllStream(clients: WebSocket[]): Promise<void>; 
}

export default SchoolRepository;
