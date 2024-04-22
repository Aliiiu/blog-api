import { ErrorWithStatus } from '../exceptions/error-with-status.exceptions.js';
import BlogModel from '../models/blog.js';

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

export const getAllBlogPosts = async (page, limit) => {
	const skip = (page - 1) * limit;
	const totalPosts = await BlogModel.countDocuments(); // Count the total posts in the database
	const totalPages = Math.ceil(totalPosts / limit); // Calculate the total number of pages

	const posts = await BlogModel.find()
		.skip(skip)
		.limit(limit)
		.populate({
			path: 'author',
			select: 'firstName lastName email createdAt',
		})
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
