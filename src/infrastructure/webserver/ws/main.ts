import AppError from '../../../application/errors/error';
import { Server } from 'ws';
import { webSocketServer } from '../server';

function initWebSocket(ws: Server): void  {

    ws.on('error', e => {
        webSocketServer.clients.forEach(client => client.send(
              new AppError({
                  code: e.name,
                  message: e.message,
              })
              .toJSON()
            )
        );
    });

    ws.on('message', message => {
        console.log(message);
    });
}

export default initWebSocket; 