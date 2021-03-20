import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import School from '../../../../src/domain/school/School';
import { describe, it } from 'mocha';
import io from 'socket.io-client';
import SchoolSchema from '../../../../src/infrastructure/orm/schemas/school/school_schema';
import constants from '../../../../src/infrastructure/config/constants';
import decryptResponse from '../../../server/response_decrypter';
import encryptRequest from '../../../server/request_encrypter';

const { logger } = constants;

chai.use(chaiHttp);

describe('Getting school information (/info/school)', () => {
    let school: School;

    describe('UPDATE /get', () => {
        before(done => {
            SchoolSchema
            .find({})
            .then(v => {                
                school = School.fromJSON(v[0]?.toObject());
            })
            .catch(err => logger.error(err));

            done();
        });

        it('It should succesfully connect to web socket', done => {
            const socket = io.connect('http://localhost:3000/api/info/school/get');

            socket.on('connect', () => {
                socket.disconnect();

                done();
            });            
        });

        it('It should return confirmed school with no errors', done => {
            const socket = io.connect('http://localhost:3000/api/info/school/get');

            socket.on('connect', () => {
                const request = { uid: school.uid };

                const encrypted = encryptRequest(request);

                socket.emit('req-data', { token: encrypted });

                socket.on('res-data', (data: { response: string }) => {
                    const decrypted = decryptResponse(data);
                    
                    expect(decrypted).to.have.ownProperty('errors');
                    expect(decrypted['errors'].length).to.be.eq(0);
                    expect(decrypted).to.have.ownProperty('result');
                    expect(decrypted['result']['uid']).to.be.eq(school.uid);

                    socket.disconnect();

                    done();
                });
            });
        });


        it('It should return error if no school found', done => {
            const socket = io.connect('http://localhost:3000/api/info/school/get');

            socket.on('connect', () => {
                socket.on('res-err', (data: { response: string }) => {
                    const decrypted = decryptResponse(data);

                    expect(decrypted).to.be.not.null;
                    expect(decrypted).has.own.property('errors');

                    expect(decrypted.errors).to.be.instanceof(Array);
                    expect(decrypted.errors.length).to.be.eq(1);

                    socket.disconnect();

                    done();
                });

                const request = { uid: 'random string' };

                const encrypted = encryptRequest(request);

                socket.emit('req-data', { token: encrypted });
            });    
        });
    });

    describe('UPDATE /get-all', () => {
        let schools: School[];
        
        before(done => {
            SchoolSchema
            .find({})
            .then(v => {                
                schools = v.map(val => School.fromJSON(val.toObject()));
            })
            .catch(err => logger.error(err));

            done();
        });

        it('It should succesfully connect to web socket', done => {
            const socket = io.connect('http://localhost:3000/api/info/school/get-all');

            socket.on('connect', () => {
                socket.disconnect();

                done();
            });            
        });

        it('It should return schools with no errors', done => {
            const socket = io.connect('http://localhost:3000/api/info/school/get-all');

            socket.on('connect', () => {
                socket.emit('req-data');

                socket.on('res-data', (data: { response: string }) => {
                    const decrypted = decryptResponse(data);

                    expect(decrypted).to.have.ownProperty('errors');
                    expect(decrypted['errors'].length).to.be.eq(0);
                    expect(decrypted).to.have.ownProperty('result');
                    expect(decrypted['result'].length).to.be.eq(1);
                    expect(decrypted['result'][0]['uid']).to.be.eq(schools[0].uid);

                    socket.disconnect();

                    done();
                });
            });
        });
    });

}); 
