const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../src/app');

chai.use(chaiHttp);
const { expect } = chai;

describe('Auth API', () => {
  const validUser = { name: 'Jane Doe', email: 'jane@example.com', password: 'secret123' };

  describe('POST /api/auth/signup', () => {
    it('creates a new user and returns a token', async () => {
      const res = await chai.request(app).post('/api/auth/signup').send(validUser);

      expect(res).to.have.status(201);
      expect(res.body.success).to.be.true;
      expect(res.body.data.user.email).to.equal(validUser.email);
      expect(res.body.data.user).to.not.have.property('password');
      expect(res.body.data.token).to.be.a('string');
    });

    it('rejects a duplicate email with 409', async () => {
      await chai.request(app).post('/api/auth/signup').send(validUser);
      const res = await chai.request(app).post('/api/auth/signup').send(validUser);

      expect(res).to.have.status(409);
      expect(res.body.success).to.be.false;
    });

    it('rejects an invalid payload with 400', async () => {
      const res = await chai
        .request(app)
        .post('/api/auth/signup')
        .send({ name: '', email: 'not-an-email', password: '123' });

      expect(res).to.have.status(400);
      expect(res.body.details).to.be.an('array');
    });
  });

  describe('POST /api/auth/login', () => {
    beforeEach(async () => {
      await chai.request(app).post('/api/auth/signup').send(validUser);
    });

    it('logs in with correct credentials', async () => {
      const res = await chai
        .request(app)
        .post('/api/auth/login')
        .send({ email: validUser.email, password: validUser.password });

      expect(res).to.have.status(200);
      expect(res.body.data.token).to.be.a('string');
    });

    it('rejects incorrect password with 401', async () => {
      const res = await chai
        .request(app)
        .post('/api/auth/login')
        .send({ email: validUser.email, password: 'wrongpassword' });

      expect(res).to.have.status(401);
    });
  });

  describe('GET /api/auth/me', () => {
    it('rejects requests without a token', async () => {
      const res = await chai.request(app).get('/api/auth/me');
      expect(res).to.have.status(401);
    });

    it('returns the authenticated user profile', async () => {
      const signupRes = await chai.request(app).post('/api/auth/signup').send(validUser);
      const { token } = signupRes.body.data;

      const res = await chai.request(app).get('/api/auth/me').set('Authorization', `Bearer ${token}`);

      expect(res).to.have.status(200);
      expect(res.body.data.user.email).to.equal(validUser.email);
    });
  });
});
