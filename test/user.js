const chai = require('chai'),
  dictum = require('dictum.js'),
  server = require('../app'),
  should = chai.should(),
  userService = require('../app/services/users'),
  bcryptService = require('../app/services/bcrypt'),
  sessionManagerService = require('../app/services/sessionManager'),
  expect = chai.expect;

describe('users controller', () => {
  describe('/users POST', () => {
    beforeEach('create test user in db', () =>
      userService.create({
        firstName: 'test',
        lastName: 'wolox',
        email: 'test@wolox.com.ar',
        password: bcryptService.encryptPassword('12345678')
      })
    );
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
          userService
            .findBy({ email: 'harry.perez@wolox.com.ar' })
            .then(userFound => should.exist(userFound));
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
    it('should be successful signing in', () =>
      chai
        .request(server)
        .post('/users/sessions')
        .send({
          email: 'test@wolox.com.ar',
          password: '12345678'
        })
        .then(res => {
          res.should.have.status(200);
          bcryptService
            .comparePassword('12345678', sessionManagerService.decodeToken(res.body.token))
            .then(isSamePassword => expect(isSamePassword).to.be.true);
          dictum.chai(res);
        }));
    it('should fail when the user is not signed up', () =>
      chai
        .request(server)
        .post('/users/sessions')
        .send({
          email: 'not-signed@wolox.com.ar',
          password: '12345678'
        })
        .then(res => {
          res.should.have.status(404);
          res.body.message.should.equal('The user with email: not-signed@wolox.com.ar could not be found');
        }));
    it('should fail when the password is not valid', () =>
      chai
        .request(server)
        .post('/users/sessions')
        .send({
          email: 'test@wolox.com.ar',
          password: '11122233'
        })
        .then(res => {
          res.should.have.status(422);
          res.body.message.should.equal('The password: 11122233 is not valid');
        }));
    it('should fail when password is to shoort while signing in', () =>
      chai
        .request(server)
        .post('/users/sessions')
        .send({
          email: 'test@wolox.com.ar',
          password: '1234567'
        })
        .then(res => {
          res.should.have.status(422);
          res.body.message[0].param.should.equal('password');
          res.body.message[0].msg.should.equal('must be at least 8 chars long');
        }));
    it('should fail when some field does not exist while signing in', () =>
      chai
        .request(server)
        .post('/users/sessions')
        .send({
          email: 'test@wolox.com.ar'
        })
        .then(res => {
          res.should.have.status(422);
          res.body.message[0].param.should.equal('password');
          res.body.message[0].msg.should.equal('can not be empty');
        }));
  });
  describe('/users GET', () => {
    it('should be successful getting the users list', () =>
      chai
        .request(server)
        .get('/users')
        .set(sessionManagerService.HEADER_NAME, 'TestToken')
        .then(res => {
          res.should.have.status(200);
          res.body.should.be.a('array');
          dictum.chai(res);
        }));
  });
});
