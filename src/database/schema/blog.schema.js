import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const BlogSchema = new Schema(
	{
		title: {
			type: String,
			required: [true, 'Title is required'],
			unique: [true, 'Blog title must be unique'],
			trim: true,
		},
		description: {
			type: String,
			trim: true,
		},
		author: {
			type: Schema.Types.ObjectId,
			ref: 'users',
			required: true,
		},
		state: {
			type: String,
			enum: ['published', 'draft'],
			default: 'draft',
		},
		reading_time: {
			type: Number,
			default: 0,
		},
		reading_count: {
			type: Number,
			default: 0,
		},
		tags: {
			type: [String],
			default: [],
		},
		body: {
			type: String,
			required: [true, 'Body is required'],
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

BlogSchema.pre('save', function (next) {
	this.reading_time = calculateReadingTime(this.body);
	next();
});

// A simple function to calculate reading time
function calculateReadingTime(text) {
	const wordsPerMinute = 200; // Average reading speed
	const words = text.split(' ').length;
	const minutes = words / wordsPerMinute;
	return Math.ceil(minutes);
}

export default BlogSchema;
