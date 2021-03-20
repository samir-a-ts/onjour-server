import coder from '../../src/infrastructure/webserver/security/main';

export default function decryptResponse(data: { response: string }): Record<string, Record<string, Record<string, unknown>>> {
    const objStr = coder.decrypt(data.response, 'utf8');

    const obj = JSON.parse(objStr);

    return obj;

}