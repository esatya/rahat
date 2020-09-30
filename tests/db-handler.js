const mongoose = require('mongoose');
/**
 * Connect to the in-memory database.
 */
module.exports.connect = async () => {
  const mongooseOpts = {
    useNewUrlParser: true,
    autoReconnect: true,
    reconnectTries: Number.MAX_VALUE,
    reconnectInterval: 1000,
  };

  await mongoose.connect('mongodb://localhost:27017/unitTests', mongooseOpts);

  // mongoose.connection.once('open', () => {
  //   console.log(`MongoDB successfully connected to ${uri}`);
  // });
};

/**
 * Drop database, close the connection and stop mongod.
 */
module.exports.closeDatabase = async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
};

/**
 * Remove all the data for all db collections.
 */
module.exports.clearDatabase = async () => {
  const { collections } = mongoose.connection;

  for (const key in collections) {
    const collection = collections[key];
    await collection.deleteMany();
  }
};
