import mongoose from 'mongoose';
import BlogSchema from '../database/schema/blog.schema.js';

const BlogModel = mongoose.model('blogs', BlogSchema);

export default BlogModel;
