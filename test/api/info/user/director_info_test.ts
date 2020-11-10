// import mongoose from 'mongoose';
// import chai, { expect } from 'chai';
// import chaiHttp from 'chai-http';
// import { describe, it } from 'mocha';
// import environment from '../../../../src/infrastructure/config/environment';
// import io from 'socket.io-client';
// import DirectorSchema from '../../../../src/infrastructure/orm/schemas/users/director_schema';
// // import constants from '../../../../src/infrastructure/config/constants';

// // const { logger } = constants;

// const url = 'localhost:3000';

// const tDirectorInfo = {
//     schoolUid: '9132ry7gf62gf82vy84fv28bgvy8',
//     uid: null,
// };

// chai.use(chaiHttp);

// describe('Getting user information (/info/user)', () => {

//     before(done => {
//         mongoose.connect(environment.database.url, environment.database.databaseConfig)
//         .then(() => {
//             done();
//         });
//     });

//     describe('Director (/director)', () => {
//         describe('Updating info (POST /update)', () => {
//             before(done => {
//                 DirectorSchema
//                     .findOne({})
//                     .then(res => {
//                         tDirectorInfo.uid = res?.toObject().uid;

//                         done();
//                     });
//             });

//             it('Should succeed', done => {
//                 chai
//                 .request(url)
//                 .post('/api/info/user/director/update')
//                 .send(tDirectorInfo)
//                 .end((_, res) => {
//                     expect(res.status).to.be.eq(200);

//                     expect(res.body).to.be.not.null;

//                     expect(res.body).to.have.ownProperty('errors');

//                     expect(res.body.errors.length).to.be.equal(0);

//                     done();
//                 });
//             });

//             it('Should change data in DB', done => {
//                 DirectorSchema
//                     .findOne(tDirectorInfo)
//                     .then(v => {
//                         expect(v).to.be.not.null;

//                         const obj = v?.toObject();

//                         expect(obj.schoolUid).to.be.not.null;

//                         done();
//                     });
//             });

//             });

//             describe('Get info (UPDATE /get)', () => {
//                 it('It should connect succesfully', done => {
//                     const socket = io.connect('http://localhost:3000/api/info/user/director/get');

//                     socket.on('connect', () => {
//                         socket.disconnect();

//                         done();
//                     });   
//                 });

//                 it('It should send data and retrieve it successfully', done => {
//                     const socket = io.connect('http://localhost:3000/api/info/user/director/get');

//                     socket.on('connect', () => {
//                         socket.on('res-data', (data: { result: Record<string, unknown>, errors: unknown[] }) => {
//                             expect(data).to.be.not.null;

//                             expect(data.result.uid).to.be.eq(tDirectorInfo.uid);
//                             expect(data.result.schoolUid).to.be.eq(tDirectorInfo.schoolUid);

//                             expect(data.errors.length).to.be.eq(0);

//                             socket.disconnect();

//                             done();
//                         });

//                         socket.emit('req-data', { uid: tDirectorInfo.uid });
//                     });   
//                 });

//                 it('It should send incorrect data and retrieve error', done => {
//                     const socket = io.connect('http://localhost:3000/api/info/user/director/get');

//                     socket.on('connect', () => {
//                         socket.on('res-err', (data: { result: Record<string, unknown>, errors: unknown[] }) => {
//                             expect(data).to.be.not.null;

//                             expect(data.errors.length).to.be.eq(1);

//                             socket.disconnect();

//                             done();
//                         });

//                         socket.emit('req-data', { uid: 'random shit' });
//                     });   
                    
//                 });
//             });
//         });

//         after(done => {
//             DirectorSchema
//                 .findOneAndDelete()
//                 .then(() => done());
//         });
// });