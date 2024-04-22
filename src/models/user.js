import mongoose from 'mongoose';
import UserSchema from '../database/schema/user.schema.js';

const UserModel = mongoose.model('users', UserSchema);

export default UserModel;
