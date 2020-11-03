import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import { describe, it } from 'mocha';

chai.use(chaiHttp);

describe('Email confirmation (/email-confirm)', () => {

    const tEmailConfirm = {
        'email': 'lutrak111@gmail.com',
    };

    describe('POST /', () => {
        it('It should succeed, and return code without any errors', done => {
            chai
            .request('localhost:3000')
            .post('/api/email-confirm')
            .send(tEmailConfirm)
            .end((_, res) => {
                expect(res.status).equal(200);

                expect(res.body).has.own.property('errors');
                expect(res.body).has.own.property('result');

                expect(res.body['errors']).to.be.an.instanceof(Array);
                expect(res.body['errors'].length).to.be.eq(0);
                
                expect(res.body['result']).to.be.not.null;

                done();
            });
        });
    });

}); 
