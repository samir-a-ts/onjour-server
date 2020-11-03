import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import { describe, it } from 'mocha';
import io from 'socket.io-client';

chai.use(chaiHttp);

describe('Getting school information (/info/school)', () => {

    describe('UPDATE /get', () => {
        it('It should succesfully connect to web socket', done => {
            const socket = io.connect('http://localhost:3000/api/info/school/get');

            socket.on('connect', () => done());            
        });

        it('It should return error if no school found', done => {
            const socket = io.connect('http://localhost:3000/api/info/school/get');

            socket.on('connect', () => {
                socket.on('res-data', (data: Record<string, []>) => {
                    expect(data).to.be.not.null;
                    expect(data).has.own.property('errors');

                    expect(data.errors).to.be.instanceof(Array);
                    expect(data.errors.length).to.be.eq(1);


                    done();
                });

                socket.emit('req-data', JSON.stringify({uid: 'random string'}));
            });    
        });
    });

}); 
