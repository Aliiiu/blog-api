import express from 'express';
import * as blogController from '../controllers/blog.controller.js';
import passport from 'passport';
import { generateMiddleWare } from '../middleware/validation.middleware.js';
import {
	createBlogSchema,
	updateBlogSchema,
} from '../validations/blog.validation.js';

const blogRoute = express.Router();

blogRoute.post(
	'/',
	generateMiddleWare(createBlogSchema),
	blogController.createBlogPost
);
blogRoute.get('/', blogController.getAllPosts);
blogRoute.get(
	'/:id',
	passport.authenticate('jwt', { session: false }),
	blogController.getPost
);
blogRoute.get(
	'/author/:authorId',
	passport.authenticate('jwt', { session: false }),
	blogController.getBlogPostByAuthor
);
blogRoute.put(
	'/:id',
	generateMiddleWare(updateBlogSchema),
	passport.authenticate('jwt', { session: false }),
	blogController.updatePost
);
blogRoute.delete(
	'/:id',
	passport.authenticate('jwt', { session: false }),
	blogController.deletePost
);

export default blogRoute;
