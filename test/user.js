const chai = require('chai'),
  dictum = require('dictum.js'),
  moment = require('moment'),
  mockDate = require('mockdate'),
  server = require('../app'),
  should = chai.should(),
  nock = require('nock'),
  userService = require('../app/services/users'),
  albumService = require('../app/services/albums'),
  bcryptService = require('../app/services/bcrypt'),
  sessionManagerService = require('../app/services/sessionManager'),
  expect = chai.expect;

const testToken = sessionManagerService.createToken({
  id: 1,
  email: 'test@wolox.com.ar',
  password: '12345678'
});

const adminToken = sessionManagerService.createToken({
  id: 2,
  email: 'admin@wolox.com.ar',
  password: '12345678'
});

const sessionTestToken = sessionManagerService.createToken({
  id: 3,
  email: 'session@wolox.com.ar',
  password: '12345678'
});

const albumNock = nock('https://jsonplaceholder.typicode.com')
  .get('/albums?id=1')
  .reply(200, [
    {
      userId: '1',
      id: '2',
      title: 'Batman rules'
    }
  ]);

const mockedDate = mockDate.set(moment().add(1, 'days'));

describe('users controller', () => {
  beforeEach('create test user in db', () =>
    userService.create({
      firstName: 'test',
      lastName: 'wolox',
      email: 'test@wolox.com.ar',
      password: bcryptService.encryptPassword('12345678'),
      isAuthorized: true
    })
  );
  beforeEach('create admin test user in db', () =>
    userService.create({
      firstName: 'admin',
      lastName: 'adminazo',
      email: 'admin@wolox.com.ar',
      password: bcryptService.encryptPassword('12345678'),
      isAdmin: true,
      isAuthorized: true
    })
  );
  beforeEach('create test user for invalidating session in db', () =>
    userService.create({
      firstName: 'session',
      lastName: 'valid',
      email: 'session@wolox.com.ar',
      password: bcryptService.encryptPassword('12345678'),
      isAuthorized: true
    })
  );
  beforeEach('create test album in db', () => albumService.create({ id: '1', title: 'batman' }, '1'));
  describe('/users POST sign up', () => {
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
          res.should.have.status(400);
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
          res.should.have.status(400);
          res.body.message[0].param.should.equal('firstName');
          res.body.message[0].msg.should.equal('can not be empty');
        }));
  });
  describe('/users POST sign in', () => {
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
          res.body.message.should.equal('The credentials are not valid');
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
          res.should.have.status(400);
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
          res.should.have.status(400);
          res.body.message[0].param.should.equal('password');
          res.body.message[0].msg.should.equal('can not be empty');
        }));
  });
  describe('/users GET user list', () => {
    it('should be successful getting the user list', () =>
      chai
        .request(server)
        .get('/users')
        .set(sessionManagerService.HEADER_NAME, testToken)
        .then(res => {
          res.should.have.status(200);
          res.body.should.be.a('array');
          res.body.should.have.lengthOf(3);
          dictum.chai(res);
        }));
    it('should fail when limit query param is not a number', () =>
      chai
        .request(server)
        .get('/users?limit=a')
        .set(sessionManagerService.HEADER_NAME, testToken)
        .then(res => {
          res.should.have.status(400);
          res.body.message[0].param.should.equal('limit');
          res.body.message[0].msg.should.equal('must be a number');
        }));
    it('should fail when offset query param is not a number', () =>
      chai
        .request(server)
        .get('/users?limit=2&offset=a')
        .set(sessionManagerService.HEADER_NAME, testToken)
        .then(res => {
          res.should.have.status(400);
          res.body.message[0].param.should.equal('offset');
          res.body.message[0].msg.should.equal('must be a number');
        }));
    it('should be successful getting the user list with a limit passed by query param', () =>
      userService
        .create({
          firstName: 'wol',
          lastName: 'verine',
          email: 'wolverine@wolox.com.ar',
          password: bcryptService.encryptPassword('12345678')
        })
        .then(() =>
          chai
            .request(server)
            .get('/users?limit=2')
            .set(sessionManagerService.HEADER_NAME, testToken)
            .then(res => {
              res.should.have.status(200);
              res.body.should.be.a('array');
              res.body.should.have.lengthOf(2);
            })
        ));
  });
  describe('/admin/users POST', () => {
    it('should be successful creating a new admin when the user is not signed up but has authorization', () =>
      chai
        .request(server)
        .post('/admin/users')
        .set(sessionManagerService.HEADER_NAME, testToken)
        .send({
          firstName: 'Spider',
          lastName: 'Man',
          email: 'spider.man@wolox.com.ar',
          password: '12345678'
        })
        .then(res => {
          res.should.have.status(201);
          userService.findBy({ email: 'spider.man@wolox.com.ar' }).then(userFound => {
            should.exist(userFound);
            userFound.isAdmin.should.be.true;
          });
          dictum.chai(res);
        }));
    it('should be successful updating an existing user as an admin', () =>
      chai
        .request(server)
        .post('/admin/users')
        .set(sessionManagerService.HEADER_NAME, adminToken)
        .send({
          firstName: 'test',
          lastName: 'wolox',
          email: 'test@wolox.com.ar',
          password: '12345678'
        })
        .then(res => {
          res.should.have.status(201);
          userService.findBy({ email: 'test@wolox.com.ar' }).then(userFound => {
            should.exist(userFound);
            userFound.isAdmin.should.be.true;
          });
          dictum.chai(res);
        }));
    it('should fail when there is no authorization in the request', () =>
      chai
        .request(server)
        .post('/admin/users')
        .send({
          firstName: 'test',
          lastName: 'wolox',
          email: 'test@wolox.com.ar',
          password: '12345678'
        })
        .then(res => {
          res.should.have.status(400);
          res.body.message.should.equal('The user is not logged in');
        }));
    it('should fail when the password is too short while creating a new admin user', () =>
      chai
        .request(server)
        .post('/admin/users')
        .set(sessionManagerService.HEADER_NAME, testToken)
        .send({
          firstName: 'test',
          lastName: 'wolox',
          email: 'test@wolox.com.ar',
          password: '1234567'
        })
        .then(res => {
          res.should.have.status(400);
          res.body.message[0].param.should.equal('password');
          res.body.message[0].msg.should.equal('must be at least 8 chars long');
        }));
    it('should fail when some field does not exist while creating a new admin user', () =>
      chai
        .request(server)
        .post('/admin/users')
        .set(sessionManagerService.HEADER_NAME, testToken)
        .send({
          lastName: 'wolox',
          email: 'test@wolox.com.ar',
          password: '1234567'
        })
        .then(res => {
          res.should.have.status(400);
          res.body.message[0].param.should.equal('firstName');
          res.body.message[0].msg.should.equal('can not be empty');
        }));
  });
  describe('/users/id/albums GET', () => {
    it('should be successful getting albums when the user retrieves his bought albums', () =>
      chai
        .request(server)
        .get('/users/1/albums')
        .set(sessionManagerService.HEADER_NAME, testToken)
        .then(res => {
          res.should.have.status(200);
          res.body[0].id.should.equal(1);
          res.body.should.be.a('array');
          dictum.chai(res);
        }));
    it('should fail when the user tries to get albums from another user', () =>
      chai
        .request(server)
        .get('/users/2/albums')
        .set(sessionManagerService.HEADER_NAME, testToken)
        .then(res => {
          res.should.have.status(403);
          res.body.message.should.equal(
            'The user test@wolox.com.ar does not have permissions to get the info'
          );
        }));
    it('should be successful getting albums from another user when he is admin', () =>
      chai
        .request(server)
        .get('/users/1/albums')
        .set(sessionManagerService.HEADER_NAME, adminToken)
        .then(res => {
          res.should.have.status(200);
          res.body.should.be.a('array');
          dictum.chai(res);
        }));
  });
  describe('/users/sessions/invalidate_all POST', () => {
    it('should be successful invalidating all user sessions', () =>
      chai
        .request(server)
        .post('/users/sessions/invalidate_all')
        .set(sessionManagerService.HEADER_NAME, sessionTestToken)
        .then(res => {
          res.should.have.status(200);
          userService
            .findBy({ email: 'session@wolox.com.ar' })
            .then(userFound => userFound.isAuthorized.should.be.false);
          dictum.chai(res);
        }));
    it('should be fail when the user is not logged in', () =>
      chai
        .request(server)
        .post('/users/sessions/invalidate_all')
        .then(res => {
          res.should.have.status(400);
          res.body.message.should.equal('The user is not logged in');
        }));
  });
  describe('Users token expiration test', () => {
    it('should be successful getting invalid session when the token expiration time has expired', () =>
      chai
        .request(server)
        .post('/users/sessions')
        .send({
          email: 'test@wolox.com.ar',
          password: '12345678'
        })
        .then(loggedRes =>
          chai
            .request(server)
            .get('/users/')
            .set(sessionManagerService.HEADER_NAME, loggedRes.headers[sessionManagerService.HEADER_NAME])
            .then(res => {
              res.should.have.status(200);
            })
        ));
  });
});
