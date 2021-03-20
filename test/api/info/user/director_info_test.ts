import mongoose from 'mongoose';
import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import { describe, it } from 'mocha';
import environment from '../../../../src/infrastructure/config/environment';
import io from 'socket.io-client';
import DirectorSchema from '../../../../src/infrastructure/orm/schemas/users/director_schema';
import decryptResponse from '../../../server/response_decrypter';
import encryptRequest from '../../../server/request_encrypter';
import SchoolSchema from '../../../../src/infrastructure/orm/schemas/school/school_schema';

const url = 'localhost:3000';

chai.use(chaiHttp);

describe('Getting user information (/info/user)', () => {

    before(done => {
        mongoose.connect(environment.database.url, environment.database.databaseConfig)
        .then(() => {
            done();
        });
    });

    describe('Director (/director)', () => {
        describe('Updating info (POST /update)', () => {
            it('Should succeed', done => {
                DirectorSchema
                    .findOne({})
                    .then(res => {

                        const tDirectorInfo = {
                            schoolUid: '9132ry7gf62gf82vy84fv28bgvy8',
                            uid: res?.toObject()?.uid,
                        };

                        const encrypteReg = encryptRequest(tDirectorInfo);

                        chai
                            .request(url)
                            .post('/api/info/user/director/update')
                            .send({ token: encrypteReg })
                            .end((_, res) => {
                                expect(res.status).to.be.eq(200);

                                const decrypted = decryptResponse(res.body);

                                expect(decrypted).to.be.not.null;

                                expect(decrypted).to.have.ownProperty('errors');

                                expect(decrypted.errors.length).to.be.equal(0);

                                done();
                            });
                    });
            });

            });

            describe('Get info (UPDATE /get)', () => {
                DirectorSchema
                .findOne({})
                .then(res => {
                    const tDirectorInfo = {
                        schoolUid: '9132ry7gf62gf82vy84fv28bgvy8',
                        uid: res?.toObject()?.uid,
                    };

                    it('It should connect succesfully', done => {
                        const socket = io.connect('http://localhost:3000/api/info/user/director/get');
    
                        socket.on('connect', () => {
                            socket.disconnect();
    
                            done();
                        });   
                    });
    
                    it('It should send data and retrieve it successfully', done => {
                        const socket = io.connect('http://localhost:3000/api/info/user/director/get');
    
                        socket.on('connect', () => {
                            socket.on('res-data', (data: { response: string }) => {
                                const decrypted = decryptResponse(data);

                                expect(data).to.be.not.null;
    
                                expect(decrypted.result.uid).to.be.eq(tDirectorInfo.uid);
                                expect(decrypted.result.schoolUid).to.be.eq(tDirectorInfo.schoolUid);
    
                                expect(decrypted.errors.length).to.be.eq(0);
    
                                socket.disconnect();
    
                                done();
                            });

                            const encrypted = encryptRequest({ uid: tDirectorInfo.uid });
    
                            socket.emit('req-data', { token: encrypted });
                        });   
                    });
    
                    it('It should send incorrect data and retrieve error', done => {
                        const socket = io.connect('http://localhost:3000/api/info/user/director/get');
    
                        socket.on('connect', () => {
                            socket.on('res-err', (data: { response: string }) => {
                                const decrypted = decryptResponse(data);

                                expect(data).to.be.not.null;
    
                                expect(decrypted.errors.length).to.be.eq(1);
    
                                socket.disconnect();
    
                                done();
                            });
                            const encrypted = encryptRequest({ uid: 'random shit' });
    
                            socket.emit('req-data', { token: encrypted });
                        });   
                        
                    });
                });
                
            });
        });

        after(done => {

            Promise.all([
                DirectorSchema
                .findOneAndDelete({}),
                SchoolSchema
                .findOneAndDelete({}),
            ]).then(() => done());

        });
});