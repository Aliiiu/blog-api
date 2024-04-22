import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const MONGOOSE_CONNECTION_URL = process.env.MONGOOSE_DB_CONNECTION_URL;

export async function connectionToMongoDB() {
	try {
		await mongoose.connect(MONGOOSE_CONNECTION_URL);
		console.log('Mongodb connection established');
	} catch (error) {
		console.error('Error connecting to MongoDB:', error);
	}

	// Handle clean-up on application termination
	process.on('SIGINT', async () => {
		try {
			await mongoose.connection.close();
			console.log('Mongoose connection closed');
			process.exit(0);
		} catch (error) {
			console.error('Error closing Mongoose connection:', error);
			process.exit(1);
		}
	});

	mongoose.connection.on('error', (error) => {
		console.error('MongoDB connection error:', error);
	});
}
