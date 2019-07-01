//Set env variable during test.
process.env.NODE_ENV = 'test';

//Require the dev-dependencies
import * as chai from "chai";
import chaiHttp = require('chai-http');
let app = require('../app');

let should = chai.should();

chai.use(chaiHttp);

describe('/POST createAccount', () => {
    it('it should return new account', (done) => {
        chai.request(app)
            .post('/api/v1/createAccount')
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('result').eql(true);
                res.body.should.have.property('message');
                done();
            });
    });
});
