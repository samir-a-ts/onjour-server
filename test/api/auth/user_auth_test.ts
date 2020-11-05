import mongoose from 'mongoose';

import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
// import { v4 as generateUID } from 'uuid';
import { describe, it } from 'mocha';
import DirectorSchema from '../../../src/infrastructure/orm/schemas/users/director_schema';
import environment from '../../../src/infrastructure/config/environment';

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
    before(done => {
        mongoose.connect(environment.database.url, environment.database.databaseConfig)
        .then(() => {
            done();
        });
    });

    describe('Director (/director)', () => {
        describe('Registration (POST /register)', () => {

            it('Should succeed and return uid', done => {
             chai
                .request(url)
                .post('/api/auth/user/director/register')
                .send(tDirectorInfo)
                .end((_, res) => {
                    expect(res.status).to.be.eq(200);

                    expect(res.body).to.be.not.null;

                    expect(res.body).to.have.ownProperty('result');
                    expect(res.body).to.have.ownProperty('errors');

                    expect(res.body.result).to.be.not.null;
                    expect(res.body.errors.length).to.be.equal(0);

                    done();
                });
            });

            it('Should add director to database', done => {
                DirectorSchema
                    .findOne({ email: tDirectorInfo.email })
                    .then(val => {
                        expect(val).to.be.not.null;

                        const obj = val?.toObject();

                        expect(obj.email).to.be.equal(tDirectorInfo.email);
                        expect(obj.password).to.be.equal(tDirectorInfo.password);
                        expect(obj.name).to.be.equal(tDirectorInfo.name);

                        done();
                    });
            });
        });
        describe('Sign in (POST /sign-in)', () => {
            it('Should succeed and return uid', done => {
             chai
                .request(url)
                .post('/api/auth/user/director/sign-in')
                .send({ email: tDirectorInfo.email, password: tDirectorInfo.password })
                .end((_, res) => {
                    expect(res.status).to.be.eq(200);

                    expect(res.body).to.be.not.null;

                    expect(res.body).to.have.ownProperty('result');
                    expect(res.body).to.have.ownProperty('errors');

                    expect(res.body.result).to.be.not.null;
                    expect(res.body.errors.length).to.be.equal(0);

                    done();
                });
            });
        });
    });

    after(done => {
        DirectorSchema
        .findOneAndDelete({email: tDirectorInfo.email})
        .then(() => done());
    });
});