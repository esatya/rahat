const mongoose = require('mongoose');

module.exports = {
  async connectDatabase() {
    const mongooseOpts = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      useCreateIndex: true,
    };
    try {
      await mongoose.connect(global.__MONGO_URI__, mongooseOpts);
    } catch (e) {
      throw Error(e);
    }
  },
  async closeDatabase() {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
  },

};
