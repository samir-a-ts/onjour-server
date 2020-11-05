import mongoose from 'mongoose';
import userSchema from './main_user';

const directorObj = Object.assign(
    userSchema,
    {},
);

const directorSchema = new mongoose.Schema(directorObj);

const DirectorSchema = mongoose.model('Director', directorSchema, 'users');

export default DirectorSchema;