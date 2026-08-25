const chai = require('chai');
const chaiHttp = require('chai-http');
const mongoose = require('mongoose');
const app = require('../src/app');
const noteService = require('../src/services/noteService');
const ApiError = require('../src/utils/ApiError');

chai.use(chaiHttp);
const { expect } = chai;

const registerAndGetToken = async () => {
  const res = await chai
    .request(app)
    .post('/api/auth/signup')
    .send({ name: 'Notes User', email: `user${Date.now()}@example.com`, password: 'secret123' });
  return res.body.data.token;
};

describe('Notes API', () => {
  let token;

  beforeEach(async () => {
    token = await registerAndGetToken();
  });

  it('rejects unauthenticated access', async () => {
    const res = await chai.request(app).get('/api/notes');
    expect(res).to.have.status(401);
  });

  it('creates a note for the authenticated user', async () => {
    const res = await chai
      .request(app)
      .post('/api/notes')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'My first note', content: '<p>Hello world</p>' });

    expect(res).to.have.status(201);
    expect(res.body.data.note.title).to.equal('My first note');
  });

  it('rejects a note with no title', async () => {
    const res = await chai
      .request(app)
      .post('/api/notes')
      .set('Authorization', `Bearer ${token}`)
      .send({ content: 'no title here' });

    expect(res).to.have.status(400);
  });

  it('lists only the current user notes', async () => {
    await chai.request(app).post('/api/notes').set('Authorization', `Bearer ${token}`).send({ title: 'Note A' });
    await chai.request(app).post('/api/notes').set('Authorization', `Bearer ${token}`).send({ title: 'Note B' });

    const otherToken = await registerAndGetToken();
    await chai.request(app).post('/api/notes').set('Authorization', `Bearer ${otherToken}`).send({ title: 'Not mine' });

    const res = await chai.request(app).get('/api/notes').set('Authorization', `Bearer ${token}`);

    expect(res).to.have.status(200);
    expect(res.body.data.notes).to.have.lengthOf(2);
  });

  it('updates a note owned by the user', async () => {
    const created = await chai
      .request(app)
      .post('/api/notes')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Original title' });

    const res = await chai
      .request(app)
      .put(`/api/notes/${created.body.data.note.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Updated title' });

    expect(res).to.have.status(200);
    expect(res.body.data.note.title).to.equal('Updated title');
  });

  it('returns 404 when updating a non-existent note', async () => {
    const fakeId = new mongoose.Types.ObjectId().toString();
    const res = await chai
      .request(app)
      .put(`/api/notes/${fakeId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Does not matter' });

    expect(res).to.have.status(404);
  });

  it('returns 404 for a malformed note id', async () => {
    const res = await chai
      .request(app)
      .get('/api/notes/not-a-valid-id')
      .set('Authorization', `Bearer ${token}`);

    expect(res).to.have.status(404);
  });

  it('prevents a user from accessing another user note', async () => {
    const created = await chai
      .request(app)
      .post('/api/notes')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Private note' });

    const otherToken = await registerAndGetToken();
    const res = await chai
      .request(app)
      .get(`/api/notes/${created.body.data.note.id}`)
      .set('Authorization', `Bearer ${otherToken}`);

    expect(res).to.have.status(404);
  });

  it('deletes a note', async () => {
    const created = await chai
      .request(app)
      .post('/api/notes')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Temp note' });

    const res = await chai
      .request(app)
      .delete(`/api/notes/${created.body.data.note.id}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res).to.have.status(200);
  });
});

describe('noteService (unit)', () => {
  it('throws ApiError.notFound for an unknown note id', async () => {
    const fakeUserId = new mongoose.Types.ObjectId().toString();
    const fakeNoteId = new mongoose.Types.ObjectId().toString();
    try {
      await noteService.getNoteById(fakeUserId, fakeNoteId);
      throw new Error('should have thrown');
    } catch (err) {
      expect(err).to.be.instanceOf(ApiError);
      expect(err.statusCode).to.equal(404);
    }
  });

  it('throws ApiError.notFound for a malformed note id', async () => {
    const fakeUserId = new mongoose.Types.ObjectId().toString();
    try {
      await noteService.getNoteById(fakeUserId, 'not-a-valid-id');
      throw new Error('should have thrown');
    } catch (err) {
      expect(err).to.be.instanceOf(ApiError);
      expect(err.statusCode).to.equal(404);
    }
  });
});
