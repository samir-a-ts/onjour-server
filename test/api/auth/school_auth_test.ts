import SchoolSchema from '../../../src/infrastructure/orm/schemas/school/school_schema';

import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import { before, describe, it } from 'mocha';
import mongoose  from 'mongoose';
import environment from '../../../src/infrastructure/config/environment';
import decryptResponse from '../../server/response_decrypter';
import encryptRequest from '../../server/request_encrypter';

chai.use(chaiHttp);

const url = 'localhost:3000';

const tRegisterInfo = {
    'name': 'Liceum 23',
    'directorUid': '21938247rfdnjjdc',
    'location': {
        'latitude': 23,
        'longtitude': 23,
        'address': 'Vagnera str.',
    },
};


describe('School authentication. (/auth/school)', () => {

    const collection = SchoolSchema;

    describe('POST /register', () => {
        
        before(done => {
            mongoose.connect(environment.database.url, environment.database.databaseConfig)
            .then(() => {
                done();
            });
        });

        const encrypteReg = encryptRequest(tRegisterInfo);

        it('It should succeed', done => {
            chai
            .request(url)
            .post('/api/auth/school/register')
            .send({ token: encrypteReg })
            .end((_, res) => {
                const decrypted = decryptResponse(res.body);

                expect(res.status).equal(200);

                expect(decrypted).to.have.own.property('errors');
                expect(decrypted.errors.length).to.be.equal(0);

                expect(decrypted.result).to.be.not.null;

                done();
            });
        });

        it('It should return error if school is already registered', done => {
            chai
                .request(url)
                .post('/api/auth/school/register')
                .send({ token: encrypteReg  })
                .end((_, res) => {
                    const decrypted = decryptResponse(res.body);

                    expect(decrypted).have.own.property('errors');
                    expect(decrypted.errors.length).to.be.eq(1);

                    done();
                });
        });
    });

describe('POST /confirm', () => {

it('It should succeed', done => {

    collection
            .findOne({})
            .then(res => {
                const obj = res?.toObject();

                const encrypted = encryptRequest({ uid: obj?.uid });

                chai
                .request(url)
                .post('/api/auth/school/confirm')
                .send({ token: encrypted })
                .end((_, res) => {
                    expect(res.status).equal(200);

                    const decrypted = decryptResponse(res.body);
            
                    expect(decrypted).to.be.eql({ errors: [] });
            
                    done();
                });
            });
});

    it('It should return error if school is already confirmed', done => {
            collection
            .findOne({})
            .then(res => {
                const obj = res?.toObject();

                const encrypted = encryptRequest({ uid: obj?.uid });

                chai
                .request(url)
                .post('/api/auth/school/confirm')
                .send({ token: encrypted })
                .end((_, res) => {
                    const decrypted = decryptResponse(res.body);

                    expect(decrypted).have.own.property('errors');
                    expect(decrypted['errors'].length).to.be.not.equal(0);

                    done();
                });
            });
    });
});
});
    