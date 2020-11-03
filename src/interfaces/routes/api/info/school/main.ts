import SchoolInfoController from '../../../../controllers/api/info/school/SchoolController';
import { Server } from 'socket.io';

export default (ws: Server): void => {
    ws
        .of('/api/info/school/get')
        .on('connection', socket => {
            socket.on('req-data', data => {
                SchoolInfoController.streamOne(socket, data);
            });
        });


    ws
        .of('/api/info/school/get-all')
        .on('connection', socket => {
         socket.on('req-data', () => {
            SchoolInfoController.streamAll(socket);
        });
    });
};