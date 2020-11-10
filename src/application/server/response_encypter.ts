import { Response } from 'express';
import { Socket } from 'socket.io';
import coder from '../../infrastructure/webserver/security/main';

export function webSocketResponse(data: Record<string, unknown>, event: string, app: Socket): void {
    const dataStr = JSON.stringify(data);

    const encypted = coder.encrypt(dataStr, 'base64');

    const response = { 'response': encypted };

    app.emit(event, response);
}

export function response(data: Record<string, unknown>, res: Response): void {
    const dataStr = JSON.stringify(data);

    const encypted = coder.encrypt(dataStr, 'base64');

    const response = { 'response': encypted };

    res.send(response);
}