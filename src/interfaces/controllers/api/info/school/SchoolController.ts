import { Socket } from 'socket.io';
import serviceLocator from '../../../../../infrastructure/config/service_locator';

export default class SchoolInfoController {

    static async streamOne(socket: Socket, body: unknown): Promise<void> {
        const { uid } = body as { uid: string };

        await serviceLocator.schoolRepository.streamOne(uid, socket);
    }

    static async streamAll(socket: Socket): Promise<void> {
        await serviceLocator.schoolRepository.streamAll(socket);
    }
}
