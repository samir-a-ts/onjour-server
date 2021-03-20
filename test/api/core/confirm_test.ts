import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import { describe, it } from 'mocha';
import decryptResponse from '../../server/response_decrypter';
import encryptRequest from '../../server/request_encrypter';

chai.use(chaiHttp);

describe('Email confirmation (/email-confirm)', () => {

    const tEmailConfirm = {
        'email': 'lutrak111@gmail.com',
    };

    const encrypteReg = encryptRequest(tEmailConfirm);

    const obj = { 'token': encrypteReg };

    describe('POST /', () => {
        it('It should succeed, and return code without any errors', done => {
            chai
            .request('localhost:3000')
            .post('/api/email-confirm')
            .send(obj)
            .end((_, res) => {
                const response = decryptResponse(res.body);

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
