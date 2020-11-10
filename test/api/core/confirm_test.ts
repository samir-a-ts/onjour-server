import coder from '../../../src/infrastructure/webserver/security/main';
import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import { describe, it } from 'mocha';

chai.use(chaiHttp);

describe('Email confirmation (/email-confirm)', () => {

    const tEmailConfirm = {
        'email': 'lutrak111@gmail.com',
    };

    const reqStr = JSON.stringify(tEmailConfirm);

    const encrypted = coder.encrypt(reqStr, 'base64');

    const obj = { 'token': encrypted };

    describe('POST /', () => {
        it('It should succeed, and return code without any errors', done => {
            chai
            .request('localhost:3000')
            .post('/api/email-confirm')
            .send(obj)
            .end((_, res) => {
                const decrypted = coder.decrypt(res.body.response, 'utf8');

                const response = JSON.parse(decrypted);

                expect(res.status).equal(200);

                expect(response).has.own.property('errors');
                expect(response).has.own.property('result');

                expect(response['errors']).to.be.an.instanceof(Array);
                expect(response['errors'].length).to.be.eq(0);
                
                expect(response['result']).to.be.not.null;

                done();
            });
        });
    });

}); 
