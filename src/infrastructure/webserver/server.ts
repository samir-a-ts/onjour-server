import { Server } from 'ws';
import http from 'http';
import helmet from 'helmet';
import express from 'express';
import expressPinoLogger from 'express-pino-logger';
import { json, raw, text, urlencoded } from 'body-parser';
import environment from '../config/environment';
import constants from '../config/constants';
import apiRouter from '../../interfaces/routes/api/main';
import rateLimit from 'express-rate-limit';
import initWebSocket from './ws/main';

export const app = express();

const server = http.createServer(app);

export const webSocketServer = new Server({ server });

async function startServer() : Promise<void> {

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

  webSocketServer.on('connection', initWebSocket);

  app.use(expressPinoLogger({logger: constants.logger}));

  app.listen(environment.port, () => {
    constants.logger.info('Succesfully connected to localhost:' + environment.port);
  });
} 

export default startServer;