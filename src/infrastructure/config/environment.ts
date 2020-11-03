import { AuthenticationType } from 'nodemailer/lib/smtp-connection';
import { SessionOptions } from 'express-session';
import { MongoClientOptions } from 'mongodb';
import constants  from './constants';

/**
 * This module centralize all the environment variables of the application. Thanks to this module, there MUST NOT be any
 * `process.env` instruction in any other file or module.
 */

type Environment = {
  port: number,
  database: {
    url: string,
    databaseConfig: MongoClientOptions,
  },
  session: SessionOptions,
  security: {
    jwtSecret: string,
  },
  emailAuth: AuthenticationType,
};

const environment = {
  port: 3000,
  database: {
    url: constants.databases.mongodbUri,
    databaseConfig: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      replicaSet: 'rs',
    },
  },
  session: {
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 365 * 10 // 10 years,
    },
  },
  security: {
    jwtSecret: constants.security.jwtSecret,
  },
  emailAuth: constants.emailAuth,
} as Environment;

export default environment;