
import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import { describe, it } from 'mocha';
import decryptResponse from '../../server/response_decrypter';
import encryptRequest from '../../server/request_encrypter';

chai.use(chaiHttp);

const url = 'localhost:3000';

const tDirectorInfo = {
    email: 'director@test.com',
    password: '123456',
    name: 'Director',
    surname: 'Did',
    patronymic: 'Didid',
};

describe('User authentication (/api/auth/user)', () => {
    describe('Director (/director)', () => {
        const encrypteReg = encryptRequest(tDirectorInfo);

        describe('Registration (POST /register)', () => {

            it('Should succeed and return uid', done => {
             chai
                .request(url)
                .post('/api/auth/user/director/register')
                .send({ token: encrypteReg })
                .end((_, res) => {
                    const decrypted = decryptResponse(res.body);

                    expect(res.status).to.be.eq(200);

                    expect(decrypted).to.be.not.null;

                    expect(decrypted).to.have.ownProperty('result');
                    expect(decrypted).to.have.ownProperty('errors');

                    expect(decrypted.result).to.be.not.null;
                    expect(decrypted.errors?.length).to.be.equal(0);

                    done();
                });
            });
        });
        
        describe('Sign in (POST /sign-in)', () => {
            it('Should succeed and return uid', done => {

                const request = { email: tDirectorInfo.email, password: tDirectorInfo.password };

                const encrypted = encryptRequest(request);

             chai
                .request(url)
                .post('/api/auth/user/director/sign-in')
                .send({ token: encrypted })
                .end((_, res) => {
                    const decrypted = decryptResponse(res.body);

                    expect(res.status).to.be.eq(200);

                    expect(decrypted).to.be.not.null;

                    expect(decrypted).to.have.ownProperty('result');
                    expect(decrypted).to.have.ownProperty('errors');

                    expect(decrypted.result).to.be.not.null;
                    expect(decrypted.errors?.length).to.be.equal(0);

                    done();
                });
            });
        });
    });
});