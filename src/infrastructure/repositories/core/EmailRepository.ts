import EmailRepository from '../../../domain/repositories/EmailRepository';
import nodeMailer from 'nodemailer';
import AppError from '../../../application/errors/error';
import constants from '../../config/constants';

const transport = nodeMailer.createTransport({
    service: 'gmail',
    auth: constants.emailAuth,
});

class EmailRepositoryImpl extends EmailRepository {
    private _generateCode(): string {
        const number = Math.floor((Math.random() * 999999));

        const numberStr = number.toString();

        let result = numberStr;

        for (let i = 0; i < 6 - numberStr.length; i++) {
            result = '0' + result;
        }

        return result;
    }

    async confirmEmail(email: string): Promise<string | AppError> {
        try {
            const code = this._generateCode(); 

            await transport.sendMail({
                from: 'Onjour Admininstration',
                to: email,
                subject: 'Confirmation code retrieve',
                text: `There's your confirmation code for OnJour email confirmation: ${code}`,
            });

            return code;
        } catch (e) {
            return new AppError({
                code: 'EmailConfirmationError',
                message: 'Something went wrong! Maybe, this email does not exist.'
            });
        }
    }
}

export default EmailRepositoryImpl;