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

const parsed = config.parsed;

export default {
  databases: {
    mongodbUri: parsed?.DB_URI
  },
  security: {
    jwtSecret: parsed?.JWT_SECRET,
  },
  emailAuth: {
    user: parsed?.EMAIL_USER,
    pass: parsed?.EMAIL_PASS
  },
  logger: pino({ prettyPrint: true, }),
} as Constants;
