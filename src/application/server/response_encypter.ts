import { Response } from 'express';
import { Socket } from 'socket.io';
import coder from '../../infrastructure/webserver/security/main';
import constants from '../../infrastructure/config/constants';

const { logger } = constants;

export function webSocketResponse(data: Record<string, unknown>, event: string, app: Socket): void {
    const dataStr = JSON.stringify(data);

    logger.info(`WS Response! -> ${dataStr}`);

    const encypted = coder.encrypt(dataStr, 'base64');

    const response = { 'response': encypted };

    app.emit(event, response);
}

export function response(data: Record<string, unknown>, res: Response): void {
    const dataStr = JSON.stringify(data);
    
    logger.info(`Response! -> ${dataStr}`);

    const encypted = coder.encrypt(dataStr, 'base64');

    const response = { 'response': encypted };

    res.send(response);
}