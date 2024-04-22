import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const Schema = mongoose.Schema;

const UserSchema = new Schema(
	{
		firstName: {
			type: String,
			required: true,
			trim: true,
		},
		lastName: {
			type: String,
			required: true,
			trim: true,
		},
		email: {
			type: String,
			unique: true,
			required: true,
			lowercase: true,
			trim: true,
		},
		password: {
			type: String,
			required: true,
			trim: true,
		},
	},
	{
		timestamps: true,
		toJSON: {
			virtuals: true, // Ensure virtuals are included when document is converted to JSON
			transform: function (doc, ret) {
				// Replace _id with id
				ret.id = ret._id;
				delete ret._id;
				delete ret.__v; // Optional: remove version key
				delete ret.password; // Important: remove password field for security
			},
		},
	}
);

UserSchema.pre('save', async function (next) {
	const hash = await bcrypt.hash(this.password, 10);

	this.password = hash;
	next();
});

UserSchema.methods.isValidPassword = async function (password) {
	const user = this;
	const compare = await bcrypt.compare(password, user.password);

	return compare;
};

export default UserSchema;
