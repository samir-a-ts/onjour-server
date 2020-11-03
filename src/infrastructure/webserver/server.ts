import helmet from 'helmet';
import express from 'express';
import expressPinoLogger from 'express-pino-logger';
import { json, raw, text, urlencoded } from 'body-parser';
import environment from '../config/environment';
import constants from '../config/constants';
import apiRouter, { configureInfo } from '../../interfaces/routes/api/main';
import rateLimit from 'express-rate-limit';
import io from 'socket.io';
import http from 'http';

const { logger } = constants;

export const app = express();

const server = http.createServer(app);

export const ws = io(server);

async function startServer() : Promise<void> {
  server.listen(environment.port, () => {
    logger.info('Succesfully connected to localhost:' + environment.port);
  });
 
  const apiLimiter = rateLimit({
    max: 100,
    windowMs: 15 * 60 * 1000,
  });

  /// Set up middleware
  app.use(json());
  app.use(raw());
  app.use(text());
  app.use(urlencoded({extended: true}));
  app.use(helmet());

  app.use('/api', apiLimiter);
  app.use('/api', apiRouter);

  app.use(expressPinoLogger({ logger }));

  configureInfo(ws);
} 

export default startServer;