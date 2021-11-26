const mongoose = require('mongoose');

module.exports = {
	async connectDatabase() {
		await mongoose.connect(global.__MONGO_URI__, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
			useFindAndModify: false
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
	}
};
