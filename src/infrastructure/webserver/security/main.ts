import dotEnv from 'dotenv';
import NodeRSA from 'node-rsa';

const env = dotEnv.config();

const parsed = env.parsed;

const coder = new NodeRSA(
    parsed?.SECRET as string,
    'pkcs1',
);

// const obj = {thisiS: 'TEST'};

// const objStr = JSON.stringify(obj);

// const encrypted = coder.encrypt(objStr, 'base64');

// const decrypted = coder.decrypt(encrypted, 'utf8');

// console.log(decrypted);

export default coder;