process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = process.env.JWT_SECRET || 'test_secret';

const { MongoMemoryServer } = require('mongodb-memory-server');
const { mongoose, User, Note } = require('../src/models');

let mongod;

before(async function beforeAll() {
  this.timeout(30000); // first boot downloads a local MongoDB binary
  mongod = await MongoMemoryServer.create();
  await mongoose.connect(mongod.getUri());
});

afterEach(async () => {
  // Keep tests isolated from one another
  await Note.deleteMany({});
  await User.deleteMany({});
});

after(async () => {
  await mongoose.disconnect();
  if (mongod) await mongod.stop();
});
