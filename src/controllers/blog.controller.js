import * as blogService from '../services/blog.service.js';

export const createBlogPost = (req, res) => {
	const postBody = req.body;
	const { id: userId } = req.user;

	blogService
		.addBlogPost(postBody, userId)
		.then((post) => {
			res.send({
				message: 'Blog created',
				data: post,
			});
		})
		.catch((err) => {
			console.log(err);
			res.status(err.status || 500);
			res.send({
				message: err.message,
			});
		});
};

export const getAllPosts = (req, res) => {
	let page = Number(req.query.page) || 1;
	page = page < 1 ? 1 : page;
	let limit = Number(req.query.limit) || 20; // Set a default limit
	limit = limit < 1 ? 20 : limit;

	blogService
		.getAllBlogPosts(page, limit)
		.then((result) => {
			res.send({
				message: 'All Posts',
				totalPages: result.totalPages,
				currentPage: result.currentPage,
				totalPosts: result.totalPosts,
				data: result.posts,
			});
		})
		.catch((err) => {
			console.log(err);
			res.status(500).send({
				message: 'Error retrieving posts',
				error: err.message,
			});
		});
};

export const getPost = (req, res) => {
	const postId = req.params.id;

	blogService
		.getBlogPost(postId)
		.then((post) => {
			res.send({
				message: 'Post',
				data: post,
			});
		})
		.catch((err) => {
			console.log(err);
			res.status(err.status || 500);
			res.send({
				message: err.message,
			});
		});
};

export const updatePost = (req, res) => {
	const id = req.params.id;
	const body = req.body;
	const { id: userId } = req.user;

	blogService
		.updatePost(id, body, userId)
		.then((post) => {
			res.send({
				message: 'Post updated successfully',
				data: post,
			});
		})
		.catch((err) => {
			console.log(err);
			res.status(err.status || 500);
			res.send({
				message: err.message,
			});
		});
};

export const deletePost = (req, res) => {
	const id = req.params.id;
	const { id: userId } = req.user;

	blogService
		.deletePost(id, userId)
		.then((post) => {
			res.send({
				message: 'Post Deleted Successfully',
			});
		})
		.catch((err) => {
			console.log(err);
			res.status(err.status || 500);
			res.send({
				message: err.message,
			});
		});
};
