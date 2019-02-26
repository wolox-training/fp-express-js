const chai = require('chai'),
  dictum = require('dictum.js'),
  server = require('../app'),
  should = chai.should(),
  albumService = require('../app/services/albums'),
  userService = require('../app/services/users'),
  bcryptService = require('../app/services/bcrypt'),
  sessionManagerService = require('../app/services/sessionManager');

const testToken = sessionManagerService.createToken({ email: 'test@wolox.com.ar' });
const wrongToken = sessionManagerService.createToken({ email: 'not-exist@wolox.com.ar' });

describe('albums controller', () => {
  beforeEach('create test user in db', () =>
    userService.create({
      firstName: 'test',
      lastName: 'wolox',
      email: 'test@wolox.com.ar',
      password: bcryptService.encryptPassword('12345678')
    })
  );
  beforeEach('create test user and album in db', () => albumService.create('1', '1'));
  describe('/albums POST buy', () => {
    it('should be successful buying a new album', () =>
      chai
        .request(server)
        .post('/albums/2')
        .set(sessionManagerService.HEADER_NAME, testToken)
        .then(res => {
          res.should.have.status(201);
          albumService.findBy({ albumId: '2', userId: '1' }).then(albumFound => should.exist(albumFound));
          dictum.chai(res);
        }));
    it('should fail when buying a album that has been bought by the same user', () =>
      chai
        .request(server)
        .post('/albums/1')
        .set(sessionManagerService.HEADER_NAME, testToken)
        .then(res => {
          res.should.have.status(400);
          res.body.message.should.equal('The album with id: 1 was already bought by the user');
        }));
    it('should fail when the user is not logged in', () =>
      chai
        .request(server)
        .post('/albums/1')
        .then(res => {
          res.should.have.status(400);
          res.body.message.should.equal('The user is not logged in');
        }));
    it('should fail when the user does not exists', () =>
      chai
        .request(server)
        .post('/albums/1')
        .set(sessionManagerService.HEADER_NAME, wrongToken)
        .then(res => {
          res.should.have.status(404);
          res.body.message.should.equal('The user with email: not-exist@wolox.com.ar could not be found');
        }));
  });
});
