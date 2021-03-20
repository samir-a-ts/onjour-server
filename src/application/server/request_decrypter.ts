import coder from '../../infrastructure/webserver/security/main';
import constants from '../../infrastructure/config/constants';

const { logger } = constants;

export default function  decryptRequest(body: { token: string }): Record<string, unknown> {
    const decrypted = coder.decrypt(body.token, 'utf8');

    const json = JSON.parse(decrypted);

    logger.info(`Request! -> ${decrypted}`);

    return json;
}