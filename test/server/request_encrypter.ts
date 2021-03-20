import coder from '../../src/infrastructure/webserver/security/main';

export default function encryptRequest(data: Record<string, unknown>): string {
    const objStr = JSON.stringify(data); 
    
    const token = coder.encrypt(objStr, 'base64');

    return token;
}