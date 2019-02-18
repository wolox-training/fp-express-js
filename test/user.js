const chai = require('chai'),
  dictum = require('dictum.js'),
  server = require('../app'),
  should = chai.should(),
  userService = require('../app/services/users');

describe('/users POST', () => {
  it('should be successful signing up', () =>
    chai
      .request(server)
      .post('/users')
      .send({
        firstName: 'Harry',
        lastName: 'Potter',
        email: 'harry.perez@wolox.com.ar',
        password: '12345678'
      })
      .then(res => {
        res.should.have.status(201);
        userService.findBy({ email: 'harry.perez@wolox.com.ar' }).then(userFound => should.exist(userFound));
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
        res.should.have.status(422);
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
        res.body.message[0].param.should.equal('password');
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
        res.body.message[0].param.should.equal('firstName');
        res.body.message[0].msg.should.equal('can not be empty');
      }));
});
