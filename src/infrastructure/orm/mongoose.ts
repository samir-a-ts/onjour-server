import mongoose, { Connection, Mongoose } from 'mongoose';

import constants from '../config/constants';

import env from '../config/environment';

const { logger } = constants;

function handleEvents(connection: Connection) {
  connection.on('error', () => {
    logger.error('Cannot connect to MongoDB via Mongoose?!');
  });

  connection.once('open', () => {
    logger.info('Connected to MongoDB!');
  });
}

export default async function initialiseDB(): Promise<Mongoose> {
  const connection = mongoose.connection;  
  
  handleEvents(connection);

  await mongoose.connect(env.database.url, env.database.databaseConfig);

  return mongoose;
}
