import { Socket } from 'socket.io';
import decryptRequest from '../../../../../application/server/request_decrypter';
import serviceLocator from '../../../../../infrastructure/config/service_locator';

export default class SchoolInfoController {

    static async streamOne(socket: Socket, body: { token: string }): Promise<void> {
        const decrBody = decryptRequest(body);

        const { uid } = decrBody as { uid: string };

        await serviceLocator.schoolRepository.streamOne(uid, socket);
    }

    static async streamAll(socket: Socket): Promise<void> {
        await serviceLocator.schoolRepository.streamAll(socket);
    }
}
