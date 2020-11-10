import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import School from '../../../../src/domain/school/School';
import { describe, it } from 'mocha';
import io from 'socket.io-client';
import SchoolSchema from '../../../../src/infrastructure/orm/schemas/school/school_schema';
import constants from '../../../../src/infrastructure/config/constants';
import coder from '../../../../src/infrastructure/webserver/security/main';

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

                const reqStr = JSON.stringify(request);

                const encrypted = coder.encrypt(reqStr, 'base64');

                socket.emit('req-data', { token: encrypted });

                socket.on('res-data', (data: { response: string }) => {
                    const objStr = coder.decrypt(data.response, 'utf8');

                    const obj = JSON.parse(objStr);  

                    expect(obj).to.have.ownProperty('errors');
                    expect(obj['errors'].length).to.be.eq(0);
                    expect(obj).to.have.ownProperty('result');
                    expect(obj['result']['uid']).to.be.eq(school.uid);

                    socket.disconnect();

                    done();
                });
            });
        });


        it('It should return error if no school found', done => {
            const socket = io.connect('http://localhost:3000/api/info/school/get');

            socket.on('connect', () => {
                socket.on('res-err', (data: Record<string, []>) => {
                    expect(data).to.be.not.null;
                    expect(data).has.own.property('errors');

                    expect(data.errors).to.be.instanceof(Array);
                    expect(data.errors.length).to.be.eq(1);

                    socket.disconnect();

                    done();
                });

                socket.emit('req-data', JSON.stringify({uid: 'random string'}));
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

                socket.on('res-data', (data: { errors: [], result: Record<string, unknown>[] }) => {
                    expect(data).to.have.ownProperty('errors');
                    expect(data['errors'].length).to.be.eq(0);
                    expect(data).to.have.ownProperty('result');
                    expect(data['result'].length).to.be.eq(1);
                    expect(data['result'][0]['uid']).to.be.eq(schools[0].uid);

                    socket.disconnect();

                    done();
                });
            });
        });
    });

    after(done => {
        SchoolSchema
            .findOneAndDelete({ uid: school.uid })
            .then(() => done());
    });
}); 
