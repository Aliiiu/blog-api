import express from 'express';
import * as blogController from '../controllers/blog.controller.js';

const blogRoute = express.Router();

blogRoute.post('/', blogController.createBlogPost);
blogRoute.get('/', blogController.getAllPosts);
blogRoute.get('/:id', blogController.getPost);
blogRoute.put('/:id', blogController.updatePost);
blogRoute.delete('/:id', blogController.deletePost);

export default blogRoute;
