import AppError from '../../application/errors/error';

abstract class EmailRepository {
    abstract confirmEmail(email: string): Promise<string | AppError>;
}

export default EmailRepository;