const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

const agency = {
  name: 'Test agency',
  phone: '9801101234',
  email: 'rahat_test@mailinator.com',
  address: 'Kathmandu',
  token: {
    name: 'Test Token',
    symbol: 'TKN',
    supply: 100000,
  },
};

let mongoServer;

module.exports = {

  async connectDatabase() {
    const mongooseOpts = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      useCreateIndex: true,
    };

    mongoServer = new MongoMemoryServer({
      binary: {
        version: '4.2.10',
      },
    });
    const URI = await mongoServer.getUri();

    await mongoose.connect(URI, mongooseOpts);
  },

  async closeDatabase(done) {
    mongoose.disconnect(done);
    await mongoServer.stop();
  },

  async clearDatabase() {
    const collections = await mongoose.connection.db.collections();

    for (const collection of collections) {
      await collection.deleteMany();
    }
  },
};
