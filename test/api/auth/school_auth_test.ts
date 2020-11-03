import SchoolSchema from '../../../src/infrastructure/orm/schemas/school/school_schema';

import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import { describe, it } from 'mocha';
import mongoose  from 'mongoose';
import environment from '../../../src/infrastructure/config/environment';

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

let schoolUid: string;


describe('School authentication. (/auth/school)', () => {

    const collection = SchoolSchema;

    describe('POST /register', () => {
        
        before(done => {
            mongoose.connect(environment.database.url, environment.database.databaseConfig)
            .then(() => {
                done();
            });
        });

        it('It should succeed', done => {
            chai
            .request(url)
            .post('/api/auth/school/register')
            .send(tRegisterInfo)
            .end((_, res) => {
                expect(res.status).equal(200);

                done();
            });
        });

        it('It should add school to DB', done => {
            collection
                .findOne({name: tRegisterInfo.name})
                .then(function(result) {
                    const resultObj = result?.toObject();

                    expect(resultObj).not.equal(null);
                    expect(resultObj).has.own.property('confirmed');
                    expect(resultObj).property('confirmed').is.equal(false);

                    done();
            });
        });

        it('It should return error if school is already registered', done => {
            chai
                .request(url)
                .post('/api/auth/school/register')
                .send(tRegisterInfo)
                .end((_, res) => {
                    expect(res.body).have.own.property('errors');

                    done();
                });
        });
    });

}); 

describe('School confirmation. (/school)', () => {

    const collection = SchoolSchema;

    before(done => {
        SchoolSchema.findOne({ name: tRegisterInfo.name })
        .then(res => {
            schoolUid = res?.toObject().uid;

            done();
        });
    });

    describe('POST /confirm', () => {
        it('It should succeed', done => {
            chai
            .request(url)
            .post('/api/auth/school/confirm')
            .send({ uid: schoolUid })
            .end((_, res) => {
                expect(res.status).equal(200);

                done();
            });
        });

        it('It should set `confirm` property to true', done => {
            collection
                .findOne({ uid: schoolUid })
                .then(function(result) {
                    if (result !== null) {
                        const r = result.toObject();

                        expect(r).not.equal(null);
                        expect(r).has.own.property('confirmed');
                        expect(r).property('confirmed').is.equal(true);

                        done();
                    }
            });
        });

        it('It should return error if school is already confirmed', done => {
            chai
                .request(url)
                .post('/api/auth/school/confirm')
                .send({ uid: schoolUid })
                .end((_, res) => {
                    expect(res.body).have.own.property('errors');
                    expect(res.body['errors'].length).to.be.not.equal(0);

                    done();
                });
        });
    });

}); 