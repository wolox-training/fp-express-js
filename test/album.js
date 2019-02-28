const chai = require('chai'),
  dictum = require('dictum.js'),
  server = require('../app'),
  should = chai.should(),
  nock = require('nock'),
  albumService = require('../app/services/albums'),
  userService = require('../app/services/users'),
  bcryptService = require('../app/services/bcrypt'),
  sessionManagerService = require('../app/services/sessionManager');

const testToken = sessionManagerService.createToken({
  id: 1,
  email: 'test@wolox.com.ar',
  password: '12345678'
});

const wrongToken = sessionManagerService.createToken({ email: 'not-exist@wolox.com.ar' });

const albumsNock = nock('https://jsonplaceholder.typicode.com')
  .get('/albums')
  .reply(200, [
    {
      userId: '1',
      id: '1',
      title: 'quidem molestiae enim'
    },
    {
      userId: '2',
      id: '2',
      title: 'no vimo'
    }
  ]);

const albumNock = nock('https://jsonplaceholder.typicode.com')
  .get('/albums?id=2')
  .reply(200, [
    {
      userId: '1',
      id: '2',
      title: 'Batman rules'
    }
  ]);

const photosNock = nock('https://jsonplaceholder.typicode.com')
  .get('/photos?albumId=1')
  .reply(200, [
    {
      albumId: '1',
      id: '1',
      title: 'quidem molestiae enim',
      url: 'testurl',
      thumbnailUrl: 'testurl'
    },
    {
      albumId: '1',
      id: '1',
      title: 'quidem molestiae enim',
      url: 'testurl',
      thumbnailUrl: 'testurl'
    }
  ]);

describe('albums controller', () => {
  beforeEach('create test user in db', () =>
    userService.create({
      firstName: 'test',
      lastName: 'wolox',
      email: 'test@wolox.com.ar',
      password: bcryptService.encryptPassword('12345678')
    })
  );
  beforeEach('create test album in db', () => albumService.create({ id: '1', title: 'batman' }, '1'));
  beforeEach('create test album in db', () => albumService.create({ id: '2', title: 'robin' }, '2'));
  describe('/albums POST buy', () => {
    it('should be successful buying a new album', () =>
      chai
        .request(server)
        .post('/albums/2')
        .set(sessionManagerService.HEADER_NAME, testToken)
        .then(res => {
          res.should.have.status(201);
          albumService
            .findBy({ albumId: '2', title: 'Batman rules', userId: '1' })
            .then(albumFound => should.exist(albumFound));
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
  describe('/albums GET list', () => {
    it('should be successful getting albums list', () =>
      chai
        .request(server)
        .get('/albums/')
        .set(sessionManagerService.HEADER_NAME, testToken)
        .then(res => {
          res.should.have.status(200);
          res.body.should.be.a('array');
          dictum.chai(res);
        }));
    it('should fail when the user is not logged in', () =>
      chai
        .request(server)
        .get('/albums')
        .then(res => {
          res.should.have.status(400);
          res.body.message.should.equal('The user is not logged in');
        }));
  });
  describe('/users/albums/:id/photos GET photos list', () => {
    it('should be successful getting album photos', () =>
      chai
        .request(server)
        .get('/users/albums/1/photos')
        .set(sessionManagerService.HEADER_NAME, testToken)
        .then(res => {
          res.should.have.status(200);
          res.body.should.be.a('array');
          dictum.chai(res);
        }));
    it('should fail when the user is not logged in', () =>
      chai
        .request(server)
        .get('/users/albums/1/photos')
        .then(res => {
          res.should.have.status(400);
          res.body.message.should.equal('The user is not logged in');
        }));
    it('should fail when the user try to get photos from an album that does not belong to him', () =>
      chai
        .request(server)
        .get('/users/albums/2/photos')
        .set(sessionManagerService.HEADER_NAME, testToken)
        .then(res => {
          res.should.have.status(404);
          res.body.message.should.equal('The user test@wolox.com.ar has not bought any album');
        }));
  });
});
