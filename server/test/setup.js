process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = process.env.JWT_SECRET || 'test_secret';

const { MongoMemoryServer } = require('mongodb-memory-server');
const { mongoose, User, Note } = require('../src/models');

let mongod;

module.exports = {
  mochaHooks: {
    async beforeAll() {
      this.timeout(30000);
      mongod = await MongoMemoryServer.create();
      await mongoose.connect(mongod.getUri());
    },

    async afterEach() {
      // Keep tests isolated from one another
      await Note.deleteMany({});
      await User.deleteMany({});
    },

    async afterAll() {
      await mongoose.disconnect();
      if (mongod) await mongod.stop();
    },
  },
};