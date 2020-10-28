import EmailRepository from '../../domain/repositories/EmailRepository';
import SchoolRepository from '../../../src/domain/repositories/SchoolRepository';
import SchoolRepositoryImpl from '../repositories/school/SchoolRepository';
import JwtAccessTokenManager from '../security/JwtAccessTokenManager';
import EmailRepositoryImpl from '../repositories/core/EmailRepository';

type ServiceLocator = {
    schoolRepository: SchoolRepository,
    jwtRepository: JwtAccessTokenManager,
    emailRepository: EmailRepository 
};

export default {
    jwtRepository: new JwtAccessTokenManager(),
    schoolRepository: new SchoolRepositoryImpl(),
    emailRepository: new EmailRepositoryImpl()
} as ServiceLocator;