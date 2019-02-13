const chai = require('chai'),
  dictum = require('dictum.js'),
  server = require('../app'),
  should = chai.should();

describe('/users POST', () => {
  it('should be successful signing up', () =>
    chai
      .request(server)
      .post('/users')
      .send({
        firstName: 'Harry',
        lastName: 'Potter',
        email: 'franco.perez@wolox.com.ar',
        password: '12345678'
      })
      .then(res => {
        res.should.have.status(201);
        dictum.chai(res);
      }));
  it('should fail when the email already exists', () =>
    chai
      .request(server)
      .post('/users')
      .send({
        firstName: 'test',
        lastName: 'wolox',
        email: 'test@wolox.com.ar',
        password: '12345678'
      })
      .then(res => {
        res.should.have.status(500);
        res.body.message.should.equal('The user with email: test@wolox.com.ar already exists');
      }));
  it('should fail when the password is too short', () =>
    chai
      .request(server)
      .post('/users')
      .send({
        firstName: 'test',
        lastName: 'wolox',
        email: 'test@wolox.com.ar',
        password: '1234567'
      })
      .then(res => {
        res.should.have.status(422);
        res.body.message[0].msg.should.equal('must be at least 8 chars long');
      }));
  it('should fail when some field does not exist', () =>
    chai
      .request(server)
      .post('/users')
      .send({
        lastName: 'wolox',
        email: 'test@wolox.com.ar',
        password: '1234567'
      })
      .then(res => {
        res.should.have.status(422);
        res.body.message[0].msg.should.equal('can not be empty');
      }));
});
