import EmailRepository from '../../domain/repositories/EmailRepository';
import SchoolRepository from '../../../src/domain/repositories/SchoolRepository';
import SchoolRepositoryImpl from '../repositories/school/SchoolRepository';
import DirectorRepositoryImpl from '../repositories/users/DirectorRepository';
import EmailRepositoryImpl from '../repositories/core/EmailRepository';
import UserRepository from '../../domain/repositories/UserRepository';
import Director from '../../domain/users/Director';

type ServiceLocator = {
    schoolRepository: SchoolRepository,
    emailRepository: EmailRepository,
    directorRepository: UserRepository<Director>, 
};

export default {
    schoolRepository: new SchoolRepositoryImpl(),
    emailRepository: new EmailRepositoryImpl(),
    directorRepository: new DirectorRepositoryImpl(),
} as ServiceLocator;