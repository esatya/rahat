const config = require('config');
const mongoose = require('mongoose');

module.exports = {
  async connectDatabase() {
    await mongoose.connect(config.get('test.db'), {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      useCreateIndex: true,
    });
    await mongoose.connection.db.dropDatabase();
  },

  async closeDatabase(done) {
    await mongoose.connection.db.dropDatabase();
    await mongoose.disconnect(done);
  },

  async clearDatabase() {
    const collections = await mongoose.connection.db.collections();

    for (const collection of collections) {
      await collection.deleteMany();
    }
  },
};
