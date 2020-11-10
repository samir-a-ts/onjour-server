import coder from '../../infrastructure/webserver/security/main';

export default function  decryptRequest(body: { token: string }): Record<string, unknown> {
    console.log(body);

    const decrypted = coder.decrypt(body.token, 'utf8');

    const json = JSON.parse(decrypted);

    console.log(json);

    return json;
}