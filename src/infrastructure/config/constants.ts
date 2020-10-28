import dotEnv from 'dotenv';
import pino, { Logger } from 'pino';
import { AuthenticationType } from 'nodemailer/lib/smtp-connection';

type Constants = {
  databases: {
    mongodbUri: string,
  },
  security: {
    jwtSecret: string,
  },
  emailAuth: AuthenticationType,
  logger: Logger,
};

const config = dotEnv.config();

export default {
  databases: {
    mongodbUri: config.parsed?.DB_URI
  },
  security: {
    jwtSecret: config.parsed?.JWT_SECRET,
  },
  emailAuth: {
    user: config.parsed?.EMAIL_USER,
    pass: config.parsed?.EMAIL_PASS
  },
  logger: pino({ prettyPrint: true, }),
} as Constants;
