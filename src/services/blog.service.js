import { ErrorWithStatus } from '../exceptions/error-with-status.exceptions.js';
import BlogModel from '../models/blog.js';
import UserModel from '../models/user.js';

export const addBlogPost = async (blogPost, userId) => {
	const postCreated = await BlogModel.create({ ...blogPost, author: userId });

	if (!postCreated) {
		throw new ErrorWithStatus('Error creating post', 500);
	}

	// Then, populate the user data in the created post
	const populatedPost = await BlogModel.findById(postCreated._id)
		.populate({
			path: 'author',
			select: 'firstName lastName email',
		})
		.exec();

	return populatedPost;
};

export const getAllBlogPosts = async (page, limit, searchQuery, sortParams) => {
	const skip = (page - 1) * limit;

	// First, find users by email to get their IDs
	let authorIds = [];
	if (searchQuery?.authorEmail) {
		try {
			const user = await UserModel.find({
				email: { $regex: searchQuery?.authorEmail, $options: 'i' },
			}).select('id');
			authorIds = user;
		} catch (error) {
			new ErrorWithStatus('Unable to filter blogs by authorEmail', 500);
		}
	}

	// Build the query object for filtering based on search criteria
	const queryObj = {};
	if (authorIds?.length > 0) {
		queryObj['author'] = { $in: authorIds }; // case-insensitive search
	}
	if (searchQuery.title) {
		queryObj['title'] = { $regex: searchQuery.title, $options: 'i' }; // case-insensitive search
	}
	if (searchQuery.tags) {
		queryObj['tags'] = { $in: searchQuery.tags.split(',') }; // supports multiple tags, separated by commas
	}

	const totalPosts = await BlogModel.countDocuments(queryObj); // Count the total posts based on search filters
	const totalPages = Math.ceil(totalPosts / limit); // Calculate the total number of pages

	// Apply sorting if sortParams is not empty
	let sort = {};
	if (sortParams) {
		sortParams.split(',').forEach((param) => {
			let [key, order] = param.split(':');
			sort[key] = order === 'desc' ? -1 : 1;
		});
	}

	const posts = await BlogModel.find(queryObj)
		.skip(skip)
		.limit(limit)
		.populate({
			path: 'author',
			select: 'firstName lastName email createdAt',
		})
		.sort(sort) // Apply sorting
		.exec();

	return {
		totalPages,
		currentPage: page,
		totalPosts,
		posts,
	};
};

export const getBlogPost = async (id) => {
	const post = await BlogModel.findById(id);
	if (!post) {
		throw new ErrorWithStatus('Post not found', 404);
	}

	return await BlogModel.findById(id)
		.populate({
			path: 'author',
			select: 'firstName lastName email',
		})
		.exec();
};

export const updatePost = async (id, postContent, userId) => {
	const post = await BlogModel.findById(id);
	if (!post) {
		throw new ErrorWithStatus('Post not found', 404);
	}

	// Check if the logged-in user is the post creator
	if (post.author.toString() !== userId) {
		throw new ErrorWithStatus('Unauthorized to update this post', 403);
	}

	return await BlogModel.findByIdAndUpdate(id, postContent, { new: true })
		.populate({
			path: 'author',
			select: 'firstName lastName email',
		})
		.exec();
};

export const fetchBlogsByAuthor = async (
	authorId,
	page = 1,
	limit = 10,
	state = null
) => {
	const query = { author: authorId };
	if (state) {
		query.state = state;
	}

	try {
		// First, find out how many items are there in total
		const totalItems = await BlogModel.countDocuments(query);

		const totalPages = Math.ceil(totalItems / limit);

		// Fetching blogs with pagination
		const posts = await BlogModel.find(query)
			.skip((page - 1) * limit)
			.limit(limit)
			.sort({ timestamp: -1 });

		return {
			totalItems,
			totalPages,
			currentPage: page,
			posts,
		};
	} catch (error) {
		throw new ErrorWithStatus('Error retrieving blogs', 500);
	}
};

export const deletePost = async (id, userId) => {
	const post = await BlogModel.findById(id);
	if (!post) {
		throw new ErrorWithStatus('Post not found', 404);
	}

	// Check if the logged-in user is the post creator
	if (post.author.toString() !== userId) {
		throw new ErrorWithStatus('Unauthorized to delete this post', 403);
	}

	return await BlogModel.findByIdAndDelete(id);
};
