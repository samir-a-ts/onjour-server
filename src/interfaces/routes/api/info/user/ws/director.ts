import DirectorInfoController from '../../../../../controllers/api/info/user/DirectorController';
import { Server } from 'socket.io';

export default (ws: Server): void => {
    ws
        .of('/api/info/user/director/get')
        .on('connection', socket => {
            socket.on('req-data', data => {
                DirectorInfoController.get(socket, data);
            });
        });
};