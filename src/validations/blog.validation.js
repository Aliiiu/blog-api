import Joi from 'joi';

export const createBlogSchema = Joi.object({
	title: Joi.string().required(),
	description: Joi.string(),
	state: Joi.string().valid('published', 'draft').default('draft'),
	reading_time: Joi.number().default(0),
	reading_count: Joi.number().default(0),
	body: Joi.string().required(),
	tags: Joi.array().items(Joi.string()),
	author: Joi.string().hex().length(24).required(),
});

export const updateBlogSchema = Joi.object({
	title: Joi.string().required(),
	body: Joi.string().required(),
});
