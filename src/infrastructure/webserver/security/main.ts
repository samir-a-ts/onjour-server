import dotEnv from 'dotenv';
import NodeRSA from 'node-rsa';

const env = dotEnv.config();

const parsed = env.parsed;

const coder = new NodeRSA(
    parsed?.SECRET as string,
    'pkcs1',
);

export default coder;