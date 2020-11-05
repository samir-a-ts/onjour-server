import { Server } from 'socket.io';
import wsDirectorGetInit from './director';

export default (ws: Server): void => {
    wsDirectorGetInit(ws);
};