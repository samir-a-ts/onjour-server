// import mongoose from 'mongoose';

// import chai, { expect } from 'chai';
// import chaiHttp from 'chai-http';
// import { v4 as generateUID } from 'uuid';
// import { describe, it } from 'mocha';
// import { app } from '../../../src/main';

// chai.use(chaiHttp);

// describe('User authentication. (/user)', () => {

//     const schoolUid = generateUID();
//     const classUid = generateUID();
//     const parentUid = generateUID();

//     const encrypted = encrypt.encrypt('pass', 'buffer').toJSON();

//     const tDirector = {
//         'email': 'director@mail.com',
//         'password': encrypted,
//         'title': 'director',
//         'suid': schoolUid,
//         'confirmed': false,
//         'uid': null,
//     };
//     const tAsistant = {
//         'email': 'assistant@mail.com',
//         'password': encrypted,
//         'title': 'assistant',
//         'suid': schoolUid,
//         'confirmed': false,
//         'uid': null,
//     };
//     const tTeacher = {
//         'email': 'teacher@mail.com',
//         'password': encrypted,
//         'title': 'teacher',
//         'suid': schoolUid,
//         'confirmed': false,
//         'cuid': classUid,
//         'uid': null,
//     };
//     const tParent = {
//         'email': 'parent@mail.com',
//         'password': encrypted,
//         'title': 'parent',
//         'suids':  [ schoolUid ],
//         'confirmed': false,
//         'cuid': classUid,
//         'opuid': generateUID(),
//         'uid': null,
//         'codes': [
//             '771013',
//         ]
//     };
//     const tStudent = {
//         'email': 'student@mail.com',
//         'password': encrypted,
//         'title': 'student',
//         'suid': schoolUid,
//         'confirmed': false,
//         'cuid': classUid,
//         'puid': parentUid,
//         'uid': null,
//         'code': '771013'
//     };

//     const array = [
//         tDirector,
//         tAsistant,
//         tTeacher,
//         tParent,
//         tStudent,
//     ];

//     const selectedIndex = 2;

//    before(done => {
//     mongoClient
//             .connect()
//             .then(() => done());
//    });

//     describe('GET /register', () => {
//         const db = mongoClient.db('onjour');

//         it('It should succeed and return new user uid', done => {
//             chai
//             .request(app)
//             .get('/api/user/register')
//             .send(array[selectedIndex])
//             .end((_, res) => {
//                 expect(res.body).to.be.not.null;

//                 expect(res.body.errors).to.be.an.instanceof(Array);
//                 expect(res.body.errors.length).to.be.eq(0);
                
//                 expect(res.body.result).to.be.not.null;

//                 array[selectedIndex].uid = res.body.result;

//                 done();
//             });
//         });

//         it('It should save user in DB', done => {
//             const collection = db.collection(`${array[selectedIndex].title}s`);

//             collection
//                 .findOne({ 'email': array[selectedIndex].email })
//                 .then(result => {
//                     expect(result).to.be.not.null;
//                     expect(result.uid).to.be.not.null;

//                     done();
//                 });
//         });

//         it('It should fail if user already registered', done => {
//             chai
//             .request(app)
//             .get('/api/user/register')
//             .send(array[selectedIndex])
//             .end((_, res) => {
//                 expect(res.body).to.be.not.null;

//                 expect(res.body.errors).to.be.an.instanceof(Array);
//                 expect(res.body.errors.length).to.be.eq(1);

//                 expect(res.body.result).to.be.null;
                
//                 done();
//             });
//         });

//         it('Test of register parent and student: should succeed', done => {
//             chai
//             .request(app)
//             .get('/api/user/register')
//             .send(tParent)
//             .end((_, res) => {
//                 expect(res.body).to.be.not.null;

//                 expect(res.body.errors).to.be.an.instanceof(Array);
//                 expect(res.body.errors.length).to.be.eq(0);

//                 expect(res.body.result).to.be.not.null;

//                 chai
//                     .request(app)
//                     .get('/api/user/register')
//                     .send(tParent)
//                     .end((_, res) => {
//                         expect(res.body).to.be.not.null;

//                         expect(res.body.errors).to.be.an.instanceof(Array);
//                         expect(res.body.errors.length).to.be.eq(0);

//                         expect(res.body.result).to.be.not.null;

//                         done();
//                     });
//             });
//         });

//         it('Test of register parent and student: should safe both of them in db', done => {
//             const pCollection = db.collection('parents');
//             const sCollection = db.collection('students');


//             pCollection
//                 .findOne({ 'email': tParent.email })
//                 .then(pResult => {
//                     expect(pResult).to.be.not.null;
//                     expect(pResult.codes).to.be.not.null;
//                     expect(pResult.codes.length).to.be.equal(0);

//                     sCollection
//                     .findOne({ 'email': tStudent.email })
//                     .then(result => {
//                         expect(result).to.be.not.null;
//                         expect(result.code).to.be.null;

//                         expect(result.puid).equal(pResult.uid);

//                         done();
//                     });
//                 });
//         });

//     }); 

//     describe('POST /confirm', () => {
//         const db = mongoClient.db('onjour');

//         it('It should succeed', done => {
//             chai
//             .request(app)
//             .post('/api/user/confirm')
//             .send({ 'title': array[selectedIndex].title, 'uid': array[selectedIndex].uid })
//             .end((_, res) => {
//                 expect(res.status).to.be.equal(200);

//                 done();
//             });
//         });

//         it('It should set user `confirm` property to true', done => {
//             const collection = db.collection(`${array[selectedIndex].title}s`);

//             collection
//                 .findOne({ 'email': array[selectedIndex].email })
//                 .then(result => {
//                     expect(result).to.be.not.null;
//                     expect(result.confirmed).to.be.equal(true);

//                     done();
//                 });
//         });

//         it('It should fail if already confirmed', done => {
//             chai
//             .request(app)
//             .post('/api/user/confirm')
//             .send({ 'title': array[selectedIndex].title, 'uid': array[selectedIndex].uid })
//             .end((_, res) => {
//                 expect(res.body).to.be.not.null;

//                 expect(res.body.errors).to.be.an.instanceof(Array);
//                 expect(res.body.errors.length).to.be.eq(1);

//                 expect(res.body.result).to.be.null;
                
//                 done();
//             });
//         });

//     }); 

//     describe('GET /signin', () => {

//         it('It should succeed and return user uid', done => {
//             chai
//             .request(app)
//             .get('/api/user/signin')
//             .send(array[selectedIndex])
//             .end((_, res) => {
//                 expect(res.body).to.be.not.null;

//                 expect(res.body.errors).to.be.an.instanceof(Array);
//                 expect(res.body.errors.length).to.be.eq(0);
                
//                 expect(res.body.result).to.be.not.null;

//                 done();
//             });

//         });

//     }); 

//     after(done => {
//         const db = mongoClient.db('onjour');

//         const collection = db.collection(`${array[selectedIndex].title}s`);

//         collection
//             .findOneAndDelete({ 'email': array[selectedIndex].email })
//             .then(() => done());
//     });
// });