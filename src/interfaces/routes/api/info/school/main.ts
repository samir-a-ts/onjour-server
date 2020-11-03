import SchoolInfoController from '../../../../controllers/api/info/school/SchoolController';
import { Server } from 'socket.io';
import constants from '../../../../../infrastructure/config/constants';

const { logger } = constants;

export default (ws: Server): void => {
    ws
        .of('/api/info/school/get')
        .on('connection', socket => {
            socket.on('req-data', data => {
                const obj = JSON.parse(data);

                logger.info(obj);

                SchoolInfoController.streamOne(socket, obj);
            });
        });


    ws
        .of('/api/info/school/get-all')
        .on('connection', socket => {
         socket.on('req-data', () => {
            logger.info('Request');

            SchoolInfoController.streamAll(socket);
        });
    });
};